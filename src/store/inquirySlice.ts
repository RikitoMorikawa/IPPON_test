import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ipponApi from '../config/axios';
import { InquiryType } from '../types';
 
const BaseURL = import.meta.env.VITE_API_URL;

export const searchInquiry = createAsyncThunk<any, any>(
  'inquiry/search',
  async (
    params,
    { rejectWithValue },
  ) => {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await ipponApi.get(
        `${BaseURL}/api/v1/dashboard?${queryParams.toString()}`,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during searching for inquiry',
      );
    }
  },
);

export const searchInquiryListPage = createAsyncThunk<any, any>(
  'inquiry/listSearch',
  async (
    params,
    { rejectWithValue },
  ) => {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await ipponApi.get(
        `${BaseURL}/api/v1/inquiry?${queryParams.toString()}`,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during searching for inquiry',
      );
    }
  },
);

export const createInquiry = createAsyncThunk<any, any>(
  'inquiry/createInquiry',
  async (payload, { rejectWithValue }) => {
    try {
      // Check if payload is FormData
      const isFormData = payload instanceof FormData;      
      let config = {};
      
      // If it's FormData, set proper headers
      if (isFormData) {
        config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      } else {
        config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
      }

      const result = await ipponApi.post(
        `${BaseURL}/api/v1/customers`,
        payload,
        config
      );
      
      return result.data.data;
    } catch (error: any) {
      console.error("createInquiry error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during creating customer inquiry',
      );
    }
  },
);

export const fetchDetailInquiry = createAsyncThunk<any, any>(
  'inquiry/fetchDetailedInquiry',
  async (id,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.get(`${BaseURL}/api/v1/dashboard?inquiryId=${id}`);
      return result.data.data.items.length > 0 ? result.data.data.items[0] : [];
    } catch (error:any) {
    return rejectWithValue(
        error.response?.data ||
        'An error occurred during getting detail of inquiry',
      );
    }
  },
);

export const updateDetailedInquiry = createAsyncThunk<any, any>(
  'inquiry/updateDetailedInquiry',
  async ({id, payload}, { rejectWithValue }) => {
    try {
      // Check if payload is FormData
      const isFormData = payload instanceof FormData;      
      let config = {};
      
      // If it's FormData, set proper headers
      if (isFormData) {
        config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      } else {
        config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
      }

      // Send payload directly if FormData, otherwise spread it
      const requestPayload = isFormData ? payload : { ...payload };

      const result = await ipponApi.put(
        `${BaseURL}/api/v1/customers/${id}`,
        requestPayload,
        config
      );
      
      return result.data.data;
    } catch (error: any) {
      console.error("updateDetailedInquiry error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during updating customer inquiry',
      );
    }
  },
);

export const deleteInquiry = createAsyncThunk<any, any>(
  'inquiry/deleteInquiry',
  async (formattedDataToDelete,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.delete(`${BaseURL}/api/multiple-inquiry`,{data:formattedDataToDelete});
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during deleting inquiry',
      );
    }
  },
);
const initialState: InquiryType = {
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

export const inquirySlice = createSlice({
  name: 'inquiry',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(searchInquiry.fulfilled, (state, action) => {
      state.searched.data = action.payload;
      state.searched.loading = false;
    });
    builder.addCase(searchInquiry.pending, (state) => {
      state.searched.loading = true;
      state.searched.error = false;
    });
    builder.addCase(searchInquiry.rejected, (state) => {
      state.searched.loading = false;
      state.searched.error = true;
    });
     builder.addCase(searchInquiryListPage.fulfilled, (state, action) => {
      state.searched.data = action.payload;
      state.searched.loading = false;
    });
    builder.addCase(searchInquiryListPage.pending, (state) => {
      state.searched.loading = true;
      state.searched.error = false;
    });
    builder.addCase(searchInquiryListPage.rejected, (state) => {
      state.searched.loading = false;
      state.searched.error = true;
    });
    builder.addCase(createInquiry.fulfilled, (state, action) => {
      state.new.data = action.payload;
      state.new.loading = false;
    });
    builder.addCase(createInquiry.pending, (state) => {
      state.new.loading = true;
      state.new.error = false;
    });
    builder.addCase(createInquiry.rejected, (state) => {
      state.new.loading = false;
      state.new.error = true;
    });
    builder.addCase(fetchDetailInquiry.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(fetchDetailInquiry.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(updateDetailedInquiry.fulfilled, (state) => {
      // state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(updateDetailedInquiry.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(updateDetailedInquiry.rejected, (state) => {
      state.detailed.loading = false;
      state.detailed.error = true;
    });
    builder.addCase(deleteInquiry.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(deleteInquiry.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(deleteInquiry.rejected, (state) => {
      state.detailed.loading = false;
      state.detailed.error = true;
    });
  },
});
 
export default inquirySlice.reducer;
