"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { JWTPayload } from "@/types/auth";
import Link from "next/link";

interface UserAvatarProps {
  user: JWTPayload;
  size?: "sm" | "md" | "lg";
  className?: string;
  showDropdown?: boolean;
  onLogout?: () => void;
}

export default function UserAvatar({
  user,
  size = "md",
  className = "",
  showDropdown = false,
  onLogout,
}: UserAvatarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isClient = typeof window !== "undefined";

  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isDropdownOpen]);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.username) {
      return user.username[0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getUserName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username || user.email || "User";
  };

  const dropdownContent = showDropdown && isDropdownOpen && isClient && (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{ zIndex: 9998 }}
        onClick={() => setIsDropdownOpen(false)}
      />

      {/* Dropdown Menu */}
      <div
        className="fixed w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2"
        style={{
          zIndex: 9999,
          top: `${dropdownPosition.top}px`,
          right: `${dropdownPosition.right}px`,
        }}
      >
        <div className="px-4 py-3 border-b border-gray-100 cursor-pointer">
          <p className="text-sm font-semibold text-gray-900">{getUserName()}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        {user.role === "admin" && (
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => setIsDropdownOpen(false)}
          >
            Dashboard
          </Link>
        )}
        {onLogout && (
          <button
            onClick={() => {
              onLogout();
              setIsDropdownOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            Sign out
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className={`relative ${className} z-50`}>
      <button
        ref={buttonRef}
        onClick={() => showDropdown && setIsDropdownOpen(!isDropdownOpen)}
        className={`${sizeClasses[size]} rounded-full bg-black text-white font-bold flex items-center justify-center hover:ring-4 hover:ring-gray-300 transition-all duration-200 cursor-pointer shrink-0`}
        aria-label="User menu"
      >
        <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
          {getInitials()}
        </div>
      </button>

      {isClient &&
        dropdownContent &&
        createPortal(dropdownContent, document.body)}
    </div>
  );
}
