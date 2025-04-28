import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate,useSearchParams } from 'react-router';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { Box, Button} from '@mui/material';
import Logo from '../../../assets/logo.png';
import SuccessImg from '../../../assets/check_circle.png'
import CustomInput from '../../../components/CustomInput';
import AuthenticationStatus from '../../../components/AuthenticationStatus';
import { confirmPasswordRules, passwordRules } from '../../../schema/loginSchema';
import { LoginFormInputs } from '../../../types';
import { AppDispatch } from '../../../store';
import { changeMemberPassword, changeMemberPasswordByAdmin, forgotPassword } from '../../../store/authSlice';
import '../Login/Login.css'

/* eslint-disable @typescript-eslint/no-explicit-any */
const ForgotPassword : React.FC = () => {
  const [loginStatus, setLoginStatus] = useState('');
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();
  const email =  Cookies.get('email');
  const verificationCode = Cookies.get('otp');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const iv = searchParams.get('iv');
  const paramsEmail = searchParams.get('email');
  console.log("Params email ", paramsEmail)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<any>(); 
  console.log("Iv ", iv)

  const passwordValue = watch('password');
  const oldPasswordValue = watch('old_password');
  const newPasswrodValue = watch('new_password');

  const isHasValue = iv&&iv!==null || paramsEmail&&paramsEmail!==null? oldPasswordValue&& newPasswrodValue : passwordValue;
  const onSubmit:SubmitHandler<LoginFormInputs> = async(data) => {
    const newPassword = iv&&iv!==null?data.new_password : paramsEmail!==null ? data.new_password :  data.password;
    const oldPassword = data.old_password;
    const memberEmail = token;
    try {
      let result;
      if(iv&&iv!==null){
        result = await dispatch(changeMemberPassword({memberEmail,iv,oldPassword,newPassword}));
      }else if(paramsEmail&&paramsEmail!==null){
        result = await dispatch(changeMemberPasswordByAdmin({paramsEmail,oldPassword,newPassword}));
      }
      else{
        result = await dispatch(forgotPassword({newPassword,email,verificationCode}));
      }
      const response = result as any;
      if (response?.payload?.status===200) {
        setLoginStatus('success');
        Cookies.remove('otp');
        Cookies.remove('email');
      } else if(response?.payload?.status===400){
        setLoginStatus('fail');
        Cookies.remove('otp');
        Cookies.remove('email');
      }
    } catch (error) {
      console.error('Error during request otp :', error);
    }
  };

  const navigatePageHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoginStatus('');
    navigate('/login',{replace: true})
  }
  return (
  <Box className='container'>
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      autoComplete="off"
      className='formContainer'
    >
      {loginStatus==='success' ? <AuthenticationStatus status='success' text='パスワードの更新が完了しました。'/> : loginStatus==='fail' ? <AuthenticationStatus status='fail' text='ログイン情報が間違っています。'/> :<></>}
      <Box className='fieldContainer'>
        <Box className='logoContainer'>
          <img src={Logo} alt="Logo" />
        </Box>
        {
          loginStatus==='success' ? 
          <>
            <span style={{display:'flex', justifyContent:'center'}}><img src={SuccessImg} alt="check mark icon"/></span>
            <p style={{fontSize:'12px',fontWeight: '400',lineHeight:'1.5',textAlign:'center',margin:'0'}}>新しいパスワードでアカウントから<br/>ログインできます。</p>
            <Button type="button" onClick={(e)=>navigatePageHandler(e)} variant="contained" className={`button`}>
            ログイン
        </Button>
          </> : <><Box className='check_mail_content'>
          <p className='check_mail_text'>新しいパスワードを設定してください。</p>
          </Box>
        <Box className='inputContainer'>
          {iv&&iv!==null || paramsEmail&&paramsEmail!==null? <>
      <CustomInput
        placeholder="現在のパスワード"
        name="old_password"
        type="password"
        register={register}
        helperText={
          typeof errors.old_password?.message === 'string'
            ? errors.old_password?.message
            : '現在のパスワードを入力してください'
        }
        error={!!errors.old_password}
        rules={passwordRules} // define rules if needed
      />

      <CustomInput
        placeholder="新しいパスワード"
        name="new_password"
        type="password"
        register={register}
        helperText={
          typeof errors.new_password?.message === 'string'
            ? errors.new_password?.message
            : '新しいパスワードを入力してください'
        }
        error={!!errors.new_password}
        rules={passwordRules} // define rules if needed
      />
    </> : <>
    <CustomInput
            placeholder="パスワード123"
            name="password"
            type="password"
            register={register}
            helperText={typeof errors.password?.message === 'string' ? errors.password?.message : 'パスワード123'}
            error={!!errors.password}
            rules={passwordRules}
          />
           <CustomInput
            placeholder="パスワード123"
            name="confirm_password"
            type="password"
            register={register}
            helperText={typeof errors.confirm_password?.message === 'string' ? errors.confirm_password?.message : 'パスワード123'}
            error={!!errors.confirm_password}
            rules={confirmPasswordRules(passwordValue)}
          /></>}

        </Box>
        <Button type="submit" variant="contained" onMouseDown={(e) => e.preventDefault()} className={`button ${!isHasValue ? 'buttonDisable': ''}`} disabled={!isHasValue}>
          ログイン
        </Button></>
        }  
    </Box>
    </Box>
  </Box>
  )
}
/* eslint-enable @typescript-eslint/no-explicit-any */
export default ForgotPassword