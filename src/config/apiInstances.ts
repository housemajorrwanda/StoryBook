import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthToken } from "@/lib/cookies";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://storybook-backend-production-574d.up.railway.app";

export const publicApi = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const uploadApi = axios.create({
  baseURL,
  timeout: 120000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

uploadApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authenticatedApi = axios.create({
  baseURL,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

authenticatedApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // Debug: Log token info in development
      if (process.env.NODE_ENV === "development") {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log("JWT Payload:", payload);
        } catch (e) {
          console.error("Failed to decode token:", e);
        }
      }
    } else {
      console.warn("No auth token found for authenticated request");
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authenticatedApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: string; error?: string };
        };
      };

      if (axiosError.response?.status === 401) {
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (currentPath === "/login" || currentPath === "/signup") {
            return Promise.reject(error);
          }

          const token = getAuthToken();
          if (token) {
            const lastLoginTime = sessionStorage.getItem("lastLoginTime");
            const lastSubmissionTime =
              sessionStorage.getItem("lastSubmissionTime");
            const now = Date.now();

            // Don't clear token if:
            // 1. Login happened less than 5 seconds ago (race condition)
            // 2. Submission happened less than 5 seconds ago (prevent logout after successful submit)
            const loginTime = lastLoginTime ? parseInt(lastLoginTime, 10) : 0;
            const submissionTime = lastSubmissionTime
              ? parseInt(lastSubmissionTime, 10)
              : 0;
            const timeSinceLogin = now - loginTime;
            const timeSinceSubmission = now - submissionTime;

            if (
              (loginTime && timeSinceLogin < 5000) ||
              (submissionTime && timeSinceSubmission < 5000)
            ) {
              console.log(
                "Ignoring 401 error - recent login or submission detected",
                {
                  timeSinceLogin,
                  timeSinceSubmission,
                }
              );
              return Promise.reject(error);
            }

            // Token is likely expired or invalid
            localStorage.removeItem("authToken");
            document.cookie =
              "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/login";
          }
        }
      }

      if (axiosError.response?.status === 400) {
        const errorMessage =
          axiosError.response.data?.message || axiosError.response.data?.error;
        const errorString = errorMessage
          ? String(errorMessage).toLowerCase()
          : "";

        if (
          errorString.includes("invalid user id") &&
          errorString.includes("user does not exist")
        ) {
          console.error(
            "User ID from token does not exist in database. Token is invalid. Redirecting to login..."
          );
          if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
            document.cookie =
              "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            sessionStorage.setItem(
              "authError",
              "Your session is invalid. The user account may have been deleted or the token is from a different environment. Please log in again."
            );
            window.location.href = "/login";
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

publicApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => Promise.reject(error)
);

uploadApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => Promise.reject(error)
);
