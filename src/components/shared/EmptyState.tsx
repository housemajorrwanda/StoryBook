"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { LuFileText } from "react-icons/lu";

interface EmptyStateProps {
  /** Main title/heading */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Optional icon (defaults to LuFileText) */
  icon?: ReactNode;
  /** Optional action button */
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  /** Optional custom className */
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

export default function EmptyState({
  title,
  subtitle,
  icon,
  action,
  className = "",
  size = "md",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: "p-6",
      icon: "w-12 h-12",
      title: "text-lg",
      subtitle: "text-sm",
      button: "px-4 py-2 text-sm",
    },
    md: {
      container: "p-8 sm:p-12",
      icon: "w-16 h-16",
      title: "text-xl",
      subtitle: "text-base",
      button: "px-6 py-3 text-base",
    },
    lg: {
      container: "p-12 sm:p-16",
      icon: "w-20 h-20",
      title: "text-2xl",
      subtitle: "text-lg",
      button: "px-8 py-4 text-lg",
    },
  };

  const currentSize = sizeClasses[size];
  const defaultIcon = (
    <LuFileText className={`${currentSize.icon} text-gray-300`} />
  );

  const renderAction = () => {
    if (!action) return null;

    const buttonClasses = `inline-flex items-center ${currentSize.button} bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200`;

    if (action.href) {
      return (
        <Link href={action.href} className={buttonClasses}>
          {action.label}
        </Link>
      );
    }

    if (action.onClick) {
      return (
        <button onClick={action.onClick} className={buttonClasses}>
          {action.label}
        </button>
      );
    }

    return null;
  };

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 ${currentSize.container} text-center ${className}`}
    >
      <div className="flex justify-center mb-4">{icon || defaultIcon}</div>
      <h2 className={`${currentSize.title} font-semibold text-gray-900 mb-2`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`${currentSize.subtitle} text-gray-600 mb-6`}>
          {subtitle}
        </p>
      )}
      {renderAction()}
    </div>
  );
}
