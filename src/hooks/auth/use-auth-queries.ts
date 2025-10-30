"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";
import { LoginCredentials, SignupCredentials } from "@/types/auth";
import { setAuthToken, clearAuthToken } from "@/lib/cookies";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      if (data.access_token && data.user) {
        setAuthToken(data.access_token);
        queryClient.setQueryData(["user"], data.user);
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error("Login failed");
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    },
  });
};

export const useSignup = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: SignupCredentials) =>
      authService.signup(credentials),
    onSuccess: (data) => {
      if (data.access_token && data.user) {
        setAuthToken(data.access_token);
        queryClient.setQueryData(["user"], data.user);
        toast.success("Account created successfully!");
        router.push("/dashboard");
      } else {
        toast.error("Signup failed");
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuthToken();
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/");
    },
    onError: () => {
      // Even if logout fails on server, clear local data
      clearAuthToken();
      queryClient.clear();
      router.push("/");
    },
  });
};
