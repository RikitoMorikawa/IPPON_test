import axios from "axios";
import Cookies from "js-cookie";
/* eslint-disable @typescript-eslint/no-explicit-any */
const ipponApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function isOngoingMaintenance(status: any) {
  if (status === 401) {
    window.location.href = "/login";
  }
}

ipponApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    isOngoingMaintenance(error.response?.status);

    return Promise.reject(error);
  }
);

ipponApi.interceptors.response.use(
  (response) => {
    isOngoingMaintenance(response.data);

    return response;
  },
  (error) => {
    isOngoingMaintenance(error.response?.status);

    return Promise.reject(error);
  }
);
/* eslint-enable @typescript-eslint/no-explicit-any */
export default ipponApi;
