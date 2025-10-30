export type StoryType = "written" | "audio" | "video" | null;
export type IdentityPreference = "public" | "anonymous" | null;

export interface FormData {
  type: StoryType;
  identity: IdentityPreference;
  fullName: string;
  relationToEvent: string;
  relativesNames: string;
  location: string;
  dateOfEvent: string;
  testimony: string;
  eventTitle: string;
  consent: boolean;
  images: Array<{ file: File; description: string }>;
  audioFile: File | null;
  videoFile: File | null;
}
