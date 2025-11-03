"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";
import { LoginCredentials, SignupCredentials } from "@/types/auth";
import { setAuthToken, clearAuthToken } from "@/lib/cookies";
import { decodeAuthToken } from "@/lib/decodeToken";

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

        // Redirect based on user role
        const userRole = data.user.role || decodeAuthToken()?.role;
        if (userRole === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      } else {
        toast.error("Login failed");
      }
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Login failed. Please try again.";
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

        // Redirect based on user role
        const userRole = data.user.role || decodeAuthToken()?.role;
        if (userRole === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/"); // Landing page for regular users
        }
      } else {
        toast.error("Signup failed");
      }
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Signup failed. Please try again.";
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
