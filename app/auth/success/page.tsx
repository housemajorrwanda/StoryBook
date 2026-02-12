"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useGoogleAuth } from "@/hooks/auth/use-auth-queries";
import { setAuthToken } from "@/lib/cookies";
import { decodeAuthToken } from "@/lib/decodeToken";
import axiosInstance from "@/config/axiosInstance";
import toast from "react-hot-toast";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

type AuthState = "loading" | "success" | "error";

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { handleCallback } = useGoogleAuth();
  const token = searchParams.get("token");
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [statusText, setStatusText] = useState("Verifying your credentials...");

  useEffect(() => {
    const processAuth = async () => {
      try {
        if (token) {
          setStatusText("Securing your session...");
          setAuthToken(token);

          try {
            const response = await axiosInstance.get("/auth/me");
            if (response.data) {
              queryClient.setQueryData(["user"], response.data);
            }
          } catch {
            console.warn(
              "[AuthSuccess] Could not fetch user data, using token payload",
            );

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

          setStatusText("Authentication successful!");
          setAuthState("success");
          toast.success("Authentication successful!");

          // Brief delay so user sees the success state
          await new Promise((resolve) => setTimeout(resolve, 800));

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
        setStatusText("Completing Google sign-in...");
        await handleCallback();
      } catch (error) {
        console.error("[AuthSuccess] Error processing auth:", error);
        setAuthState("error");
        setStatusText("Authentication failed");
        toast.error("Authentication failed. Please try again.");
      }
    };

    processAuth();
  }, [token, handleCallback, router, queryClient]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        {/* Icon */}
        <div className="mb-6">
          {authState === "loading" && (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          {authState === "success" && (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/15 rounded-full">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
          )}
          {authState === "error" && (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/15 rounded-full">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-2">
          {authState === "loading" && "Completing Authentication"}
          {authState === "success" && "You're all set!"}
          {authState === "error" && "Something went wrong"}
        </h1>

        {/* Status text */}
        <p className="text-gray-400 text-sm">{statusText}</p>

        {/* Progress dots for loading */}
        {authState === "loading" && (
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse [animation-delay:150ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse [animation-delay:300ms]" />
          </div>
        )}

        {/* Redirecting text for success */}
        {authState === "success" && (
          <p className="text-gray-500 text-xs mt-4">Redirecting you now...</p>
        )}

        {/* Error actions */}
        {authState === "error" && (
          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={() => {
                setAuthState("loading");
                setStatusText("Retrying authentication...");
                window.location.reload();
              }}
              className="w-full bg-white text-black py-2.5 px-4 rounded-xl font-semibold hover:bg-gray-100 transition-all text-sm cursor-pointer"
            >
              Try Again
            </button>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
          <div className="w-full max-w-sm text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Loading...
            </h1>
          </div>
        </div>
      }
    >
      <AuthSuccessContent />
    </Suspense>
  );
}
