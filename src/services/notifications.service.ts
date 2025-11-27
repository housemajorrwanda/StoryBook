import axiosInstance from "@/config/axiosInstance";
import {
  NotificationFilters,
  NotificationListResponse,
  Notification,
} from "@/types/notifications";

export const notificationsService = {
  async getNotifications(
    filters?: NotificationFilters
  ): Promise<NotificationListResponse> {
    const params: Record<string, string | number> = {};

    if (filters?.skip !== undefined) params.skip = filters.skip;
    if (filters?.limit !== undefined) params.limit = filters.limit;
    if (filters?.status) params.status = filters.status;

    const response =
      await axiosInstance.get<NotificationListResponse>("/notifications", {
        params,
      });

    return response.data;
  },

  async markNotificationRead(id: number): Promise<Notification> {
    const response = await axiosInstance.patch<Notification>(
      `/notifications/${id}/read`
    );
    return response.data;
  },

  async markAllNotificationsRead(): Promise<void> {
    await axiosInstance.patch("/notifications/read-all");
  },
};

export default notificationsService;

