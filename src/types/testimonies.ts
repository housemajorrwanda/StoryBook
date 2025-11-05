export type StoryType = "written" | "audio" | "video" | null;
export type IdentityPreference = "public" | "anonymous" | null;
export type TestimonyStatus = "pending" | "approved" | "rejected";

// API Types
export interface TestimonyImage {
  id?: number;
  imageUrl: string;
  imageFileName: string;
  description: string;
  order: number;
  testimonyId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimony {
  id: number;
  submissionType: StoryType;
  identityPreference: IdentityPreference;
  fullName: string;
  relationToEvent?: string;
  relatives?: Array<Record<string, unknown>>;
  location: string;
  dateOfEventFrom?: string;
  dateOfEventTo?: string;
  eventTitle: string;
  eventDescription?: string;
  fullTestimony: string;
  audioUrl?: string;
  audioFileName?: string;
  audioDuration?: number;
  videoUrl?: string;
  videoFileName?: string;
  videoDuration?: number;
  agreedToTerms: boolean;
  status: TestimonyStatus;
  isPublished: boolean;
  impressions: number;
  adminFeedback?: string;
  reportReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  images: TestimonyImage[];
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
  isDraft?: boolean;
  draftCursorPosition?: number;
}

// Request Types
export interface CreateTestimonyRequest {
  submissionType: StoryType;
  identityPreference: IdentityPreference;
  fullName: string;
  relationToEvent: string;
  relatives?: Array<Record<string, unknown>>;
  location: string;
  dateOfEventFrom?: string;
  dateOfEventTo?: string;
  eventTitle: string;
  eventDescription?: string;
  fullTestimony: string;
  audioUrl?: string;
  audioFileName?: string;
  audioDuration?: number;
  videoUrl?: string;
  videoFileName?: string;
  videoDuration?: number;
  images: Array<{
    imageUrl: string;
    imageFileName: string;
    description: string;
    order: number;
  }>;
  agreedToTerms: boolean;
}

export interface CreateOrUpdateTestimonyRequest {
  submissionType: StoryType;
  identityPreference: IdentityPreference;
  fullName?: string;
  relationToEvent?: string;
  relatives?: Array<Record<string, unknown>>;
  location?: string;
  dateOfEventFrom?: string;
  dateOfEventTo?: string;
  eventTitle: string;
  eventDescription?: string;
  fullTestimony?: string;
  isDraft?: boolean;
  draftCursorPosition?: number;
  agreedToTerms: boolean;
  images?: string[];
  audio?: File | null;
  video?: File | null;
}

// Upload Response Types
export interface ImageUploadResponse {
  url: string;
  fileName: string;
  publicId: string;
}

export interface AudioUploadResponse {
  url: string;
  fileName: string;
  duration: number;
  publicId: string;
}

export interface FormData {
  type: StoryType;
  identity: IdentityPreference;
  fullName: string;
  relationToEvent: string;
  relatives?: Array<Record<string, unknown>>;
  location: string;
  dateOfEventFrom?: string;
  dateOfEventTo?: string;
  testimony: string;
  eventTitle: string;
  consent: boolean;
  images: Array<{ file: File; description: string }>;
  audioFile: File | null;
  videoFile: File | null;
}
