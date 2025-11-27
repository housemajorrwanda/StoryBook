import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import notificationsService from "@/services/notifications.service";
import { NotificationFilters } from "@/types/notifications";

export const NOTIFICATION_KEYS = {
  all: ["notifications"] as const,
  list: (filters?: NotificationFilters) =>
    [
      ...NOTIFICATION_KEYS.all,
      filters?.skip ?? 0,
      filters?.limit ?? 20,
      filters?.status ?? "all",
    ] as const,
};

export function useNotifications(filters?: NotificationFilters) {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(filters),
    queryFn: () => notificationsService.getNotifications(filters),
    refetchInterval: 60_000,
    staleTime: 30_000,
    select: (response) => response,
  });
}

export function useInfiniteNotifications(filters?: NotificationFilters) {
  return useInfiniteQuery({
    queryKey: [...NOTIFICATION_KEYS.all, filters?.status ?? "all"],
    queryFn: ({ pageParam = 0 }) =>
      notificationsService.getNotifications({
        ...filters,
        skip: pageParam,
        limit: filters?.limit ?? 5,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = (lastPage.skip ?? 0) + lastPage.data.length;
      if (nextSkip >= lastPage.total) {
        return undefined;
      }
      return nextSkip;
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationsService.markNotificationRead(id),
    onSuccess: (updatedNotification) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
      toast.success("Marked as read", {
        id: `notification-read-${updatedNotification.id}`,
      });
    },
    onError: (error) => {
      console.error("Failed to mark notification as read", error);
      toast.error("Unable to mark notification. Please try again.");
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsService.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
      toast.success("All notifications cleared", { id: "notifications-clear" });
    },
    onError: (error) => {
      console.error("Failed to mark all notifications as read", error);
      toast.error("Unable to mark all as read. Please try again.");
    },
  });
}

