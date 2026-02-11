"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";
import { LoginCredentials, SignupCredentials } from "@/types/auth";
import { User } from "@/types/common";
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

        if (typeof window !== "undefined") {
          sessionStorage.setItem("lastLoginTime", Date.now().toString());
        }

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

        // Store login time to prevent race condition in API interceptor
        if (typeof window !== "undefined") {
          sessionStorage.setItem("lastLoginTime", Date.now().toString());
        }

        toast.success("Account created successfully!");

        // Redirect based on user role
        const userRole = data.user.role || decodeAuthToken()?.role;
        if (userRole === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/");
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
    mutationFn: async () => {
      return Promise.resolve();
    },
    onSuccess: () => {
      clearAuthToken();
      queryClient.clear();
      queryClient.removeQueries();
      toast.success("Logged out successfully!");
      router.push("/");
    },
    onError: () => {
      clearAuthToken();
      queryClient.clear();
      queryClient.removeQueries();
      router.push("/");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      toast.success("If the email exists, a password reset link has been sent.");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong. Please try again.";
      toast.error(message);
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authService.resetPassword(token, newPassword),
    onSuccess: () => {
      toast.success("Password reset successfully! Please sign in.");
      router.push("/login");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Invalid or expired reset token. Please try again.";
      toast.error(message);
    },
  });
};

export const useGoogleAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return {
    initiate: () => {
      authService.initiateGoogleAuth();
    },
    handleCallback: async (): Promise<void> => {
      try {
        const data = await authService.handleGoogleCallback();
        
        // Check if response has access_token (might be in data or nested)
        interface GoogleAuthResponse {
          access_token?: string;
          user?: User;
          data?: {
            access_token?: string;
            user?: User;
          };
          token?: string;
        }
        
        const response = data as unknown as GoogleAuthResponse;
        const accessToken = 
          response?.access_token || 
          response?.data?.access_token ||
          response?.token;
        
        const user = 
          response?.user || 
          response?.data?.user;

        if (accessToken && user) {
          setAuthToken(accessToken);
          queryClient.setQueryData(["user"], user);

          if (typeof window !== "undefined") {
            sessionStorage.setItem("lastLoginTime", Date.now().toString());
          }

          toast.success("Google authentication successful!");

          // Redirect based on user role
          const userRole = user.role || decodeAuthToken()?.role;
          if (userRole === "admin") {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        } else {
          // Check URL params for token (in case backend redirects with token in URL)
          const urlParams = new URLSearchParams(window.location.search);
          const tokenFromUrl = urlParams.get("token");
          const userFromUrl = urlParams.get("user");

          if (tokenFromUrl) {
            setAuthToken(tokenFromUrl);
            if (userFromUrl) {
              try {
                const userData = JSON.parse(decodeURIComponent(userFromUrl));
                queryClient.setQueryData(["user"], userData);
              } catch {
                // Ignore parse error
              }
            }

            if (typeof window !== "undefined") {
              sessionStorage.setItem("lastLoginTime", Date.now().toString());
            }

            toast.success("Google authentication successful!");
            router.push("/");
          } else {
            toast.error("Authentication failed. Please try again.");
            router.push("/login");
          }
        }
      } catch (error: unknown) {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Google authentication failed. Please try again.";
        toast.error(message);
        router.push("/login");
      }
    },
  };
};
