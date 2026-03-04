"use client";

import { ReactNode } from "react";
import { LuTriangleAlert, LuRefreshCcw, LuWifi } from "react-icons/lu";

type ErrorVariant = "default" | "network" | "notfound" | "forbidden";

interface ErrorStateProps {
  title?: string;
  message?: string;
  variant?: ErrorVariant;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  /** Extra content below the buttons */
  children?: ReactNode;
}

const VARIANT_CONFIG: Record<
  ErrorVariant,
  { icon: ReactNode; title: string; message: string }
> = {
  default: {
    icon: <LuTriangleAlert className="w-8 h-8 text-red-400" />,
    title: "Something went wrong",
    message: "We ran into an unexpected error. Please try again.",
  },
  network: {
    icon: <LuWifi className="w-8 h-8 text-gray-400" />,
    title: "Connection error",
    message: "Check your internet connection and try again.",
  },
  notfound: {
    icon: <LuTriangleAlert className="w-8 h-8 text-gray-300" />,
    title: "Not found",
    message: "The item you're looking for doesn't exist or has been removed.",
  },
  forbidden: {
    icon: <LuTriangleAlert className="w-8 h-8 text-amber-400" />,
    title: "Access denied",
    message: "You don't have permission to view this content.",
  },
};

export default function ErrorState({
  title,
  message,
  variant = "default",
  onRetry,
  retryLabel = "Try again",
  className = "",
  children,
}: ErrorStateProps) {
  const config = VARIANT_CONFIG[variant];

  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-14 px-8 rounded-xl border border-gray-100 bg-white ${className}`}
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
        {config.icon}
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-gray-900">
        {title ?? config.title}
      </h3>
      <p className="text-sm text-gray-500 mt-1.5 max-w-sm">
        {message ?? config.message}
      </p>

      {/* Actions */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <LuRefreshCcw className="w-4 h-4" />
          {retryLabel}
        </button>
      )}

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

/**
 * Compact inline error — for inside table cells or small areas.
 */
export function InlineError({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-red-600">
      <LuTriangleAlert className="w-4 h-4 shrink-0" />
      <span>{message ?? "Failed to load"}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-gray-600 underline underline-offset-2 hover:text-gray-900 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
