import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ipponApi from '../config/axios';
import { MembersType } from '../types';
 
const BaseURL = import.meta.env.VITE_API_URL;

export const searchMembers = createAsyncThunk<any, any>(
  'members/search',
  async (
    {
      name,
    },
    { rejectWithValue },
  ) => {
    try {
      const queryParams = new URLSearchParams({
        name,
      });
      const response = await ipponApi.get(
        `${BaseURL}/api/members?${queryParams.toString()}`,
      );
      return response.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during searching for members',
      );
    }
  },
);

export const createMember = createAsyncThunk<any, any>(
  'members/createMember',
  async (payload,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.post(`${BaseURL}/api/members`,payload);
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during updating detail of members',
      );
    }
  },
);

export const fetchDetailedMember = createAsyncThunk<any, any>(
  'members/fetchDetailedMember',
  async (id,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.get(`${BaseURL}/api/members/${id}`);
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during getting detail of members',
      );
    }
  },
);

export const updateDetailedMember = createAsyncThunk<any, any>(
  'members/updateDetailedMember',
  async ({id,payload},{ rejectWithValue }) => {
    try {
      const result = await ipponApi.put(`${BaseURL}/api/members/${id}`,{...payload});
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during updating detail of members',
      );
    }
  },
);

export const deleteMember = createAsyncThunk<any, any>(
  'members/deleteMember',
  async (formattedDataToDelete,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.delete(`${BaseURL}/api/multiple-members`,{data:formattedDataToDelete});
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during deleting member',
      );
    }
  },
);

export const createMemberProfile = createAsyncThunk<any, any>(
  'members/createMemberProfile',
  async (formData,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.post(`${BaseURL}/api/member-image`,formData);
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during updating detail of members',
      );
    }
  },
);

export const deleteMemberProfileImage = createAsyncThunk<any, any>(
  'members/deleteMemberProfileImage',
  async ({params},{ rejectWithValue }) => {
    try {
      const result = await ipponApi.delete(`${BaseURL}/api/member-image?client_id=${params.client_id}&member_id=${params.member_id}&register_timestamp=${params.register_timestamp}`);
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during updating detail of members',
      );
    }
  },
);

export const sendEmail = createAsyncThunk<any, any>(
  'members/sendMail',
  async (payload,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.post(`${BaseURL}/api/v1/auth/sent-email`,
        {email:payload});
      return result.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during sending email.',
      );
    }
  },
);

const initialState: MembersType = {
  new: {
    data: [],
    loading: false,
    error: false,
  },
  searched: {
    data: [],
    loading: false,
    error: false,
  },
  detailed: {
    data: {
    },
    loading: false,
    error: false,
  },
};

export const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(searchMembers.fulfilled, (state, action) => {
      state.searched.data = action.payload;
      state.searched.loading = false;
    });
    builder.addCase(searchMembers.pending, (state) => {
      state.searched.loading = true;
      state.searched.error = false;
    });
    builder.addCase(searchMembers.rejected, (state) => {
      state.searched.loading = false;
      state.searched.error = true;
    });
    builder.addCase(createMember.fulfilled, (state, action) => {
      state.new.data = action.payload;
      state.new.loading = false;
    });
    builder.addCase(createMember.pending, (state) => {
      state.new.loading = true;
      state.new.error = false;
    });
    builder.addCase(createMember.rejected, (state) => {
      state.new.loading = false;
      state.new.error = true;
    });
    builder.addCase(fetchDetailedMember.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(fetchDetailedMember.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(updateDetailedMember.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(updateDetailedMember.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(updateDetailedMember.rejected, (state) => {
      state.detailed.loading = false;
      state.detailed.error = true;
    });
    builder.addCase(deleteMember.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(deleteMember.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(deleteMember.rejected, (state) => {
      state.detailed.loading = false;
      state.detailed.error = true;
    });
  },
});
 
export default membersSlice.reducer;
