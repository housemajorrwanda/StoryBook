import {
  FormData,
  CreateTestimonyRequest,
  ImageUploadResponse,
  AudioUploadResponse,
} from "@/types/testimonies";

/**
 * Transform form data to API request format
 */
export function transformFormDataToApiRequest(
  formData: FormData,
  uploadedImages: ImageUploadResponse[] = [],
  uploadedAudio?: AudioUploadResponse,
  uploadedVideo?: AudioUploadResponse
): CreateTestimonyRequest {
  const request: CreateTestimonyRequest = {
    submissionType: formData.type!,
    identityPreference: formData.identity!,
    fullName: formData.fullName,
    relationToEvent: formData.relationToEvent,
    nameOfRelative: formData.relativesNames,
    location: formData.location,
    dateOfEvent: formData.dateOfEvent,
    eventTitle: formData.eventTitle,
    eventDescription: "",
    fullTestimony: formData.testimony,
    agreedToTerms: formData.consent,
    images: uploadedImages.map((img, index) => ({
      imageUrl: img.url,
      imageFileName: img.fileName,
      description: formData.images[index]?.description || "",
      order: index + 1,
    })),
  };

  // Add audio fields if audio was uploaded
  if (uploadedAudio) {
    request.audioUrl = uploadedAudio.url;
    request.audioFileName = uploadedAudio.fileName;
    request.audioDuration = uploadedAudio.duration;
  }

  // Add video fields if video was uploaded
  if (uploadedVideo) {
    request.videoUrl = uploadedVideo.url;
    request.videoFileName = uploadedVideo.fileName;
    request.videoDuration = uploadedVideo.duration;
  }

  return request;
}

/**
 * Validate form data before submission
 */
export function validateFormData(formData: FormData): string[] {
  const errors: string[] = [];

  // Required fields validation
  if (!formData.type) {
    errors.push("Please select a submission type");
  }

  if (!formData.identity) {
    errors.push("Please select your identity preference");
  }

  if (!formData.fullName.trim()) {
    errors.push("Full name is required");
  }

  if (!formData.relationToEvent.trim()) {
    errors.push("Your role/relation to the event is required");
  }

  if (!formData.location.trim()) {
    errors.push("Location is required");
  }

  if (!formData.dateOfEvent) {
    errors.push("Date of event is required");
  }

  if (!formData.eventTitle.trim()) {
    errors.push("Event title is required");
  }

  if (!formData.consent) {
    errors.push("You must agree to the terms and conditions");
  }

  // Type-specific validation
  if (formData.type === "written") {
    if (!formData.testimony.trim()) {
      errors.push("Written testimony is required");
    }
  }

  if (formData.type === "audio") {
    if (!formData.audioFile) {
      errors.push("Audio file is required for audio testimonies");
    }
  }

  if (formData.type === "video") {
    if (!formData.videoFile) {
      errors.push("Video file is required for video testimonies");
    }
  }

  return errors;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Format duration in seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Validate file type and size
 */
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSizeInMB: number
): { isValid: boolean; error?: string } {
  const fileType = file.type || "";
  const fileName = file.name || "";

  const mimeMatches =
    !!fileType &&
    allowedTypes.some((type) =>
      type.endsWith("/*")
        ? fileType.startsWith(type.slice(0, type.indexOf("/*")))
        : fileType === type || fileType.startsWith(type)
    );

  const ext = (fileName.split(".").pop() || "").toLowerCase();
  const extToMime: Record<string, string[]> = {
    // images
    jpg: ["image/jpeg"],
    jpeg: ["image/jpeg"],
    png: ["image/png"],
    gif: ["image/gif"],
    webp: ["image/webp"],
    // audio
    mp3: ["audio/mpeg", "audio/mp3"],
    wav: ["audio/wav", "audio/x-wav"],
    ogg: ["audio/ogg"],
    m4a: ["audio/mp4", "audio/m4a", "audio/x-m4a"],
    aac: ["audio/aac"],
    mp4: ["video/mp4"],
    mov: ["video/mov", "video/quicktime"],
    avi: ["video/avi"],
    wmv: ["video/wmv"],
    webm: ["audio/webm", "video/webm"],
    mkv: ["video/x-matroska"],
  };

  const extensionMatches = ext
    ? (extToMime[ext] || []).some(
        (m) =>
          allowedTypes.includes(m) ||
          allowedTypes.some((allowed) => m.startsWith(allowed))
      )
    : false;

  if (!(mimeMatches || extensionMatches)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  // Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: `File size too large. Maximum size: ${maxSizeInMB}MB`,
    };
  }

  return { isValid: true };
}

/**
 * Get allowed file types for each submission type
 */
export const FILE_CONSTRAINTS = {
  image: {
    types: ["image/jpeg", "image/png", "image/gif", "image/webp"] as string[],
    maxSize: 5, // MB
  },
  audio: {
    types: [
      "audio/mpeg",
      "audio/wav",
      "audio/x-wav",
      "audio/mp3",
      "audio/ogg",
      "audio/mp4",
      "audio/m4a",
      "audio/x-m4a",
      "audio/aac",
      "audio/webm",
    ] as string[],
    maxSize: 50,
  },
  video: {
    types: [
      "video/mp4",
      "video/mov",
      "video/avi",
      "video/wmv",
      "video/quicktime",
      "video/webm",
      "video/x-matroska",
    ] as string[],
    maxSize: 200,
  },
};
