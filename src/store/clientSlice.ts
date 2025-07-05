import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ipponApi from '../config/axios';
import { ClientsType } from '../types';
 
const BaseURL = import.meta.env.VITE_API_URL;


export const fetchDetailedClient = createAsyncThunk<any, any>(
  'clients/fetchDetailedClient',
  async (id,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.get(`${BaseURL}/api/v1/clients/${id}`);
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during getting detail of clients',
      );
    }
  },
);

export const updateDetailedClient = createAsyncThunk<any, any>(
  'clients/updateDetailedClient',
  async ({id,payload},{ rejectWithValue }) => {
    try {
      const result = await ipponApi.put(`${BaseURL}/api/v1/clients/${id}`,{...payload});
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during updating detail of clients',
      );
    }
  },
);

const initialState: ClientsType = {
  detailed: {
    data: {
    },
    loading: false,
    error: false,
  },
};

export const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDetailedClient.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(fetchDetailedClient.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(updateDetailedClient.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(updateDetailedClient.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(updateDetailedClient.rejected, (state) => {
      state.detailed.loading = false;
      state.detailed.error = true;
    });
  },
});
 
export default clientsSlice.reducer;
