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

export interface TestimonyConnection {
  id: number;
  eventTitle: string;
  eventDescription?: string | null;
  connectionDetails: {
    accuracyScore: number;
    rawScore: number;
    connectionType: string;
    connectionReason: string;
    source: string;
  };
  contactInfo: {
    email: string;
    fullName: string;
    residentPlace?: string | null;
  };
}

export interface Testimony {
  id: number;
  submissionType: StoryType;
  identityPreference: IdentityPreference;
  fullName: string;
  relationToEvent?: string;
  relatives?: ApiRelative[];
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
  transcript?: string | null;
  summary?: string | null;
  keyPhrases?: string[];
  connections?: TestimonyConnection[];
  resumePosition?: number;
}

// Request Types
export interface CreateTestimonyRequest {
  submissionType: StoryType;
  identityPreference: IdentityPreference;
  fullName: string;
  relationToEvent: string;
  relatives?: ApiRelative[];
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
  relatives?: ApiRelative[];
  location?: string;
  dateOfEventFrom?: string;
  dateOfEventTo?: string;
  eventTitle: string;
  eventDescription?: string;
  fullTestimony?: string;
  isDraft?: boolean;
  draftCursorPosition?: number;
  agreedToTerms: boolean;
  images?: (string | File)[];
  imageDescriptions?: string[];
  audio?: File | null;
  audioDuration?: number;
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

// Relative interface for form (user-friendly)
export interface FormRelative {
  value: string;
  name: string;
}

export interface ApiRelative {
  relativeTypeId: number;
  personName: string;
  notes?: string;
  order: number;
}

export interface FormData {
  type: StoryType;
  identity: IdentityPreference;
  fullName: string;
  relationToEvent: string;
  relatives?: FormRelative[];
  location: string;
  dateOfEventFrom?: string;
  dateOfEventTo?: string;
  testimony: string;
  eventTitle: string;
  consent: boolean;
  images: Array<{ file: File; description: string }>;
  existingImages: Array<{
    id?: number;
    imageUrl: string;
    description?: string;
    imageFileName?: string;
  }>;
  audioFile: File | null;
  videoFile: File | null;
  audioUrl?: string;
  videoUrl?: string;
  audioFileName?: string;
  videoFileName?: string;
  audioDuration?: number;
}

// Transcript Types
export type TranscriptStatus = "available" | "pending" | "processing" | "error";

export interface TranscriptResponse {
  id: number;
  transcript: string | null;
  hasTranscript: boolean;
  submissionType: StoryType;
  canHaveTranscript: boolean;
  hasMedia: boolean;
  transcriptStatus: TranscriptStatus | string;
}

export interface TranscriptSegment {
  text: string;
  startTime: number;
  endTime: number;
  confidence?: number;
}
