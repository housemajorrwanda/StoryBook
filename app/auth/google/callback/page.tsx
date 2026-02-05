"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { setAuthToken } from "@/lib/cookies";
import { decodeAuthToken } from "@/lib/decodeToken";
import axiosInstance from "@/config/axiosInstance";
import toast from "react-hot-toast";
import { LuLoader } from "react-icons/lu";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Get the authorization code from URL
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
          console.error("[GoogleCallback] OAuth error:", error);
          toast.error("Google authentication was cancelled or failed.");
          router.push("/login?error=oauth_cancelled");
          return;
        }

        if (!code) {
          console.error("[GoogleCallback] No authorization code found");
          toast.error("No authorization code received from Google.");
          router.push("/login?error=no_code");
          return;
        }

        // Send the code to backend to exchange for access token
        console.log("[GoogleCallback] Exchanging code for token...");
        const response = await axiosInstance.post("/auth/google/callback", {
          code,
        });

        const { access_token, user } = response.data;

        if (!access_token) {
          throw new Error("No access token received from backend");
        }

        // Store the token
        setAuthToken(access_token);

        // Fetch and set user data
        if (user) {
          queryClient.setQueryData(["user"], user);
        } else {
          // Fallback: try to fetch user data or decode from token
          try {
            const userResponse = await axiosInstance.get("/auth/me");
            queryClient.setQueryData(["user"], userResponse.data);
          } catch {
            const decoded = decodeAuthToken();
            if (decoded) {
              queryClient.setQueryData(["user"], {
                id: decoded.sub,
                email: decoded.email,
                fullName: decoded.fullName,
                role: decoded.role,
              });
            }
          }
        }

        // Store login time
        if (typeof window !== "undefined") {
          sessionStorage.setItem("lastLoginTime", Date.now().toString());
        }

        toast.success("Google authentication successful!");

        // Redirect based on user role
        const decoded = decodeAuthToken();
        const userRole = user?.role || decoded?.role;

        if (userRole === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("[GoogleCallback] Error:", error);
        toast.error("Authentication failed. Please try again.");
        router.push("/login?error=auth_failed");
      }
    };

    handleGoogleCallback();
  }, [searchParams, router, queryClient]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <LuLoader className="w-8 h-8 text-gray-600 animate-spin" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authenticating with Google
          </h1>
          <p className="text-gray-600">
            Please wait while we complete your Google sign-in...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-white flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="text-center">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-gray-600 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Loading...
              </h1>
            </div>
          </div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
