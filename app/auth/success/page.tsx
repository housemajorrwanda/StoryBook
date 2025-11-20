"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useGoogleAuth } from "@/hooks/auth/use-auth-queries";
import { setAuthToken } from "@/lib/cookies";
import { decodeAuthToken } from "@/lib/decodeToken";
import axiosInstance from "@/config/axiosInstance";
import toast from "react-hot-toast";
import { LuLoader } from "react-icons/lu";

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { handleCallback } = useGoogleAuth();
  const token = searchParams.get("token");

  useEffect(() => {
    const processAuth = async () => {
      try {

        if (token) {
          setAuthToken(token);
          
      
          try {
            const response = await axiosInstance.get("/auth/me");
            if (response.data) {
              queryClient.setQueryData(["user"], response.data);
            }
          } catch {
            console.warn("[AuthSuccess] Could not fetch user data, using token payload");
           
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
          
          if (typeof window !== "undefined") {
            sessionStorage.setItem("lastLoginTime", Date.now().toString());
          }

          toast.success("Authentication successful!");
          
          // Decode token to get user info for redirect
          const decoded = decodeAuthToken();
          if (decoded) {
            const userRole = decoded.role;
            if (userRole === "admin") {
              router.push("/dashboard");
            } else {
              router.push("/");
            }
          } else {
            router.push("/");
          }
          return;
        }

        // Otherwise, try to handle Google callback (for /auth/google/success route)
        console.log("[AuthSuccess] No token in URL, trying Google callback");
        await handleCallback();
      } catch (error) {
        console.error("[AuthSuccess] Error processing auth:", error);
        toast.error("Authentication failed. Please try again.");
        router.push("/login?error=auth_failed");
      }
    };

    processAuth();
  }, [token, handleCallback, router, queryClient]);

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
            Completing Authentication
          </h1>
          <p className="text-gray-600">
            Please wait while we complete your authentication...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
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
      <AuthSuccessContent />
    </Suspense>
  );
}

