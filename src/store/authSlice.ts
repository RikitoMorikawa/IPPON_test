import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import ipponApi from "../config/axios";
import { AuthState, LoginFormInputs } from "../types";
import { getClientID } from "../utils/authUtils";

const BaseURL = import.meta.env.VITE_API_URL;

export const login = createAsyncThunk<any, LoginFormInputs>(
  "user/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const result = await ipponApi.post(`${BaseURL}/api/v1/auth/signin`, {
        // const result = await ipponApi.post(`${BaseURL}/api/auth/member-signin`, {
        email: username,
        password,
      });
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "An error occurred during login"
      );
    }
  }
);

export const checkMail = createAsyncThunk<any, any>(
  "user/checkMail",
  async ({ email }, { rejectWithValue }) => {
    try {
      const result = await ipponApi.post(`${BaseURL}/api/v1/auth/check-email`, {
        email,
      });
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "An error occurred during check mail"
      );
    }
  }
);

export const requestOtp = createAsyncThunk<any, any>(
  "user/requestOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const result = await ipponApi.post(`${BaseURL}/api/v1/auth/otp`, {
        email,
      });
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "An error occurred during request otp"
      );
    }
  }
);

export const verifyOtp = createAsyncThunk<any, any>(
  "user/verifyOtp",
  async ({ otp, email }, { rejectWithValue }) => {
    try {
      const result = await ipponApi.post(`${BaseURL}/api/v1/auth/verify-otp`, {
        otp,
        email,
      });
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "An error occurred during verify otp"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk<any, any>(
  "user/forgotPassword",
  async ({ newPassword, email, verificationCode }, { rejectWithValue }) => {
    try {
      const result = await ipponApi.post(
        `${BaseURL}/api/v1/auth/reset-password`,
        {
          newPassword,
          email,
          verificationCode,
        }
      );
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "An error occurred during reset password"
      );
    }
  }
);

export const changeMemberPassword = createAsyncThunk<any, any>(
  "user/changeMemberPassword",
  async (
    { memberEmail, iv, oldPassword, newPassword },
    { rejectWithValue }
  ) => {
    try {
      const result = await ipponApi.post(
        `${BaseURL}/api/v1/auth/change-password`,
        {
          email: memberEmail,
          iv,
          oldPassword,
          newPassword,
        }
      );
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred during change password of member."
      );
    }
  }
);

export const changeMemberPasswordByAdmin = createAsyncThunk<any, any>(
  "user/changeMemberPasswordByAdmin",
  async ({ paramsEmail, oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const result = await ipponApi.post(
        `${BaseURL}/api/v1/auth/email-change-password`,
        {
          email: paramsEmail,
          oldPassword,
          newPassword,
        }
      );
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred during change password of member."
      );
    }
  }
);

export const logoutAPI = createAsyncThunk<any, void>(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const result = await ipponApi.post(`${BaseURL}/api/v1/auth/logout`);
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "An error occurred during logout"
      );
    }
  }
);

export const changeAdminStatus = createAsyncThunk<any, any>(
  "user/changeAdminStatus",
  async ({ member_id, email, newStatus }, { rejectWithValue }) => {
    const clientId = getClientID();
    try {
      const result = await ipponApi.post(
        `${BaseURL}/auth/member-approve?is_approve=${newStatus}`,
        {
          member_id,
          client_id: clientId,
          email,
        }
      );
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "An error occurred during reset password"
      );
    }
  }
);

const initialState: AuthState = {
  loginState: {
    isLoggedIn: false,
    loading: false,
    error: false,
    errorMessage: "",
  },
  user: {
    clientID: "",
    clientName: "",
    employeeID: "",
    role: "",
    token: "",
  },
  redirectPath: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutLocal: (state) => {
      state.loginState.isLoggedIn = false;
      state.user = {
        clientID: "",
        clientName: "",
        employeeID: "",
        role: "",
        token: "",
      };

      // Clear only token cookie
      Cookies.remove("token");

      // Clear localStorage and sessionStorage for security
      localStorage.clear();
      sessionStorage.clear();
    },
    setRedirectPath: (state, action) => {
      state.redirectPath = action.payload;
    },
    clearRedirectPath: (state) => {
      state.redirectPath = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action: any) => {
      state.loginState.isLoggedIn = true;
      state.loginState.loading = false;

      // トークンのみを保存（他の情報はJWTに含まれている）
      state.user.token = action.payload.data.data.token;
      
      // トークンのみをCookieに保存
      Cookies.set("token", action.payload.data.data.token.IdToken, {
        expires: 1,
      });
    });
    builder.addCase(login.pending, (state) => {
      state.loginState.loading = true;
    });
    builder.addCase(login.rejected, (state) => {
      state.loginState.loading = false;
      state.loginState.error = true;
    });
    builder.addCase(checkMail.fulfilled, () => {});
    builder.addCase(logoutAPI.fulfilled, (state) => {
      // API logout成功時にローカルログアウト処理を実行
      state.loginState.isLoggedIn = false;
      state.user = {
        clientID: "",
        clientName: "",
        employeeID: "",
        role: "",
        token: "",
      };

      // Clear only token cookie
      Cookies.remove("token");

      // Clear localStorage and sessionStorage for security
      localStorage.clear();
      sessionStorage.clear();
    });
    builder.addCase(logoutAPI.rejected, (state) => {
      // API logout失敗時でもローカルログアウト処理は実行
      state.loginState.isLoggedIn = false;
      state.user = {
        clientID: "",
        clientName: "",
        employeeID: "",
        role: "",
        token: "",
      };

      // Clear only token cookie
      Cookies.remove("token");

      // Clear localStorage and sessionStorage for security
      localStorage.clear();
      sessionStorage.clear();
    });
  },
});

export default authSlice.reducer;

// Export the action creators
export const { logoutLocal, setRedirectPath, clearRedirectPath } = authSlice.actions;
