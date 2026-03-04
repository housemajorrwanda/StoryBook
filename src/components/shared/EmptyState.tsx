"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { LuFileText, LuSearch, LuInbox, LuPlus } from "react-icons/lu";

type EmptyStateVariant = "default" | "search" | "table";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
  /** "default" = white card (public pages), "search" = filtered results, "table" = inside a dashboard table */
  variant?: EmptyStateVariant;
  size?: "sm" | "md" | "lg";
}

const DEFAULT_ICONS: Record<EmptyStateVariant, ReactNode> = {
  default: <LuInbox className="w-10 h-10 text-gray-400" />,
  search: <LuSearch className="w-10 h-10 text-gray-400" />,
  table: <LuFileText className="w-9 h-9 text-gray-300" />,
};

const SIZE_MAP = {
  sm: { wrap: "py-8 px-6",   title: "text-base",  sub: "text-sm",   btn: "px-4 py-2 text-sm"   },
  md: { wrap: "py-14 px-8",  title: "text-lg",    sub: "text-sm",   btn: "px-5 py-2.5 text-sm"  },
  lg: { wrap: "py-20 px-8",  title: "text-xl",    sub: "text-base", btn: "px-6 py-3 text-base"  },
};

function ActionButton({
  action,
  primary,
  size,
}: {
  action: EmptyStateAction;
  primary: boolean;
  size: keyof typeof SIZE_MAP;
}) {
  const cls = `inline-flex items-center gap-2 ${SIZE_MAP[size].btn} rounded-lg font-medium transition-colors ${
    primary
      ? "bg-gray-900 text-white hover:bg-gray-700"
      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
  }`;

  if (action.href) {
    return (
      <Link href={action.href} className={cls}>
        {action.icon}
        {action.label}
      </Link>
    );
  }
  return (
    <button type="button" onClick={action.onClick} className={cls}>
      {action.icon}
      {action.label}
    </button>
  );
}

export default function EmptyState({
  title,
  subtitle,
  icon,
  action,
  secondaryAction,
  className = "",
  variant = "default",
  size = "md",
}: EmptyStateProps) {
  const s = SIZE_MAP[size];
  const resolvedIcon = icon ?? DEFAULT_ICONS[variant];
  const isTable = variant === "table";

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${s.wrap} ${
        isTable ? "" : "rounded-xl border border-gray-100 bg-white"
      } ${className}`}
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-50 border border-gray-100 mb-4">
        {resolvedIcon}
      </div>

      {/* Text */}
      <h3 className={`${s.title} font-semibold text-gray-900`}>{title}</h3>
      {subtitle && (
        <p className={`${s.sub} text-gray-500 mt-1.5 max-w-sm`}>{subtitle}</p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          {action && <ActionButton action={action} primary size={size} />}
          {secondaryAction && (
            <ActionButton action={secondaryAction} primary={false} size={size} />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Convenience wrapper for search/filter empty results.
 */
export function SearchEmptyState({
  query,
  onClear,
  className,
}: {
  query?: string;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      variant="search"
      size="md"
      title="No results found"
      subtitle={
        query
          ? `Nothing matched "${query}". Try adjusting your search or filters.`
          : "Try adjusting your search or filters."
      }
      action={
        onClear
          ? {
              label: "Clear filters",
              onClick: onClear,
              icon: <LuPlus className="w-4 h-4 rotate-45" />,
            }
          : undefined
      }
      className={className}
    />
  );
}
