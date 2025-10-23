'use client';

import { Formik, Form, Field } from 'formik';
import Link from 'next/link';
import { useLogin } from '@/hooks/auth/use-auth-queries';
import { loginValidationSchema } from '@/lib/validation/auth.validation';
import { LoginCredentials } from '@/types/auth';

export default function LoginPage() {
  const loginMutation = useLogin();

  const handleSubmit = (values: LoginCredentials) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-7xl flex items-center gap-12">
        {/* Left Side - Remembrance Timeline Card */}
        <div className="hidden lg:flex lg:w-2/5 flex-col justify-center">
          <div className="bg-gray-50 rounded-3xl p-12 shadow-xl border border-gray-100 max-w-lg w-full">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900">31 Years</h2>
              <p className="text-lg text-gray-600">Of Remembrance</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-12 leading-relaxed font-medium">
            From tragedy to healing, from silence to testimony, from separation to reunion.
          </p>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            <div className="relative flex items-start mb-8">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex-shrink-0 z-10"></div>
              <div className="ml-6">
                <h3 className="font-bold text-gray-900 mb-1">1994 - The Tragedy</h3>
                <p className="text-gray-600 text-sm">Genocide against the Tutsi in Rwanda.</p>
              </div>
            </div>

            <div className="relative flex items-start mb-8">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex-shrink-0 z-10"></div>
              <div className="ml-6">
                <h3 className="font-bold text-gray-900 mb-1">1994-2000 - Rebuilding</h3>
                <p className="text-gray-600 text-sm">Rwanda begins healing and reconciliation.</p>
              </div>
            </div>

            <div className="relative flex items-start mb-8">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex-shrink-0 z-10"></div>
              <div className="ml-6">
                <h3 className="font-bold text-gray-900 mb-1">2024 - Digital Archive</h3>
                <p className="text-gray-600 text-sm">This platform launches to preserve testimonies.</p>
              </div>
            </div>

            <div className="relative flex items-start">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex-shrink-0 z-10"></div>
              <div className="ml-6">
                <h3 className="font-bold text-gray-900 mb-1">Today - Your Story</h3>
                <p className="text-gray-600 text-sm">Join us in preserving history for future generations.</p>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Vertical Divider Line */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-px h-96 bg-gray-300"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-3/5 flex items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</h1>
              <p className="text-gray-600 text-lg">Enter your credentials to access your account</p>
            </div>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                {/* Google Login Button */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center px-6 py-4 border border-gray-200 rounded-2xl bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 text-lg font-medium shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
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
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    placeholder="Enter your email."
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    placeholder="Enter your password."
                  />
                  {errors.password && touched.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Remember me and Forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center peer-checked:bg-gray-800 peer-checked:border-gray-800 transition-colors">
                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-sm text-gray-700 font-medium">Remember me</span>
                  </label>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-800">
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-bold hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                </button>
              </Form>
            )}
          </Formik>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-lg text-gray-600">
                Don't have an account?{' '}
                <Link href="/signup" className="text-gray-800 hover:text-gray-900 font-medium transition-colors">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
