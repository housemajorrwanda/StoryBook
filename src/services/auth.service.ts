import axiosInstance from '@/config/axiosInstance';
import { LoginCredentials, SignupCredentials, LoginResponse, SignupResponse } from '@/types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  signup: async (credentials: SignupCredentials): Promise<SignupResponse> => {
    // Remove confirmPassword before sending to API
    const { confirmPassword: _, ...apiCredentials } = credentials;
    const response = await axiosInstance.post('/auth/register', apiCredentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  refreshToken: async (): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/refresh');
    return response.data;
  },
};
