/**
 * Axios API client configuration with request/response interceptors.
 * Handles JWT token injection and automatic token refresh.
 */

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// API base URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_V1 = "/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}${API_V1}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Add JWT token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle token refresh on 401
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Refresh the access token
        const response = await axios.post(`${API_BASE_URL}${API_V1}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data;

        // Store new access token
        localStorage.setItem("access_token", access_token);

        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
