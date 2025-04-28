import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { Box, Button} from '@mui/material';
import Logo from '../../../assets/logo.png';
import AuthenticationStatus from '../../../components/AuthenticationStatus';
import CustomInput from '../../../components/CustomInput';
import { passwordRules, usernameRules } from '../../../schema/loginSchema';
import { LoginFormInputs } from '../../../types';
import { login } from '../../../store/authSlice';
import { AppDispatch } from '../../../store';
import './Login.css'

/* eslint-disable @typescript-eslint/no-explicit-any */
const Login : React.FC = () => {
  const [loginStatus, setLoginStatus] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<any>(); 

  const usernameValue = watch('username');
  const passwordValue = watch('password');

  const isHasValue = usernameValue && passwordValue;
  const onSubmit:SubmitHandler<LoginFormInputs> = async(data) => {
    const username= data.username;
    const password= data.password;
    try {
      const result = await dispatch(login({username,password}));
      const response = result as any;
      if (response.payload.data.status===200) {
        navigate('/members');
        setLoginStatus('success');
      } else {
        setLoginStatus('fail');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginStatus('fail');
    }
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
      {loginStatus==='success' ? <AuthenticationStatus status='success' text='ワンタイムパスワードが 再発行されました。'/> : loginStatus==='fail' ? <AuthenticationStatus status='fail' text='ログイン情報が間違っています。'/> :<></>}
      <Box className='fieldContainer'>
        <Box className='logoContainer'>
          <img src={Logo} alt="Logo" />
        </Box>
        <Box className='inputContainer'>
        <CustomInput placeholder="メールアドレス"
            name="username"
            register={register}
            helperText={typeof errors.username?.message === 'string' ? errors.username?.message : 'メールアドレス'}
            error={!!errors.username} 
            rules={usernameRules}/>
        <CustomInput
            placeholder="パスワード"
            name="password"
            type="password"
            register={register}
            helperText={typeof errors.password?.message === 'string' ? errors.password?.message : 'パスワード'}
            error={!!errors.password}
            rules={passwordRules}
          />
        </Box>
      <Button type="submit" variant="contained" onMouseDown={(e) => e.preventDefault()} className={`button ${!isHasValue ? 'buttonDisable': ''}`} disabled={!isHasValue}>
      ログイン
      </Button>
      <Link to='/checkmail' className='link'>
      パスワードをお忘れですか？
      </Link>
    </Box>
    </Box>
  </Box>
  )
}
/* eslint-enable @typescript-eslint/no-explicit-any */
export default Login