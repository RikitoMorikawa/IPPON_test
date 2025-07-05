import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import ipponApi from "../config/axios";
import { AuthState, LoginFormInputs } from "../types";

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

export const changeAdminStatus = createAsyncThunk<any, any>(
  "user/changeAdminStatus",
  async ({ member_id, email, newStatus }, { rejectWithValue }) => {
    const clientId = Cookies.get("clientID");
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
    logout: (state) => {
      state.loginState.isLoggedIn = false;
      state.user = {
        clientID: "",
        clientName: "",
        employeeID: "",
        role: "",
        token: "",
      };

      // Clear cookies
      Cookies.remove("clientID");
      Cookies.remove("clientName");
      Cookies.remove("employeeID");
      Cookies.remove("role");
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

      state.user.clientID = action.payload.data.data.client_id;
      state.user.clientName = action.payload.data.data.client_name;
      state.user.employeeID = action.payload.data.data.employee_id;
      state.user.role = action.payload.data.data.role;
      state.user.token = action.payload.data.data.token;

      Cookies.set("clientID", action.payload.data.data.client_id, {
        expires: 1,
      });
      Cookies.set("clientName", action.payload.data.data.client_name, {
        expires: 1,
      });
      Cookies.set("employeeID", action.payload.data.data.employee_id, {
        expires: 1,
      });
      Cookies.set("role", action.payload.data.data.role, {
        expires: 1,
      });
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
  },
});

export default authSlice.reducer;

// Export the action creators
export const { logout, setRedirectPath, clearRedirectPath } = authSlice.actions;
