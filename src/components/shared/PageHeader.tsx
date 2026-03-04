"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface PageHeaderAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: PageHeaderAction[];
  /** Optional breadcrumb items */
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  actions = [],
  breadcrumb,
  className = "",
  children,
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-gray-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-600 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            {actions.map((action, i) => {
              const isPrimary = (action.variant ?? "primary") === "primary";
              const cls = `inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isPrimary
                  ? "bg-gray-900 text-white hover:bg-gray-700"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              } disabled:opacity-50 disabled:cursor-not-allowed`;

              if (action.href) {
                return (
                  <Link key={i} href={action.href} className={cls}>
                    {action.icon}
                    {action.label}
                  </Link>
                );
              }
              return (
                <button
                  key={i}
                  type="button"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={cls}
                >
                  {action.icon}
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
