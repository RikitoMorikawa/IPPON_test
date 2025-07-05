import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ipponApi from '../config/axios';
import { EmployeesType } from '../types';
 
const BaseURL = import.meta.env.VITE_API_URL;

export const searchEmployees = createAsyncThunk<any, any>(
  'employees/search',
  async (
    searchPayload, // Receive the payload directly (no destructuring)
    { rejectWithValue },
  ) => {
    try {
      const queryParams = new URLSearchParams(searchPayload);
      const response = await ipponApi.get(
        `${BaseURL}/api/v1/employees?${queryParams.toString()}`,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during searching for employees',
      );
    }
  },
);

export const getEmployeeNames = createAsyncThunk<any, any>(
  'employees/names',
  async (
    { rejectWithValue },
  ) => {
    try {
      const response = await ipponApi.get(
        `${BaseURL}/api/v1/employees/names-list`,
      );
      return response.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during getting names for employees',
      );
    }
  },
);

export const createEmployee = createAsyncThunk<any, any>(
  'employees/createEmployee',
  async (payload,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.post(`${BaseURL}/api/v1/employees`,payload);
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during updating detail of employees',
      );
    }
  },
);

export const fetchDetailedEmployee = createAsyncThunk<any, any>(
  'employees/fetchDetailedEmployee',
  async (id,{ rejectWithValue }) => {
    try {
      const result = await ipponApi.get(`${BaseURL}/api/v1/employees/${id}`);
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during getting detail of employees',
      );
    }
  },
);

export const updateDetailedEmployee = createAsyncThunk<any, any>(
  'employees/updateDetailedEmoployee',
  async ({id,payload},{ rejectWithValue }) => {
    try {
      const result = await ipponApi.put(`${BaseURL}/api/v1/employees/${id}`,{...payload});
      return result.data.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during updating detail of employees',
      );
    }
  },
);

export const deleteEmployee = createAsyncThunk<any, any>(
  'employees/deleteEmployee',
  async (formattedDataToDelete, { rejectWithValue }) => {
    try {
      const payload = {
        employees: formattedDataToDelete
      };
      
      const result = await ipponApi.delete(`${BaseURL}/api/v1/employees/multiple-delete`, {
        data: payload
      });
      return result.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
        'An error occurred during deleting employee',
      );
    }
  },
);

const initialState: EmployeesType = {
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

export const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(searchEmployees.fulfilled, (state, action) => {
      state.searched.data = action.payload;
      state.searched.loading = false;
    });
    builder.addCase(searchEmployees.pending, (state) => {
      state.searched.loading = true;
      state.searched.error = false;
    });
    builder.addCase(searchEmployees.rejected, (state) => {
      state.searched.loading = false;
      state.searched.error = true;
    });
    builder.addCase(getEmployeeNames.fulfilled, (state, action) => {
      state.names.data = action.payload;
      state.names.loading = false;
    });
    builder.addCase(getEmployeeNames.pending, (state) => {
      state.names.loading = true;
      state.names.error = false;
    });
    builder.addCase(getEmployeeNames.rejected, (state) => {
      state.names.loading = false;
      state.names.error = true;
    });
    builder.addCase(createEmployee.fulfilled, (state, action) => {
      state.new.data = action.payload;
      state.new.loading = false;
    });
    builder.addCase(createEmployee.pending, (state) => {
      state.new.loading = true;
      state.new.error = false;
    });
    builder.addCase(createEmployee.rejected, (state) => {
      state.new.loading = false;
      state.new.error = true;
    });
    builder.addCase(fetchDetailedEmployee.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(fetchDetailedEmployee.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(updateDetailedEmployee.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(updateDetailedEmployee.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(updateDetailedEmployee.rejected, (state) => {
      state.detailed.loading = false;
      state.detailed.error = true;
    });
    builder.addCase(deleteEmployee.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(deleteEmployee.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(deleteEmployee.rejected, (state) => {
      state.detailed.loading = false;
      state.detailed.error = true;
    });
  },
});
 
export default employeesSlice.reducer;
