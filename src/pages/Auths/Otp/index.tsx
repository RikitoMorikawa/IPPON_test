import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { Box, Button } from '@mui/material';
import { InputAdornment } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import Logo from '../../../assets/logo.jpg';
import AuthenticationStatus from '../../../components/AuthenticationStatus';
import { otpRules } from '../../../schema/loginSchema';
import CustomInput from '../../../components/CustomInput';
import { AppDispatch } from '../../../store';
import { requestOtp, verifyOtp } from '../../../store/authSlice';
import '../Login/Login.css'

/* eslint-disable @typescript-eslint/no-explicit-any */
const Otp = () => {
    const [loginStatus, setLoginStatus] = useState('');
    const [failMessage,setFailMessage] = useState('');
    const [timer, setTimer] = useState(30);
    const [isResendVisible, setIsResendVisible] = useState(false);
    const email = Cookies.get('email');
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
    } = useForm(); 
  
    const otpValue = watch('otp');
  
    const isHasValue = otpValue;
    const onSubmit = async(data:any) => {
      const otp=data.otp
      Cookies.set('otp',otp);
      try {
        const result = await dispatch(verifyOtp({otp,email}));
        const response = result as any;
        if (response?.payload?.status===200) {
          setLoginStatus('success');
          navigate('/forgotpassword',{replace: true,state: {email,otp}})
        } else if(response?.payload?.status===400){
          setLoginStatus('fail');
          setFailMessage(response.payload.message);
          Cookies.remove('otp');
        }
      } catch (error) {
        console.error('Error during request otp :', error);
      }
    };

    //request otp
    const requestOtpHandler = async() => {
      try {
        await dispatch(requestOtp({email}));
      } catch (error) {
        console.error('Error during request otp :', error);
      }
    };

    useEffect(() => {
      if (timer > 0) {
        const countdown = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
  
        return () => clearInterval(countdown);
      }
  
      if (timer === 0) {
        setIsResendVisible(true);
      }
      return undefined;
    }, [timer]);
  
    useEffect(()=>{
      dispatch(requestOtpHandler);
    },[])

    const handleResendOTP = (e:any) => {
      e.preventDefault();
      setTimer(30);
      setIsResendVisible(false);
      dispatch(requestOtpHandler);
    };
    return (
    <Box className='container'>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        className='formContainer'
      >
        {loginStatus==='success' ? <AuthenticationStatus status='success' text='ワンタイムパスワードが 再発行されました。'/> : loginStatus==='fail' ? <AuthenticationStatus status='fail' text={failMessage === '' ? 'ワンタイムパスワードが 間違っています。' :failMessage}/> :<></>}
        <Box className='fieldContainer'>
          <Box className='logoContainer'>
            <img src={Logo} alt="Logo" />
          </Box>
          <Box className='check_mail_content'>
          <p className='check_mail_title'>パスワード再発行</p>
          <p className='check_mail_text'>取得したワンタイムパスワードを入力してください。</p>
          </Box>
          <Box className='inputContainer'>
          <CustomInput placeholder="登録済のメールアドレス"
              name="otp"
              register={register}
              helperText={typeof errors.otp?.message === 'string' ? errors.otp?.message : '登録済のメールアドレス'}
              error={!!errors.otp} 
              rules={otpRules}
              endAdornment={
                  <InputAdornment position="end">
                    {isResendVisible ? (
                      <Button type='button' onClick={(e)=>handleResendOTP(e)} variant="text" sx={{background: 'inherit',position:'absolute',right:'0',color:'#0B9DBD',fontSize: '12px'}}>
                        <ReplayIcon sx={{ fontSize: '16px' }}/>恨む
                      </Button>
                    ) : (
                      <p style={{color:'#0B9DBD'}}>
                      {timer} 秒</p>
                    )}
                  </InputAdornment>
              }/>
          </Box>
        <Button type="submit" 
          disableElevation variant="contained" 
          onMouseDown={(e) => {e.preventDefault()}} 
          className={`button ${!isHasValue ? 'buttonDisable': ''}`} 
          disabled={!isHasValue}
          sx={{
            '&:disabled': {
              backgroundColor: '#BFE6EF !important',
            }
          }}
        >
            確認
        </Button>
      </Box>
      </Box>
    </Box>
    )
}
/* eslint-enable @typescript-eslint/no-explicit-any */
export default Otp
