import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Logo from "../../../assets/logo.jpg";
import AuthenticationStatus from "../../../components/AuthenticationStatus";
// import CustomInput from "../../../components/CustomInput";
import { passwordRules, usernameRules } from "../../../schema/loginSchema";
import { LoginFormInputs } from "../../../types";
import { login, clearRedirectPath } from "../../../store/authSlice";
import { AppDispatch, RootState } from "../../../store";
import "./Login.css";
import CustomLoading from "../../../components/Loading/Loading";
import CustomInput from "../../../components/CustomInputRenew";
const Login: React.FC = () => {
  const [loginStatus, setLoginStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading: loadingState } = useSelector(
    (state: any) => state.auth.loginState
  );
  const { redirectPath } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormInputs>();

  const usernameValue = watch("username");
  const passwordValue = watch("password");

  // Check if both fields have values and are not just whitespace
  const isFormValid = usernameValue?.trim() && passwordValue?.trim();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const username = data.username;
    const password = data.password;
    try {
      const result = await dispatch(login({ username, password }));
      const response = result as any;
      if (response.payload.data.status === 200) {
        setLoginStatus("success");

        // Navigate to redirect path if available, otherwise to dashboard
        const targetPath = redirectPath || "/dashboard";
        dispatch(clearRedirectPath()); // Clear the redirect path after using it
        navigate(targetPath);
      } else {
        setLoginStatus("fail");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginStatus("fail");
    }
  };

  return (
    <Box className="container">
      {loadingState === false && loginStatus === "success" && (
        <CustomLoading loading={true} />
      )}
      {loginStatus !== "success" && (
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          autoComplete="off"
          className="formContainer"
        >
          {loginStatus === "fail" && (
            <AuthenticationStatus
              status="fail"
              text="ログイン情報が間違っています。"
            />
          )}
          <Box className="fieldContainer">
            <Box className="logoContainer">
              <img src={Logo} alt="Logo" />
            </Box>
            <Box className="inputContainer">
              <CustomInput
                placeholder="メールアドレス"
                name="username"
                register={register}
                helperText={
                  typeof errors.username?.message === "string"
                    ? errors.username?.message
                    : "メールアドレス"
                }
                error={!!errors.username}
                rules={usernameRules}
              />
              <CustomInput
                placeholder="パスワード"
                name="password"
                type={showPassword ? "text" : "password"}
                register={register}
                helperText={
                  typeof errors.password?.message === "string"
                    ? errors.password?.message
                    : "パスワード"
                }
                error={!!errors.password}
                rules={passwordRules}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ opacity: 0.6 }} />
                        ) : (
                          <Visibility sx={{ opacity: 0.6 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Button
              type="submit"
              disableElevation
              variant="contained"
              onMouseDown={(e) => e.preventDefault()}
              className={`button ${
                !isFormValid || loadingState ? "buttonDisable" : ""
              }`}
              disabled={!isFormValid || loadingState}
              sx={{
                "&:disabled": {
                  backgroundColor: "#BFE6EF !important",
                },
              }}
            >
              ログイン
            </Button>
            <Link to="/checkmail" className="link">
              パスワードをお忘れですか？
            </Link>
          </Box>
        </Box>
      )}
    </Box>
  );
};
export default Login;
