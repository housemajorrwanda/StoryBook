"use client";

import { Formik, Form, Field } from "formik";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLogin } from "@/hooks/auth/use-auth-queries";
import { loginValidationSchema } from "@/lib/validation/auth.validation";
import { LoginCredentials } from "@/types/auth";
import { CheckIcon, EyeIcon, EyeOffIcon } from "lucide-react";

export default function LoginPage() {
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (values: LoginCredentials) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-7xl flex items-center gap-8 lg:gap-12">
        {/* Left Side - Hero Image with Overlay */}
        <div className="hidden lg:flex lg:w-2/5 flex-col justify-center relative">
          <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl group">
            <Image
              src="/images/Visit-Rwanda-Flame-of-Remembrance-1920x1280.jpg"
              alt="Rwanda Remembrance"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
              sizes="(max-width: 1024px) 0vw, 40vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">31 Years</h2>
                    <p className="text-sm text-white/90">Of Remembrance</p>
                  </div>
                </div>

                <p className="text-white/90 leading-relaxed text-base max-w-md">
                  From tragedy to healing, from silence to testimony, from
                  separation to reunion. Join us in preserving history for
                  future generations.
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <div className="h-px w-12 bg-white/50" />
                  <span className="text-xs text-white/70 uppercase tracking-wider">
                    Kwibuka
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Divider Line */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-px h-96 bg-linear-to-b from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-3/5 flex items-center justify-center">
          <div className="w-full max-w-lg bg-white rounded-2xl p-8 lg:p-10 shadow-xl border border-gray-100">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Enter your credentials to access your account and continue
                preserving history
              </p>
            </div>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  {/* Google Login Button */}
                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with google
                  </button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent text-sm"
                      placeholder="Enter your email address"
                    />
                    {errors.email && touched.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent text-sm"
                        placeholder="Enter your password."
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && touched.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember me and Forgot password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center peer-checked:bg-gray-800 peer-checked:border-gray-800 transition-colors">
                          <CheckIcon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <span className="ml-2 text-xs text-gray-700 font-medium">
                        Remember me
                      </span>
                    </label>
                    <Link
                      href="#"
                      className="text-xs text-gray-600 hover:text-gray-800 cursor-pointer hover:underline hover:font-semibold duration-300 transition-all"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg font-bold hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </button>
                </Form>
              )}
            </Formik>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-gray-800 hover:text-gray-900 font-semibold cursor-pointer hover:underline hover:font-semibold duration-300 transition-all"
                >
                  Sign up
                </Link>{" "}
                here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
