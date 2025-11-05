import axiosInstance from "@/config/axiosInstance";
import {
  LoginCredentials,
  SignupCredentials,
  LoginResponse,
  SignupResponse,
} from "@/types/auth";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  },

  signup: async (credentials: SignupCredentials): Promise<SignupResponse> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _, ...apiCredentials } = credentials;
    const response = await axiosInstance.post("/auth/register", apiCredentials);
    return response.data;
  },

  refreshToken: async (): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/auth/refresh");
    return response.data;
  },
};
