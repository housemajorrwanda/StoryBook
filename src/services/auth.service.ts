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
    const requestBody = {
      email: apiCredentials.email,
      password: apiCredentials.password,
      fullName: apiCredentials.fullName,
      ...(apiCredentials.residentPlace && {
        residentPlace: apiCredentials.residentPlace,
      }),
    };
    const response = await axiosInstance.post("/auth/register", requestBody);
    return response.data;
  },

  refreshToken: async (): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/auth/refresh");
    return response.data;
  },

  initiateGoogleAuth: (): void => {
    const baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://storybook.andasy.dev";
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${baseURL}/auth/google`;
  },

  handleGoogleCallback: async (): Promise<LoginResponse> => {
    const response = await axiosInstance.get("/auth/google/success");
    return response.data;
  },

  forgotPassword: async (
    email: string
  ): Promise<{ message: string }> => {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await axiosInstance.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },
};
