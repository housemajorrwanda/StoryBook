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
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { Notification } from "@/types/notifications";
import {
  LuMenu,
  LuChevronDown,
  LuUser,
  LuSettings,
  LuLogOut,
  LuBell,
  LuCheck,
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
    if (Math.abs(duration) < amount)
      return rtf.format(Math.round(duration), unit);
    duration /= amount;
  }
  return rtf.format(Math.round(duration), "year");
}

export default function Header({
  title,
  user,
  onMenuClick,
  sidebarCollapsed,
}: HeaderProps) {
  const router = useRouter();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [infiniteMode, setInfiniteMode] = useState(false);
  const logoutMutation = useLogout();
  const notificationsScrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const notificationFilters = useMemo(() => ({ limit: 5 }), []);

  // Connect socket — keeps notification list live in real-time
  useNotificationSocket();

  const {
    data: notificationsPages,
    isLoading: isLoadingNotifications,
    isError: notificationsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteNotifications(notificationFilters);

  const markNotificationRead = useMarkNotificationRead();
  const markAllNotificationsRead = useMarkAllNotificationsRead();

  const notifications =
    notificationsPages?.pages.flatMap((page) => page.data) ?? [];
  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const handleNotificationClick = (notification: Notification) => {
    if (notification.status === "unread" && !markNotificationRead.isPending) {
      markNotificationRead.mutate(notification.id);
    }
    if (notification.metadata?.url) {
      setShowNotifications(false);
      router.push(notification.metadata.url);
    }
  };

  const handleViewMore = () => {
    if (!infiniteMode) setInfiniteMode(true);
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  useEffect(() => {
    if (!infiniteMode || !showNotifications || !hasNextPage) return;
    const root = notificationsScrollRef.current;
    const target = loadMoreRef.current;
    if (!root || !target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { root, rootMargin: "0px", threshold: 1.0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [infiniteMode, showNotifications, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (showNotifications) return;
    const frame = requestAnimationFrame(() => setInfiniteMode(false));
    return () => cancelAnimationFrame(frame);
  }, [showNotifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest(".profile-dropdown")) setShowProfileDropdown(false);
      if (!t.closest(".notifications-dropdown")) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserInitial = () => {
    if (user?.fullName) return String(user.fullName).charAt(0).toUpperCase();
    if (user?.username) return String(user.username).charAt(0).toUpperCase();
    if (user?.email) return String(user.email).charAt(0).toUpperCase();
    return "U";
  };

  const firstName =
    (user?.fullName ? String(user.fullName).split(" ")[0] : null) ??
    user?.username ??
    "";

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
        >
          <LuMenu className="w-4.5 h-4.5" />
        </button>

        <div
          className={`min-w-0 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-1" : ""}`}
        >
          <h1 className="text-sm font-semibold text-gray-900 leading-tight truncate">
            {title}
          </h1>
          <p className="text-xs text-gray-400 leading-tight mt-0.5">
            {firstName ? `Good day, ${firstName}` : "Welcome back"}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Notifications */}
        <div className="relative notifications-dropdown">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LuBell className={`w-[18px] h-[18px] transition-transform duration-200 ${unreadCount > 0 ? "text-gray-700" : ""}`} />
            {unreadCount > 0 && (
              <>
                {/* Ping animation ring */}
                <span className="absolute top-1 right-1 w-2.5 h-2.5">
                  <span className="absolute inset-0 rounded-full bg-gray-900 opacity-30 animate-ping" />
                  <span className="absolute inset-0 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-[7px] text-white font-bold leading-none">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  </span>
                </span>
              </>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 z-50 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Notifications
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {unreadCount > 0
                      ? `${unreadCount} unread`
                      : "All caught up"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => markAllNotificationsRead.mutate()}
                      disabled={markAllNotificationsRead.isPending}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-40"
                    >
                      <LuCheck className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div
                className="max-h-80 overflow-y-auto custom-scrollbar"
                ref={notificationsScrollRef}
              >
                {isLoadingNotifications ? (
                  <div className="space-y-4 px-5 py-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-100 mt-2 shrink-0" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-2.5 bg-gray-100 rounded-full w-1/3" />
                          <div className="h-2.5 bg-gray-100 rounded-full w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notificationsError ? (
                  <p className="px-5 py-8 text-center text-sm text-red-500">
                    Unable to load notifications.
                  </p>
                ) : notifications.length === 0 ? (
                  <p className="px-5 py-10 text-center text-sm text-gray-400">
                    No notifications yet.
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <button
                      type="button"
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left px-5 py-3.5 border-b border-gray-50 last:border-0 transition-colors ${
                        notification.status === "unread"
                          ? "bg-gray-50/60 hover:bg-gray-100/60"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                            notification.status === "unread"
                              ? "bg-gray-900"
                              : "bg-gray-200"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <span className="text-[11px] text-gray-400 whitespace-nowrap shrink-0">
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.metadata?.feedback && (
                            <p className="text-xs text-gray-400 mt-1 italic truncate">
                              &ldquo;{notification.metadata.feedback}&rdquo;
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            {notification.metadata?.submissionType && (
                              <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-gray-100 text-gray-500 capitalize">
                                {notification.metadata.submissionType}
                              </span>
                            )}
                            {notification.metadata?.status && (
                              <span
                                className={`px-1.5 py-0.5 text-[10px] rounded-md capitalize font-medium ${
                                  notification.metadata.status === "approved"
                                    ? "bg-green-50 text-green-700"
                                    : notification.metadata.status ===
                                        "rejected"
                                      ? "bg-red-50 text-red-600"
                                      : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {notification.metadata.status}
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.5 text-[10px] rounded-md capitalize ${
                                notification.priority === "high"
                                  ? "bg-red-50 text-red-600"
                                  : notification.priority === "medium"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {notification.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}

                {infiniteMode && hasNextPage && (
                  <div
                    ref={loadMoreRef}
                    className="py-3 text-center text-xs text-gray-400"
                  >
                    {isFetchingNextPage ? "Loading…" : "Scroll for more"}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-gray-100 text-center">
                {hasNextPage ? (
                  <button
                    type="button"
                    onClick={handleViewMore}
                    disabled={isFetchingNextPage}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-900 disabled:opacity-50 transition-colors"
                  >
                    {infiniteMode
                      ? isFetchingNextPage
                        ? "Loading…"
                        : "Scroll for more"
                      : "View more"}
                  </button>
                ) : (
                  <p className="text-xs text-gray-400">All caught up</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-100 mx-1" />

        {/* Profile */}
        <div className="relative profile-dropdown">
          <button
            type="button"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
              {getUserInitial()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900 leading-tight">
                {user?.fullName || user?.username || "User"}
              </p>
              <p className="text-[11px] text-gray-400 capitalize leading-tight">
                {user?.role || "Admin"}
              </p>
            </div>
            <LuChevronDown
              className={`w-3.5 h-3.5 text-gray-300 transition-transform duration-200 ${
                showProfileDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 z-50 overflow-hidden">
              {/* User info */}
              <div className="px-4 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {getUserInitial()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.fullName || user?.username || "User"}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <span className="inline-block mt-3 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-md font-semibold uppercase tracking-wide">
                  {user?.role || "Admin"}
                </span>
              </div>

              {/* Links */}
              <div className="py-1.5">
                <a
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <LuUser className="w-4 h-4 text-gray-400 shrink-0" />
                  My Profile
                </a>
                <a
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <LuSettings className="w-4 h-4 text-gray-400 shrink-0" />
                  Settings
                </a>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 py-1.5">
                <button
                  type="button"
                  onClick={() => {
                    logoutMutation.mutate();
                    setShowProfileDropdown(false);
                  }}
                  disabled={logoutMutation.isPending}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-colors"
                >
                  <LuLogOut className="w-4 h-4 shrink-0" />
                  {logoutMutation.isPending ? "Signing out…" : "Sign out"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
