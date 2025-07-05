import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ipponApi from '../config/axios';
import { PropertiesType } from '../types';
 
const BaseURL = import.meta.env.VITE_API_URL;

export const searchProperties = createAsyncThunk<any, any>(
  'properties/search',
  async (
    params,
    { rejectWithValue },
  ) => {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await ipponApi.get(
        `${BaseURL}/api/v1/properties?${queryParams.toString()}`,
      );

      return response.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during searching for properties',
      );
    }
  },
);

export const getPropertyNames = createAsyncThunk<any, any>(
  'properties/getName',
  async () => {
    try {
      const result = await ipponApi.get(`${BaseURL}/api/v1/property-names`);
      return result.data.data;
    } catch (error:any) {
      return error;
    }
  },
);

export const createProperty = createAsyncThunk<any, any>(
  'properties/create',
  async (payload,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.post(`${BaseURL}/api/v1/properties`,payload);
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during creating property',
      );
    }
  },
);

export const fetchPropertyDetail = createAsyncThunk<any, any>(
  'properties/detail',
  async (id,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.get(`${BaseURL}/api/v1/properties/${id}`);
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during getting detail of properties',
      );
    }
  },
);

export const updateProperty = createAsyncThunk<any, any>(
  'properties/update',
  async ({id,uploadFormData},{ rejectWithValue }) => {
    try {
      const result = await ipponApi.put(`${BaseURL}/api/v1/properties/${id}`,uploadFormData);
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during updating detail of property',
      );
    }
  },
);

export const deleteProperty = createAsyncThunk<any, any>(
  'properties/delete',
  async (formattedDataToDelete,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.delete(`${BaseURL}/api/v1/properties`,{data:formattedDataToDelete});
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during deleting properties',
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
  names: {
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

export const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(searchProperties.fulfilled, (state, action) => {
      state.searched.data = action.payload;
      state.searched.loading = false;
    });
    builder.addCase(searchProperties.pending, (state) => {
      state.searched.loading = true;
      state.searched.error = false;
    });
    builder.addCase(searchProperties.rejected, (state) => {
      state.searched.loading = false;
      state.searched.error = true;
    });
    builder.addCase(getPropertyNames.fulfilled, (state, action) => {
      state.names.data = action.payload;
      state.names.loading = false;
    });
    builder.addCase(getPropertyNames.pending, (state) => {
      state.names.loading = true;
      state.names.error = false;
    });
    builder.addCase(getPropertyNames.rejected, (state) => {
      state.names.loading = false;
      state.names.error = true;
    });
    builder.addCase(createProperty.fulfilled, (state, action) => {
      state.new.data = action.payload;
      state.new.loading = false;
    });
    builder.addCase(createProperty.pending, (state) => {
      state.new.loading = true;
      state.new.error = false;
    });
    builder.addCase(createProperty.rejected, (state) => {
      state.new.loading = false;
      state.new.error = true;
    });
    builder.addCase(fetchPropertyDetail.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(fetchPropertyDetail.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(updateProperty.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(updateProperty.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(updateProperty.rejected, (state) => {
      state.detailed.loading = false;
      state.detailed.error = true;
    });
    builder.addCase(deleteProperty.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(deleteProperty.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(deleteProperty.rejected, (state) => {
      state.detailed.loading = false;
      state.detailed.error = true;
    });
  },
});
 
export default propertiesSlice.reducer;
