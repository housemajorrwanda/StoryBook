import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getAuthToken, isTokenExpired } from "@/lib/cookies";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://storybook-backend-production-574d.up.railway.app",
  timeout: 1200000, 
  headers: {
    "Content-Type": "application/json",
  },
});

const clearAuthAndRedirect = (message?: string) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("authToken");
  document.cookie =
    "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  if (message) {
    sessionStorage.setItem("authError", message);
  } else {
    sessionStorage.removeItem("authError");
  }

  window.location.href = "/login";
};

// Request interceptor to add auth token
const requestHandler = (request: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  
  if (token) {
    // Check if token is expired
    if (isTokenExpired(token)) {
      console.error("TOKEN IS EXPIRED!");
      localStorage.removeItem("authToken");
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Token expired");
    }
    
    
    request.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("NO TOKEN FOUND IN REQUEST INTERCEPTOR");
  }
  
  // Handle FormData - delete Content-Type to let browser set boundary
  if (request.data instanceof FormData) {
    
    // Delete Content-Type so browser can set it with proper boundary
    delete request.headers["Content-Type"];
    
    // CRITICAL: Verify Authorization header is STILL there after deleting Content-Type
    const authStillPresent = !!request.headers.Authorization;
    
    if (!authStillPresent && token) {
      console.error("AUTHORIZATION WAS REMOVED! RE-ADDING...");
      request.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return request;
};

// Response interceptor for error handling
const responseHandler = (response: AxiosResponse) => {
  return response;
};

const errorHandler = (error: unknown) => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        status?: number;
        data?: { message?: string; error?: string };
      };
      config?: {
        url?: string;
        method?: string;
        headers?: Record<string, string>;
        data?: unknown;
      };
    };

    // Handle 401 Unauthorized
    if (axiosError.response?.status === 401) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        
        if (currentPath === "/login" || currentPath === "/signup") {
          return Promise.reject(error);
        }

        const token = getAuthToken();
        if (token) {
          const lastLoginTime = sessionStorage.getItem("lastLoginTime");
          const lastSubmissionTime = sessionStorage.getItem("lastSubmissionTime");
          const now = Date.now();

          const loginTime = lastLoginTime ? parseInt(lastLoginTime, 10) : 0;
          const submissionTime = lastSubmissionTime ? parseInt(lastSubmissionTime, 10) : 0;
          const timeSinceLogin = now - loginTime;
          const timeSinceSubmission = now - submissionTime;

          if (
            (loginTime && timeSinceLogin < 5000) ||
            (submissionTime && timeSinceSubmission < 5000)
          ) {
            return Promise.reject(error);
          }

          clearAuthAndRedirect("Your session has expired. Please log in again.");
        }
      }
    }

    if (axiosError.response?.status === 403) {
      console.warn("403 FORBIDDEN - CLEARING AUTH TOKEN");
      clearAuthAndRedirect(
        "You do not have permission to perform that action. Please log in again."
      );
    }

    // Handle 400 Bad Request - Invalid User ID
    if (axiosError.response?.status === 400) {
      const errorMessage =
        axiosError.response.data?.message || axiosError.response.data?.error;
      const errorString = errorMessage ? String(errorMessage).toLowerCase() : "";

      if (
        errorString.includes("invalid user id") ||
        errorString.includes("user does not exist")
      ) {
        console.error("INVALID USER ID ERROR - NOT REDIRECTING AUTOMATICALLY.");  
        return Promise.reject(error);
      }
    }
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(requestHandler);
axiosInstance.interceptors.response.use(responseHandler, errorHandler);

export default axiosInstance;