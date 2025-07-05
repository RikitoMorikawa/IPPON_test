import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ipponApi from '../config/axios';
import { PropertiesType } from '../types';
 
const BaseURL = import.meta.env.VITE_API_URL;

export const searchPropertyInquiry = createAsyncThunk<any, any>(
  'propertiesInquiries/search',
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
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during searching for properties inquiries',
      );
    }
  },
);

export const createPropertyInquiry = createAsyncThunk<any, any>(
  'propertiesInquiries/create',
  async (payload,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.post(`${BaseURL}/api/v1/customers`,payload);
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during creating inquiry',
      );
    }
  },
);

export const fetchPropertyInquiryDetail = createAsyncThunk<any, any>(
  'propertiesInquiries/detail',
  async (id,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.get(`${BaseURL}/api/v1/inquiry?inquiryId=${id}`);
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during getting detail of properties inquiry',
      );
    }
  },
);

export const updatePropertyInquiry = createAsyncThunk<any, any>(
  'propertiesInquiries/update',
  async ({id,uploadFormData},{ rejectWithValue }) => {
    try {
      const result = await ipponApi.put(`${BaseURL}/api/v1/customers/${id}`,uploadFormData);
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during updating inquiry of property',
      );
    }
  },
);

// export const deleteProperty = createAsyncThunk<any, any>(
//   'properties/delete',
//   async (formattedDataToDelete,{ rejectWithValue }) => {
//     try {
//       const result = await ipponApi.delete(`${BaseURL}/api/v1/properties`,{data:formattedDataToDelete});
//       return result.data.data;
//     } catch (error:any) {
//       return rejectWithValue(
//         error.response?.data ||
//         'An error occurred during deleting properties',
//       );
//     }
//   },
// );
export const searchInquiryHistory = createAsyncThunk<any, any>(
  'propertiesInquiries/searchHistory',
  async (
    params,
    { rejectWithValue },
  ) => {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await ipponApi.get(
        `${BaseURL}/api/v1/inquiry-history?${queryParams.toString()}`,
      );
      return response.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during searching for properties inquiries',
      );
    }
  },
);

export const createInquiryHistory = createAsyncThunk<any, any>(
  'propertiesInquiries/createHistory',
  async (payload,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.post(`${BaseURL}/api/v1/inquiry-history`,payload);
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during creating inquiry',
      );
    }
  },
);

export const updateInquiryHistory = createAsyncThunk<any, any>(
  'propertiesInquiries/updateHistory',
  async (payload,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.put(`${BaseURL}/api/v1/inquiry-history`,payload);
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during creating inquiry',
      );
    }
  },
);
const initialState: PropertiesType = {
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
  names: {
    data: [],
    loading: false,
    error: false,
  },
  newInquiryHistory: {
    data: [],
    loading: false,
    error: false,
  },
  searchedInquiryHistory: {
    data: [],
    loading: false,
    error: false,
  },
};

export const propertiesInquiriesSlice = createSlice({
  name: 'propertiesInquiries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(searchPropertyInquiry.fulfilled, (state, action) => {
      state.searched.data = action.payload;
      state.searched.loading = false;
    });
    builder.addCase(searchPropertyInquiry.pending, (state) => {
      state.searched.loading = true;
      state.searched.error = false;
    });
    builder.addCase(searchPropertyInquiry.rejected, (state) => {
      state.searched.loading = false;
      state.searched.error = true;
    });
    builder.addCase(createPropertyInquiry.fulfilled, (state, action) => {
      state.new.data = action.payload;
      state.new.loading = false;
    });
    builder.addCase(createPropertyInquiry.pending, (state) => {
      state.new.loading = true;
      state.new.error = false;
    });
    builder.addCase(createPropertyInquiry.rejected, (state) => {
      state.new.loading = false;
      state.new.error = true;
    });
    builder.addCase(fetchPropertyInquiryDetail.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(fetchPropertyInquiryDetail.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(updatePropertyInquiry.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(updatePropertyInquiry.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(updatePropertyInquiry.rejected, (state) => {
      state.detailed.loading = false;
      state.detailed.error = true;
    });
    builder.addCase(searchInquiryHistory.fulfilled, (state:any, action) => {
      state.searchedInquiryHistory.data = action.payload;
      state.searchedInquiryHistory.loading = false;
    });
    builder.addCase(searchInquiryHistory.pending, (state:any) => {
      state.searchedInquiryHistory.loading = true;
      state.searchedInquiryHistory.error = false;
    });
    builder.addCase(createInquiryHistory.fulfilled, (state:any, action) => {
      state.newInquiryHistory.data = action.payload;
      state.newInquiryHistory.loading = false;
    });
    builder.addCase(createInquiryHistory.pending, (state:any) => {
      state.newInquiryHistory.loading = true;
      state.newInquiryHistory.error = false;
    });
    builder.addCase(createInquiryHistory.rejected, (state:any) => {
      state.newInquiryHistory.loading = false;
      state.newInquiryHistory.error = true;
    });
  },
});
 
export default propertiesInquiriesSlice.reducer;
