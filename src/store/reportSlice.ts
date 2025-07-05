import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ipponApi from "../config/axios";
import { ReportsType } from "../types";

const BaseURL = import.meta.env.VITE_API_URL;

export const searchReports = createAsyncThunk<any, any>(
  "reports/search",
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params);

      const response = await ipponApi.get(
        `${BaseURL}/api/v1/reports?${queryParams.toString()}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "An error occurred during searching for reports"
      );
    }
  }
);

export const fetchPropertyReports = createAsyncThunk<any, any>(
  "reports/fetchPropertyReports",
  async ({ property_id, ...params }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params);
      const queryString = queryParams.toString();
      const url = queryString 
        ? `${BaseURL}/api/v1/properties/${property_id}/reports?${queryString}`
        : `${BaseURL}/api/v1/properties/${property_id}/reports`;

      const response = await ipponApi.get(url);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "An error occurred during fetching property reports"
      );
    }
  }
);

export const createReport = createAsyncThunk<any, any>(
  "reports/createReport",
  async (payload, { rejectWithValue }) => {
    try {
      // Extract property_id from payload
      const { property_id, report_route_name, save_type } = payload;

      // Use property_id in the URL
      const result = await ipponApi.post(
        `${BaseURL}/api/v1/properties/${property_id}/reports/${report_route_name}/save`,
        payload,
        // Configure request based on save_type
        save_type === "completed" ? { responseType: "blob" as const } : {}
      );

      // If save_type is completed, handle file download immediately
      if (save_type === "completed") {
        // Helper function to extract filename from Content-Disposition header
        const getFilenameFromHeaders = (headers: any): string => {
          const contentDisposition =
            headers["content-disposition"] || headers["Content-Disposition"];
          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(
              /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
            );
            if (filenameMatch && filenameMatch[1]) {
              return filenameMatch[1].replace(/['"]/g, "");
            }
          }
          return `報告書_${new Date().toISOString().split("T")[0]}.xlsx`;
        };

        // Helper function to download file
        const downloadFile = (blob: Blob, filename: string) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        };

        // Download the file immediately
        const filename = getFilenameFromHeaders(result.headers);
        downloadFile(result.data, filename);

        // Return only serializable metadata
        return {
          success: true,
          save_type: "completed",
          filename: filename,
          message: "Report created and downloaded successfully",
        };
      }

      // For draft saves, return normal JSON response
      return {
        success: true,
        save_type: "draft",
        data: result.data,
        message: "Draft saved successfully",
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "An error occurred during creating report"
      );
    }
  }
);

export const fetchDetailedReport = createAsyncThunk<any, any>(
  "reports/fetchDetailedReport",
  async (id, { rejectWithValue }) => {
    try {
      const result = await ipponApi.get(`${BaseURL}/api/v1/reports/${id}`);
      return result.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred during getting detail of reports"
      );
    }
  }
);

export const updateDetailedReport = createAsyncThunk<any, any>(
  "reports/updateDetailedReport",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const result = await ipponApi.put(`${BaseURL}/api/v1/properties/${id}`, {
        ...payload,
      });
      return result.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred during updating detail of reports"
      );
    }
  }
);

export const deleteReport = createAsyncThunk<any, any>(
  "members/deleteReport",
  async (formattedDataToDelete, { rejectWithValue }) => {
    try {
      const result = await ipponApi.delete(`${BaseURL}/api/multiple-reports`, {
        data: formattedDataToDelete,
      });
      return result.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "An error occurred during deleting member"
      );
    }
  }
);

export const generateReportWithAI = createAsyncThunk<any, any>(
  "reports/generateWithAI",
  async (
    payload: {
      property_id: string;
      client_id: string;
      property_name: string;
      report_start_date: string;
      report_end_date: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await ipponApi.post(
        `${BaseURL}/api/v1/properties/${payload.property_id}/reports`,
        {
          client_id: payload.client_id,
          property_id: payload.property_id,
          property_name: payload.property_name,
          report_start_date: payload.report_start_date,
          report_end_date: payload.report_end_date,
          customer_interactions: [
            {
              customer_id: "TEST_CUSTOMER_001",
              customer_name: "テスト顧客 太郎",
              inquired_at: "2024-01-15 14:30:00",
              category: "内見",
              type: "物件見学",
              summary:
                "物件の内見希望。設備や周辺環境について質問がありました。",
            },
            {
              customer_id: "TEST_CUSTOMER_002",
              customer_name: "テスト顧客 花子",
              inquired_at: "2024-01-16 10:00:00",
              category: "電話",
              type: "資料請求",
              summary:
                "物件の詳細資料を希望。価格や契約条件について確認したい。",
            },
          ],
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred during generating report with AI"
      );
    }
  }
);

const initialState: ReportsType = {
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
    data: {},
    loading: false,
    error: false,
  },
};

export const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(searchReports.fulfilled, (state, action) => {
      state.searched.data = action.payload;
      state.searched.loading = false;
    });
    builder.addCase(searchReports.pending, (state) => {
      state.searched.loading = true;
      state.searched.error = false;
    });
    builder.addCase(searchReports.rejected, (state) => {
      state.searched.loading = false;
      state.searched.error = true;
    });
    builder.addCase(createReport.fulfilled, (state, action) => {
      // For completed reports (file downloads), we don't need to store data
      // Just update the loading state
      if (action.payload.save_type === "completed") {
        // Don't store file-related data, just mark as completed
        state.new.loading = false;
      } else {
        // For draft saves, store the actual report data
        state.new.data = action.payload.data;
        state.new.loading = false;
      }
    });
    builder.addCase(createReport.pending, (state) => {
      state.new.loading = true;
      state.new.error = false;
    });
    builder.addCase(createReport.rejected, (state) => {
      state.new.loading = false;
      state.new.error = true;
    });
    builder.addCase(fetchDetailedReport.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(fetchDetailedReport.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(updateDetailedReport.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(updateDetailedReport.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(updateDetailedReport.rejected, (state) => {
      state.detailed.loading = false;
      state.detailed.error = true;
    });
    builder.addCase(deleteReport.fulfilled, (state, action) => {
      state.detailed.data = action.payload;
      state.detailed.loading = false;
    });
    builder.addCase(deleteReport.pending, (state) => {
      state.detailed.loading = true;
      state.detailed.error = false;
    });
    builder.addCase(deleteReport.rejected, (state) => {
      state.detailed.loading = false;
      state.detailed.error = true;
    });
    // fetchPropertyReports handlers
    builder.addCase(fetchPropertyReports.fulfilled, (state, action) => {
      state.searched.data = action.payload;
      state.searched.loading = false;
    });
    builder.addCase(fetchPropertyReports.pending, (state) => {
      state.searched.loading = true;
      state.searched.error = false;
    });
    builder.addCase(fetchPropertyReports.rejected, (state) => {
      state.searched.loading = false;
      state.searched.error = true;
    });
  },
});

export default reportsSlice.reducer;
