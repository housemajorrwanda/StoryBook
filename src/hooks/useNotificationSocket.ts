import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAuthToken } from "@/lib/cookies";
import { Notification } from "@/types/notifications";
import { NOTIFICATION_KEYS } from "./useNotifications";

interface SocketNotificationPayload {
  notification: Notification;
}

interface SocketReadPayload {
  notificationId: number;
}

export function useNotificationSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

    const socket = io(`${base}/notifications`, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("notification:new", ({ notification }: SocketNotificationPayload) => {
      // Prepend new notification into every cached page
      queryClient.setQueriesData(
        { queryKey: NOTIFICATION_KEYS.all },
        (old: unknown) => {
          if (!old || typeof old !== "object") return old;
          // Infinite query shape: { pages: [{ data, total, ... }], ... }
          if ("pages" in (old as object)) {
            const paged = old as { pages: { data: Notification[]; total: number; skip: number; limit: number }[]; pageParams: unknown[] };
            return {
              ...paged,
              pages: paged.pages.map((page, i) =>
                i === 0
                  ? { ...page, data: [notification, ...page.data], total: page.total + 1 }
                  : page,
              ),
            };
          }
          return old;
        },
      );

      // Show a toast for the new notification
      toast(notification.title, {
        id: `notif-${notification.id}`,
        duration: 5000,
        icon: "🔔",
        style: {
          fontSize: "13px",
          fontWeight: 500,
        },
      });
    });

    socket.on("notification:read", ({ notificationId }: SocketReadPayload) => {
      queryClient.setQueriesData(
        { queryKey: NOTIFICATION_KEYS.all },
        (old: unknown) => {
          if (!old || typeof old !== "object" || !("pages" in (old as object))) return old;
          const paged = old as { pages: { data: Notification[]; total: number; skip: number; limit: number }[]; pageParams: unknown[] };
          return {
            ...paged,
            pages: paged.pages.map((page) => ({
              ...page,
              data: page.data.map((n) =>
                n.id === notificationId ? { ...n, status: "read" as const, readAt: new Date().toISOString() } : n,
              ),
            })),
          };
        },
      );
    });

    socket.on("notification:all_read", () => {
      queryClient.setQueriesData(
        { queryKey: NOTIFICATION_KEYS.all },
        (old: unknown) => {
          if (!old || typeof old !== "object" || !("pages" in (old as object))) return old;
          const paged = old as { pages: { data: Notification[]; total: number; skip: number; limit: number }[]; pageParams: unknown[] };
          return {
            ...paged,
            pages: paged.pages.map((page) => ({
              ...page,
              data: page.data.map((n) => ({ ...n, status: "read" as const, readAt: n.readAt ?? new Date().toISOString() })),
            })),
          };
        },
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
}
