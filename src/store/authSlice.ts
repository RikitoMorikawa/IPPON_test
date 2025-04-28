import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import ipponApi from '../config/axios'; 
import { AuthState,LoginFormInputs } from '../types';

/* eslint-disable @typescript-eslint/no-explicit-any */
const BaseURL = import.meta.env.VITE_API_URL;

export const login = createAsyncThunk<any, LoginFormInputs>(
  'user/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
    const result = await ipponApi.post(`${BaseURL}/api/auth/member-signin`, {
      email:username,
      password,
    });
    return result;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred during login',
      );
    }
  },
);

export const checkMail = createAsyncThunk<any, any>(
  'user/checkMail',
  async ({ email}, { rejectWithValue }) => {
    try {
    const result = await ipponApi.post(`${BaseURL}/api/auth/check-email`, {
      email,
    });
    return result;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred during check mail',
      );
    }
  },
);

export const requestOtp = createAsyncThunk<any, any>(
  'user/requestOtp',
  async ({ email}, { rejectWithValue }) => {
    try {
    const result = await ipponApi.post(`${BaseURL}/api/auth/otp`, {
      email,
    });
    return result;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred during request otp',
      );
    }
  },
);

export const verifyOtp = createAsyncThunk<any, any>(
  'user/verifyOtp',
  async ({ otp,email}, { rejectWithValue }) => {
    try {
    const result = await ipponApi.post(`${BaseURL}/api/auth/verify-otp`, {
      otp,
      email,
    });
    return result;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred during verify otp',
      );
    }
  },
);

export const forgotPassword = createAsyncThunk<any, any>(
  'user/forgotPassword',
  async ({ newPassword,email,verificationCode}, { rejectWithValue }) => {
    try {
    const result = await ipponApi.post(`${BaseURL}/api/auth/member/reset-password`, {
      newPassword,
      email,
      verificationCode,
    });
    return result;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred during reset password',
      );
    }
  },
);

export const changeMemberPassword = createAsyncThunk<any, any>(
  'user/changeMemberPassword',
  async ({memberEmail,iv,oldPassword,newPassword}, { rejectWithValue }) => {
    try {
    const result = await ipponApi.post(`${BaseURL}/api/auth/member/change-password`, {
      email:memberEmail,
      iv,
      oldPassword,
      newPassword,
    });
    return result;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred during change password of member.',
      );
    }
  },
);

export const changeMemberPasswordByAdmin = createAsyncThunk<any, any>(
  'user/changeMemberPasswordByAdmin',
  async ({paramsEmail,oldPassword,newPassword}, { rejectWithValue }) => {
    try {
    const result = await ipponApi.post(`${BaseURL}/api/auth/member/email-change-password`, {
      email:paramsEmail,
      oldPassword,
      newPassword,
    });
    return result;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred during change password of member.',
      );
    }
  },
);

export const changeAdminStatus = createAsyncThunk<any, any>(
  'user/changeAdminStatus',
  async ({member_id,email,newStatus}, { rejectWithValue }) => {
    const clientId = Cookies.get('clientID');
    try {
    const result = await ipponApi.post(`${BaseURL}/auth/member-approve?is_approve=${newStatus}`, {
      member_id,
      client_id: clientId,
      email,
    });
    console.log("Result ", result)
    return result;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred during reset password',
      );
    }
  },
);

const initialState: AuthState = {
  loginState: {
    isLoggedIn: false,
    loading: false,
    error: false,
    errorMessage: '',
  },
  user: {
    clientID: '',
    clientName: '',
    employeeID: '',
    role: '',
    token: '',
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action: any) => {
      state.loginState.isLoggedIn = true;
      state.loginState.loading = false;

      state.user.clientID = action.payload.data.data.client_id;
      state.user.clientName = action.payload.data.data.client_name;
      state.user.employeeID = action.payload.data.data.employee_id;
      state.user.role = action.payload.data.data.role;
      state.user.token = action.payload.data.data.token;

      Cookies.set('clientID', action.payload.data.data.client_id, {
        expires: 1,
      });
      Cookies.set('clientName', action.payload.data.data.client_name, {
        expires: 1,
      });
      Cookies.set('employeeID', action.payload.data.data.employee_id, {
        expires: 1,
      });
      Cookies.set('role', action.payload.data.data.role, {
        expires: 1,
      });
      Cookies.set('token', action.payload.data.data.token.IdToken, {
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
    builder.addCase(checkMail.fulfilled, (state) => {
      console.log("State ", state);
    });
  },
});
/* eslint-enable @typescript-eslint/no-explicit-any */
export default authSlice.reducer;
