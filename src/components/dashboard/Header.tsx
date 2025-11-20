"use client";

import { useState, useEffect } from "react";
import { JWTPayload } from "@/types/auth";
import { useLogout } from "@/hooks/auth/use-auth-queries";
import { 
  LuMenu, 
  LuChevronDown, 
  LuUser, 
  LuSettings, 
  LuLogOut,
  LuBell,
} from "react-icons/lu";

interface HeaderProps {
  title: string;
  user: JWTPayload | null;
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export default function Header({ title, user, onMenuClick, sidebarCollapsed }: HeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
    setShowProfileDropdown(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
      if (!target.closest('.notifications-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserInitial = () => {
    if (user?.fullName) return String(user.fullName).charAt(0).toUpperCase();
    if (user?.username) return String(user.username).charAt(0).toUpperCase();
    if (user?.email) return String(user.email).charAt(0).toUpperCase();
    return "U";
  };

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side - Title and Menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            <LuMenu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Page title with smooth transition */}
          <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-2' : ''}`}>
            <h1 className="text-2xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Welcome to your dashboard</p>
          </div>
        </div>

        {/* Right side - Notifications, Profile */}
        <div className="flex items-center space-x-4">

          {/* Notifications */}
          <div className="relative notifications-dropdown">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md group cursor-pointer"
            >
              <LuBell className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Notifications</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">New testimony submitted</p>
                          <p className="text-xs text-gray-500 mt-1">A user has submitted a new testimony for review</p>
                          <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="w-full text-center text-sm text-gray-600 font-medium hover:text-gray-700 py-2">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative profile-dropdown">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
            >
              {/* Avatar */}
              <div className="relative cursor-pointer">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-white font-semibold shadow">
                  {getUserInitial()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-500 border-2 border-white rounded-full"></div>
              </div>

              {/* User Info - Hidden on mobile */}
              <div className="hidden sm:block text-left cursor-pointer">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.fullName || user?.username || user?.email || "User"}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role || "Admin"}
                </p>
              </div>

              {/* Dropdown arrow */}
              <LuChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50">
                {/* User Summary */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.fullName || user?.username || "User"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                  <div className="flex items-center mt-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium capitalize">
                      {user?.role || "Admin"}
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <a
                    href="/dashboard/profile"
                    className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 group cursor-pointer text-gray-700 hover:font-bold duration-300 transition-all"
                  >
                    <LuUser className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600" />
                    <span>My Profile</span>
                  </a>
                  <a
                    href="/dashboard/settings"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 group hover:font-bold duration-300 transition-all"
                  >
                    <LuSettings className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600" />
                    <span>Account Settings</span>
                  </a>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 group cursor-pointer hover:font-bold duration-300 transition-all"
                  >
                    <LuLogOut className="w-4 h-4 mr-3 group-hover:animate-pulse text-red-600" />
                    <span>{logoutMutation.isPending ? "Signing Out..." : "Sign Out"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}