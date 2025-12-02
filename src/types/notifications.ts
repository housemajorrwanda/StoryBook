export type NotificationAudience = "admin" | "owner" | "user" | string;
export type NotificationStatus = "read" | "unread";
export type NotificationPriority = "low" | "medium" | "high" | "normal" | string;
export type NotificationType =
  | "testimony_submitted"
  | "testimony_updated"
  | "testimony_published"
  | "testimony_approved"
  | "testimony_rejected"
  | "feedback_resolved"
  | "user_reported"
  | string;

export interface NotificationMetadata {
  testimonyId?: number;
  submissionType?: string;
  url?: string;
  status?: string;
  feedback?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  audience: NotificationAudience;
  status: NotificationStatus;
  priority: NotificationPriority;
  metadata?: NotificationMetadata | null;
  userId?: number | null;
  createdAt: string;
  readAt?: string | null;
}

export interface NotificationListResponse {
  data: Notification[];
  total: number;
  skip: number;
  limit: number;
}

export interface NotificationFilters {
  skip?: number;
  limit?: number;
  status?: NotificationStatus;
}

