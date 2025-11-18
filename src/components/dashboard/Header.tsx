"use client";

import { useState } from "react";
import { JWTPayload } from "@/types/auth";
import { useLogout } from "@/hooks/auth/use-auth-queries";

interface HeaderProps {
  title: string;
  user: JWTPayload | null;
  onMenuClick: () => void;
}

export default function Header({ title, user, onMenuClick }: HeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
    setShowProfileDropdown(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-6 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-2">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Page title */}
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        </div>
        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Welcome message */}
          <div className="text-right">
            <p className="text-xs font-medium text-gray-900">
              Welcome back,{" "}
              {user?.fullName
                ? `${user.fullName}`
                : user?.username || user?.email || "User"}
              !
            </p>
          </div>

          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100"
            >
              {/* Avatar */}
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {user?.fullName
                    ? `${String(user.fullName).charAt(0)}`
                    : user?.username
                    ? String(user.username).charAt(0).toUpperCase()
                    : user?.email
                    ? String(user.email).charAt(0).toUpperCase()
                    : "U"}
                </span>
              </div>

              {/* Dropdown arrow */}
              <svg
                className="w-3 h-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName
                      ? `${user.fullName}`
                      : user?.username || user?.email || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  {logoutMutation.isPending ? "Signing out..." : "Sign out"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
