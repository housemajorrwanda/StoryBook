import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthToken } from "@/lib/cookies";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://storybook-backend-production-574d.up.railway.app";

// Public API - for unauthenticated requests
export const publicApi = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Upload API - for file uploads (images, audio, video)
export const uploadApi = axios.create({
  baseURL,
  timeout: 120000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Authenticated API - for authenticated requests (includes auth token)
export const authenticatedApi = axios.create({
  baseURL,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token interceptor to authenticated API
authenticatedApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Remove Content-Type header if FormData is being sent - let axios set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add error handler for authenticated API (401 redirect)
authenticatedApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        // Token expired or invalid
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          document.cookie =
            "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// Public API error handler
publicApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => Promise.reject(error)
);

// Upload API error handler
uploadApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => Promise.reject(error)
);
