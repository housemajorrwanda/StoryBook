import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken } from '@/lib/cookies';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://storybook-backend-production-574d.up.railway.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
const requestHandler = (request: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
};

// Response interceptor for error handling
const responseHandler = (response: AxiosResponse) => {
  return response;
};

const errorHandler = (error: unknown) => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status?: number } };
    if (axiosError.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(requestHandler);
axiosInstance.interceptors.response.use(responseHandler, errorHandler);

export default axiosInstance;
