"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { JWTPayload } from "@/types/auth";
import { useLogout } from "@/hooks/auth/use-auth-queries";
import {
  useInfiniteNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/useNotifications";
import { Notification } from "@/types/notifications";
import { 
  LuMenu, 
  LuChevronDown, 
  LuUser, 
  LuSettings, 
  LuLogOut,
  LuBell,
  LuCheck,
  LuRefreshCcw,
} from "react-icons/lu";

interface HeaderProps {
  title: string;
  user: JWTPayload | null;
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

const RELATIVE_TIME_DIVISIONS: Array<[number, Intl.RelativeTimeFormatUnit]> = [
  [60, "second"],
  [60, "minute"],
  [24, "hour"],
  [7, "day"],
  [4.34524, "week"],
  [12, "month"],
  [Infinity, "year"],
];

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  let duration = (date.getTime() - now.getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [amount, unit] of RELATIVE_TIME_DIVISIONS) {
    if (Math.abs(duration) < amount) {
      return rtf.format(Math.round(duration), unit);
    }
    duration /= amount;
  }

  return rtf.format(Math.round(duration), "year");
}

export default function Header({ title, user, onMenuClick, sidebarCollapsed }: HeaderProps) {
  const router = useRouter();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [infiniteMode, setInfiniteMode] = useState(false);
  const logoutMutation = useLogout();
  const notificationsScrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const notificationFilters = useMemo(() => ({ limit: 5 }), []);
  const {
    data: notificationsPages,
    isLoading: isLoadingNotifications,
    isError: notificationsError,
    isFetching: isFetchingNotifications,
    refetch: refetchNotifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteNotifications(notificationFilters);
  const markNotificationRead = useMarkNotificationRead();
  const markAllNotificationsRead = useMarkAllNotificationsRead();

  const notifications =
    notificationsPages?.pages.flatMap((page) => page.data) ?? [];
  const unreadCount = notifications.filter((notif) => notif.status === "unread").length;
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if unread
    if (notification.status === "unread" && !markNotificationRead.isPending) {
      markNotificationRead.mutate(notification.id);
    }
    
    // Navigate to URL if present in metadata
    if (notification.metadata?.url) {
      setShowNotifications(false);
      router.push(notification.metadata.url);
    }
  };

  const handleViewMore = () => {
    if (!infiniteMode) {
      setInfiniteMode(true);
    }
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (!infiniteMode || !showNotifications || !hasNextPage) return;
    const root = notificationsScrollRef.current;
    const target = loadMoreRef.current;
    if (!root || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        root,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [infiniteMode, showNotifications, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (showNotifications) return;
    const frame = requestAnimationFrame(() => setInfiniteMode(false));
    return () => cancelAnimationFrame(frame);
  }, [showNotifications]);

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
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md group cursor-pointer"
            >
              <LuBell className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
              {unreadCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center font-semibold border ${
                    unreadCount > 9
                      ? "bg-white text-red-600 border-red-500"
                      : "bg-red-500 text-white border-red-500"
                  }`}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
              {isFetchingNotifications && (
                <span className="absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full bg-blue-500 animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 z-50">
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Notifications</p>
                    <p className="text-xs text-gray-500">
                      {unreadCount > 0
                        ? `${unreadCount} unread`
                        : "You're all caught up"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => refetchNotifications()}
                      disabled={isFetchingNotifications}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <LuRefreshCcw className="w-4 h-4" />
                    </button>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() => markAllNotificationsRead.mutate()}
                        disabled={markAllNotificationsRead.isPending}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                      >
                        <LuCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className="max-h-96 overflow-y-auto"
                  ref={notificationsScrollRef}
                >
                  {isLoadingNotifications ? (
                    <div className="space-y-3 px-4 py-3">
                      {[...Array(3)].map((_, idx) => (
                        <div
                          key={`skeleton-${idx}`}
                          className="animate-pulse space-y-2"
                        >
                          <div className="h-3 bg-gray-200 rounded-full w-1/3" />
                          <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                        </div>
                      ))}
                    </div>
                  ) : notificationsError ? (
                    <div className="px-4 py-6 text-center text-sm text-red-600">
                      Unable to load notifications. Please try again.
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-12 text-center text-sm text-gray-500">
                      No notifications just yet.
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        type="button"
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer ${
                          notification.status === "unread"
                            ? "bg-blue-50/60 hover:bg-blue-50 cursor-pointer"
                            : "hover:bg-gray-50 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                              notification.status === "unread"
                                ? "bg-gray-500"
                                : "bg-gray-300"
                            }`}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-gray-900">
                                {notification.title}
                              </p>
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                {formatRelativeTime(notification.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            {notification.metadata?.feedback && (
                              <p className="text-xs text-gray-500 mt-1.5 italic">
                                &ldquo;{notification.metadata.feedback}&rdquo;
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {notification.metadata?.submissionType && (
                                <span className="px-2 py-0.5 text-[11px] rounded-full bg-gray-100 text-gray-600 capitalize">
                                  {notification.metadata.submissionType}
                                </span>
                              )}
                              {notification.metadata?.status && (
                                <span
                                  className={`px-2 py-0.5 text-[11px] rounded-full capitalize font-medium ${
                                    notification.metadata.status === "approved"
                                      ? "bg-green-100 text-green-700"
                                      : notification.metadata.status === "rejected"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {notification.metadata.status}
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 text-[11px] rounded-full capitalize ${
                                  notification.priority === "high"
                                    ? "bg-red-100 text-red-700"
                                    : notification.priority === "medium"
                                    ? "bg-amber-100 text-amber-700"
                                    : notification.priority === "normal"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {notification.priority} priority
                              </span>
                              {notification.status === "unread" && (
                                <span className="text-[11px] font-semibold text-gray-600">
                                  {notification.metadata?.url
                                    ? "Tap to view"
                                    : "Tap to mark as read"}
                                </span>
                              )}
                              {notification.status === "read" && notification.metadata?.url && (
                                <span className="text-[11px] text-blue-600">
                                  Tap to view
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  )}

                  {infiniteMode && hasNextPage && (
                    <div
                      ref={loadMoreRef}
                      className="py-3 text-center text-xs text-gray-500"
                    >
                      {isFetchingNextPage
                        ? "Loading more notifications..."
                        : "Scroll to load more"}
                    </div>
                  )}
                </div>
                <div className="px-4 py-2 border-t border-gray-100 text-center">
                  {hasNextPage ? (
                    <button
                      type="button"
                      onClick={() => handleViewMore()}
                      disabled={isFetchingNextPage}
                      className="text-sm font-semibold text-gray-900 hover:text-gray-600 disabled:opacity-60 cursor-pointer"
                    >
                      {infiniteMode
                        ? isFetchingNextPage
                          ? "Loading..."
                          : "Keep scrolling for more"
                        : "View more"}
                    </button>
                  ) : (
                    <p className="text-xs text-gray-500">No more notifications</p>
                  )}
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
