"use client";

import { Formik, Form, Field } from "formik";
import Link from "next/link";
import { useState } from "react";
import { useForgotPassword } from "@/hooks/auth/use-auth-queries";
import { forgotPasswordValidationSchema } from "@/lib/validation/auth.validation";
import { ArrowLeftIcon, MailIcon } from "lucide-react";

export default function ForgotPasswordPage() {
  const forgotPasswordMutation = useForgotPassword();
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const handleSubmit = async (
    values: { email: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      await forgotPasswordMutation.mutateAsync(values.email);
      setSentEmail(values.email);
      setEmailSent(true);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <>
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
            <MailIcon className="w-8 h-8 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Check your email
          </h1>
          <p className="text-gray-400 text-sm mb-2">
            We sent a password reset link to
          </p>
          <p className="text-white font-medium text-sm mb-8">{sentEmail}</p>

          <button
            onClick={() => {
              setEmailSent(false);
              setSentEmail("");
            }}
            className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Didn&apos;t receive the email? Click to resend
          </button>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Forgot password?
        </h1>
        <p className="text-gray-400 text-sm">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={forgotPasswordValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={false}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-400 mb-1.5"
              >
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="w-full px-3.5 py-2.5 border border-white/10 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-sm transition-all"
                placeholder="Enter your email address"
              />
              {errors.email && touched.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={isSubmitting || forgotPasswordMutation.isPending}
              className="w-full bg-white text-black py-2.5 px-4 rounded-xl font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
            >
              {isSubmitting || forgotPasswordMutation.isPending
                ? "Sending..."
                : "Reset Password"}
            </button>
          </Form>
        )}
      </Formik>

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Sign In
        </Link>
      </div>
    </>
  );
}
