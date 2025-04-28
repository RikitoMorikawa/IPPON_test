import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { Box, Button } from '@mui/material';
import Logo from '../../../assets/logo.png';
import CustomInput from '../../../components/CustomInput';
import AuthenticationStatus from '../../../components/AuthenticationStatus';
import { usernameRules } from '../../../schema/loginSchema';
import { checkMail } from '../../../store/authSlice';
import { AppDispatch } from '../../../store';
import '../Login/Login.css'
/* eslint-disable @typescript-eslint/no-explicit-any */
const CheckMail = () => {
    const [loginStatus, setLoginStatus] = useState('');
		const [failMessage,setFailMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
    } = useForm(); 
  
    const usernameValue = watch('username');
  
    const isHasValue = usernameValue ;
    const onSubmit = async(data:any) => {
      const email= data.username;
      Cookies.set('email',email);
          try {
            const result = await dispatch(checkMail({email}));
            const response = result as any;
            if (response?.payload?.data?.status===201) {
                navigate('/otp',{replace: true,state: email})
                setLoginStatus('success');
            } else if(response?.payload?.status===400){
              setLoginStatus('fail');
							setFailMessage(response.payload.message);
              Cookies.remove('email');
            }
          } catch (error) {
            console.error('Error during login:', error);
            setLoginStatus('fail');
          }
    };
  
    useEffect(()=>{
      Cookies.remove('email');
    },[])
    return (
    <Box className='container'>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        className='formContainer'
      >
        {loginStatus==='fail' ? <AuthenticationStatus status='fail' text={failMessage === '' ? '' :failMessage}/> :<></>}
        <Box className='fieldContainer'>
          <Box className='logoContainer'>
            <img src={Logo} alt="Logo" />
          </Box>
          <Box className='check_mail_content'>
          <p className='check_mail_title'>パスワード再発行</p>
          <p className='check_mail_text'>ワンタイムパスワードを メールアドレスへ送付します。</p>
          </Box>
          <Box className='inputContainer'>
          <CustomInput placeholder="登録済のメールアドレス"
              name="username"
              register={register}
              helperText={typeof errors.username?.message === 'string' ? errors.username?.message : '登録済のメールアドレス'}
              error={!!errors.username} 
              rules={usernameRules}/>
          </Box>
        <Button type="submit" variant="contained" onMouseDown={(e) => e.preventDefault()} className={`button ${!isHasValue ? 'buttonDisable': ''}`} disabled={!isHasValue}>
        ワンタイムパスワードの発行
        </Button>
      </Box>
      </Box>
    </Box>
    )
}
/* eslint-enable @typescript-eslint/no-explicit-any */
export default CheckMail
