"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LuChevronLeft,
  LuChevronRight,
  LuArrowLeft,
  LuLoader,
  LuSave,
  LuCheck,
  LuFileText,
  LuCalendar,
  LuChevronRight as LuChevronRightIcon,
} from "react-icons/lu";
import { toast } from "react-hot-toast";
import SubmissionTypeStep from "@/components/testimony/SubmissionTypeStep";
import PersonalDetailsStep from "@/components/testimony/PersonalDetailsStep";
import TestimonyContentStep from "@/components/testimony/TestimonyContentStep";
import { FormData, CreateOrUpdateTestimonyRequest } from "@/types/testimonies";
import {
  useCreateTestimony,
  useUpdateTestimony,
  useTestimony,
  useDrafts,
} from "@/hooks/useTestimonies";
import { testimoniesService } from "@/services/testimonies.service";
import {
  validateFormData,
  validateFile,
  FILE_CONSTRAINTS,
} from "@/utils/testimony.utils";
import { isAuthenticated } from "@/lib/decodeToken";

export default function ShareStoryPage() {
  const searchParams = useSearchParams();
  const draftIdParam = searchParams.get("draft");
  const viewParam = searchParams.get("view");
  const draftId = draftIdParam ? parseInt(draftIdParam, 10) : null;
  const showDraftsList = viewParam === "drafts";

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedDraftId, setSavedDraftId] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    type: null,
    identity: null,
    fullName: "",
    relationToEvent: "",
    location: "",
    dateOfEventFrom: "",
    dateOfEventTo: "",
    testimony: "",
    eventTitle: "",
    consent: false,
    images: [],
    audioFile: null,
    videoFile: null,
    relatives: [],
  });

  // TanStack Query hooks
  const createTestimony = useCreateTestimony();
  const updateTestimony = useUpdateTestimony();

  // Fetch draft if draftId is present in URL
  const { data: draftData, isLoading: isFetchingDraft } = useTestimony(
    draftId && draftId > 0 ? draftId : 0
  );

  // Fetch all drafts if viewing drafts list
  const { data: allDrafts = [], isLoading: isLoadingAllDrafts } = useDrafts();

  const steps = [
    { number: 1, label: "Type", title: "Choose Submission Type" },
    { number: 2, label: "Details", title: "Personal Information" },
    { number: 3, label: "Testimony", title: "Share Your Story" },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    if (draftId && draftData && !draftLoaded && !isFetchingDraft) {
      setIsLoadingDraft(true);
      try {
        // Helper function to convert ISO date string to YYYY-MM-DD format for date inputs
        const formatDateForInput = (dateString: string | undefined): string => {
          if (!dateString) return "";
          try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "";
            // Format as YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          } catch {
            return "";
          }
        };

        // Helper function to normalize relationToEvent value (handle case differences)
        const normalizeRelationToEvent = (
          value: string | undefined
        ): string => {
          if (!value) return "";
          // Convert to lowercase and handle common variations
          const normalized = value.toLowerCase().trim();
          // Map common variations to expected values
          const mapping: Record<string, string> = {
            witness: "witness",
            "direct witness": "witness",
            survivor: "survivor",
            "family member": "family_member",
            "community member": "community_member",
            helper: "rescuer",
            rescuer: "rescuer",
            "helper/rescuer": "rescuer",
            other: "other",
          };
          return mapping[normalized] || normalized;
        };

        // Convert Testimony to FormData format
        const loadedFormData: FormData = {
          type: draftData.submissionType || null,
          identity: draftData.identityPreference || null,
          fullName: draftData.fullName || "",
          relationToEvent: normalizeRelationToEvent(draftData.relationToEvent),
          location: draftData.location || "",
          dateOfEventFrom: formatDateForInput(draftData.dateOfEventFrom),
          dateOfEventTo: formatDateForInput(draftData.dateOfEventTo),
          testimony: draftData.fullTestimony || "",
          eventTitle: draftData.eventTitle || "",
          consent: draftData.agreedToTerms || false,
          images: [],
          audioFile: null,
          videoFile: null,
          relatives: draftData.relatives || [],
        };

        setFormData(loadedFormData);
        setSavedDraftId(draftId);

        // Restore cursor position if available
        if (draftData.draftCursorPosition) {
          setCursorPosition(draftData.draftCursorPosition);
        }

        // Navigate to appropriate step based on what's filled
        if (loadedFormData.type && loadedFormData.identity) {
          if (loadedFormData.testimony) {
            setCurrentStep(3); // Go to testimony step if content exists
          } else if (loadedFormData.eventTitle || loadedFormData.fullName) {
            setCurrentStep(2); // Go to details step
          }
        }

        setDraftLoaded(true);
        toast.success(
          "Draft loaded successfully! Continue where you left off.",
          {
            icon: "📝",
            duration: 4000,
          }
        );
      } catch (error) {
        console.error("Error loading draft:", error);
        toast.error("Failed to load draft. Please try again.");
      } finally {
        setIsLoadingDraft(false);
      }
    }
  }, [draftId, draftData, draftLoaded, isFetchingDraft]);

  // Manual save draft functionality
  const handleSaveDraft = useCallback(async () => {
    // Only save if user is authenticated
    if (!isAuthenticated()) {
      toast.error("Please log in to save drafts");
      return;
    }

    // Don't save if form is empty or invalid
    if (!formData.type || !formData.identity || !formData.eventTitle) {
      toast.error(
        "Please fill in at least the submission type, identity, and event title"
      );
      return;
    }

    // Set saving status
    setSaveStatus("saving");

    try {
      // Upload images first to get URLs
      const imageUrls: string[] = [];
      if (formData.images.length > 0) {
        toast.loading("Uploading images...", { id: "upload-images" });
        const uploadPromises = formData.images.map((img) =>
          testimoniesService.uploadImage(img.file)
        );
        const uploadedImages = await Promise.all(uploadPromises);
        imageUrls.push(...uploadedImages.map((img) => img.url));
        toast.dismiss("upload-images");
      }

      // Build request
      const request: CreateOrUpdateTestimonyRequest = {
        submissionType: formData.type,
        identityPreference: formData.identity,
        fullName: formData.fullName || undefined,
        relationToEvent: formData.relationToEvent || undefined,
        location: formData.location || undefined,
        dateOfEventFrom: formData.dateOfEventFrom || undefined,
        dateOfEventTo: formData.dateOfEventTo || undefined,
        relatives: formData.relatives?.length ? formData.relatives : undefined,
        eventTitle: formData.eventTitle,
        eventDescription: "",
        fullTestimony: formData.testimony || undefined,
        isDraft: true,
        draftCursorPosition: cursorPosition,
        agreedToTerms: false, // Drafts don't require consent
        images: imageUrls.length > 0 ? imageUrls : undefined,
        audio: formData.audioFile || undefined,
        video: formData.videoFile || undefined,
      };

      // Save or update draft
      if (savedDraftId) {
        await updateTestimony.mutateAsync({
          id: savedDraftId,
          request,
        });
        toast.success("Draft updated successfully!", { icon: "💾" });
      } else {
        const result = await createTestimony.mutateAsync(request);
        setSavedDraftId(result.id);
        toast.success("Draft saved successfully!", { icon: "💾" });
      }

      setSaveStatus("saved");

      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Save draft failed:", error);
      setSaveStatus("idle");
      toast.error("Failed to save draft. Please try again.");
    }
  }, [
    formData,
    cursorPosition,
    savedDraftId,
    createTestimony,
    updateTestimony,
  ]);

  // Save draft on tab close/window unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only save if user has made changes and is authenticated
      if (
        isAuthenticated() &&
        formData.type &&
        formData.identity &&
        formData.eventTitle
      ) {
        // Use sendBeacon for reliable sending before page unload
        const request: CreateOrUpdateTestimonyRequest = {
          submissionType: formData.type,
          identityPreference: formData.identity,
          fullName: formData.fullName || undefined,
          relationToEvent: formData.relationToEvent || undefined,
          location: formData.location || undefined,
          dateOfEventFrom: formData.dateOfEventFrom || undefined,
          dateOfEventTo: formData.dateOfEventTo || undefined,
          relatives: formData.relatives?.length
            ? formData.relatives
            : undefined,
          eventTitle: formData.eventTitle,
          eventDescription: "",
          fullTestimony: formData.testimony || undefined,
          isDraft: true,
          draftCursorPosition: cursorPosition,
          agreedToTerms: false,
          images: undefined, // Skip images on unload to avoid delays
          audio: undefined, // Skip files on unload
          video: undefined,
        };

        // Save synchronously before unload
        if (savedDraftId) {
          navigator.sendBeacon(
            `${
              process.env.NEXT_PUBLIC_API_BASE_URL ||
              "https://storybook-backend-production-574d.up.railway.app"
            }/testimonies/${savedDraftId}`,
            JSON.stringify(request)
          );
        } else {
          navigator.sendBeacon(
            `${
              process.env.NEXT_PUBLIC_API_BASE_URL ||
              "https://storybook-backend-production-574d.up.railway.app"
            }/testimonies`,
            JSON.stringify(request)
          );
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formData, cursorPosition, savedDraftId]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate form data (consent is checked here for final submission only)
      const validationErrors = validateFormData(formData);

      // Add consent check for final submission (not required for drafts)
      if (!formData.consent) {
        validationErrors.push("You must agree to the terms and conditions");
      }

      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => toast.error(error));
        setIsSubmitting(false);
        return;
      }

      // Validate files before uploading
      for (const imageData of formData.images) {
        const v = validateFile(
          imageData.file,
          FILE_CONSTRAINTS.image.types,
          FILE_CONSTRAINTS.image.maxSize
        );
        if (!v.isValid) {
          toast.error(`Image ${imageData.file.name}: ${v.error}`);
          setIsSubmitting(false);
          return;
        }
      }

      if (formData.audioFile) {
        const v = validateFile(
          formData.audioFile,
          FILE_CONSTRAINTS.audio.types,
          FILE_CONSTRAINTS.audio.maxSize
        );
        if (!v.isValid) {
          toast.error(`Audio: ${v.error}`);
          setIsSubmitting(false);
          return;
        }
      }

      if (formData.videoFile) {
        const v = validateFile(
          formData.videoFile,
          FILE_CONSTRAINTS.video.types,
          FILE_CONSTRAINTS.video.maxSize
        );
        if (!v.isValid) {
          toast.error(`Video: ${v.error}`);
          setIsSubmitting(false);
          return;
        }
      }

      toast.loading("Uploading files and submitting testimony...", {
        id: "submit-testimony",
      });

      // Upload images first to get URLs
      const imageUrls: string[] = [];
      if (formData.images.length > 0) {
        const uploadPromises = formData.images.map((img) =>
          testimoniesService.uploadImage(img.file)
        );
        const uploadedImages = await Promise.all(uploadPromises);
        imageUrls.push(...uploadedImages.map((img) => img.url));
      }

      // Build request
      const request: CreateOrUpdateTestimonyRequest = {
        submissionType: formData.type!,
        identityPreference: formData.identity!,
        fullName: formData.fullName || undefined,
        relationToEvent: formData.relationToEvent || undefined,
        location: formData.location || undefined,
        dateOfEventFrom: formData.dateOfEventFrom || undefined,
        dateOfEventTo: formData.dateOfEventTo || undefined,
        relatives: formData.relatives?.length ? formData.relatives : undefined,
        eventTitle: formData.eventTitle,
        eventDescription: "",
        fullTestimony: formData.testimony || undefined,
        isDraft: false, // Final submission
        agreedToTerms: formData.consent,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        audio: formData.audioFile || undefined,
        video: formData.videoFile || undefined,
      };

      // Submit or update
      if (savedDraftId) {
        await updateTestimony.mutateAsync({
          id: savedDraftId,
          request,
        });
      } else {
        await createTestimony.mutateAsync(request);
      }

      toast.success("Testimony submitted successfully!", {
        id: "submit-testimony",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : error instanceof Error
          ? error.message
          : "Failed to submit testimony. Please try again.";
      toast.error(errorMessage, { id: "submit-testimony" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.type !== null && formData.identity !== null;
      case 2:
        return (
          formData.fullName &&
          formData.relationToEvent &&
          formData.location &&
          formData.dateOfEventFrom &&
          formData.dateOfEventTo
        );
      case 3:
        // Validate required fields for all types
        const hasEventTitle = formData.eventTitle.trim().length > 0;
        const hasConsent = formData.consent;

        // Validate type-specific content
        let hasContent = false;
        switch (formData.type) {
          case "written":
            hasContent = formData.testimony.trim().length > 0;
            break;
          case "audio":
          case "video":
            hasContent = true;
            break;
          default:
            hasContent = false;
        }

        return hasEventTitle && hasConsent && hasContent;
      default:
        return false;
    }
  };

  // Drafts list view
  if (showDraftsList) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Navigation */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
            >
              <LuArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold text-sm sm:text-base">
                Back to Home
              </span>
            </Link>
            <Link
              href="/share-testimony"
              className="px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 text-sm"
            >
              New Testimony
            </Link>
          </div>
        </header>

        {/* Drafts List Content */}
        <main className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              My Drafts
            </h1>
            <p className="text-gray-600">
              Continue working on your saved testimonies
            </p>
          </div>

          {isLoadingAllDrafts ? (
            <div className="flex items-center justify-center py-12">
              <LuLoader className="w-8 h-8 animate-spin text-gray-400" />
              <span className="ml-3 text-gray-600">Loading drafts...</span>
            </div>
          ) : allDrafts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
              <LuFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No drafts yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start sharing your story and save it as a draft to continue
                later.
              </p>
              <Link
                href="/share-testimony"
                className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200"
              >
                Start New Testimony
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {allDrafts.map((draft) => {
                const formatDraftTitle = () => {
                  if (draft.eventTitle) {
                    return draft.eventTitle.length > 50
                      ? `${draft.eventTitle.substring(0, 50)}...`
                      : draft.eventTitle;
                  }
                  return draft.submissionType
                    ? `${
                        String(draft.submissionType).charAt(0).toUpperCase() +
                        String(draft.submissionType).slice(1)
                      } Testimony`
                    : "Untitled Draft";
                };

                return (
                  <Link
                    key={draft.id}
                    href={`/share-testimony?draft=${draft.id}`}
                    className="block bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <LuSave className="w-4 h-4 text-blue-500 shrink-0" />
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition-colors">
                            {formatDraftTitle()}
                          </h3>
                        </div>
                        {draft.fullName && (
                          <p className="text-sm text-gray-600 mb-2">
                            {draft.fullName}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {draft.updatedAt && (
                            <div className="flex items-center gap-1">
                              <LuCalendar className="w-3 h-3" />
                              <span>
                                Updated{" "}
                                {new Date(draft.updatedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          )}
                          {draft.submissionType && (
                            <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 capitalize">
                              {draft.submissionType}
                            </span>
                          )}
                        </div>
                      </div>
                      <LuChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 shrink-0 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading overlay when fetching draft */}
      {(isFetchingDraft || isLoadingDraft) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 text-center">
            <LuLoader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Loading Draft
            </h3>
            <p className="text-sm text-gray-600">Restoring your testimony...</p>
          </div>
        </div>
      )}

      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
          >
            <LuArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold text-sm sm:text-base">
              Back to Home
            </span>
          </Link>

          {/* Draft indicator badge */}
          {draftId && savedDraftId && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs sm:text-sm font-semibold">
              <LuSave className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Resuming draft</span>
              <span className="sm:hidden">Draft</span>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4">
            {isAuthenticated() && (
              <button
                onClick={handleSaveDraft}
                disabled={
                  saveStatus === "saving" ||
                  !formData.type ||
                  !formData.identity ||
                  !formData.eventTitle
                }
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs sm:text-sm"
              >
                {saveStatus === "saving" ? (
                  <>
                    <LuLoader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    <span className="hidden sm:inline">Saving...</span>
                  </>
                ) : saveStatus === "saved" ? (
                  <>
                    <LuCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span className="hidden sm:inline">Saved!</span>
                  </>
                ) : (
                  <>
                    <LuSave className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Save Draft</span>
                  </>
                )}
              </button>
            )}

            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">
                  S
                </span>
              </div>
              <span className="font-bold text-gray-900 text-sm sm:text-base">
                StoryBook
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-12">
        {/* Page Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
            Share Your Testimony
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-3xl mx-auto px-4 sm:px-6 leading-relaxed">
            Your story matters. Help preserve history and connect families by
            sharing your experiences from the 1994 genocide against the Tutsi in
            Rwanda.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8 md:mb-12">
          {/* Mobile Progress Bar */}
          <div className="sm:hidden mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>
                Step {currentStep} of {steps.length}
              </span>
              <span>{steps[currentStep - 1]?.label}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-black h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop Progress Steps */}
          <div className="hidden sm:flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-lg transition-all duration-300 ${
                      currentStep === step.number
                        ? "bg-black text-white shadow-lg scale-110"
                        : currentStep > step.number
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="ml-2 md:ml-3 text-left">
                    <p className="text-xs md:text-sm font-semibold text-gray-900">
                      {step.label}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-8 md:w-20 rounded-full transition-all duration-300 mx-2 md:mx-4 ${
                      currentStep > step.number ? "bg-black" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200">
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Step 1: Type Selection */}
            {currentStep === 1 && (
              <SubmissionTypeStep
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {/* Step 2: Details Form */}
            {currentStep === 2 && (
              <PersonalDetailsStep
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {/* Step 3: Testimony */}
            {currentStep === 3 && (
              <TestimonyContentStep
                formData={formData}
                setFormData={setFormData}
                onCursorChange={setCursorPosition}
                onSaveDraft={handleSaveDraft}
              />
            )}
          </div>

          {/* Footer Navigation */}
          <div className="border-t border-gray-200 px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 bg-gray-50 rounded-b-2xl sm:rounded-b-3xl flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-gray-700 hover:text-gray-900 font-semibold transition-colors duration-200 cursor-pointer text-sm sm:text-base order-2 sm:order-1"
              >
                <LuChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Back
              </button>
            ) : (
              <div className="order-2 sm:order-1" />
            )}

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-black text-white font-semibold rounded-lg sm:rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base w-full sm:w-auto order-1 sm:order-2 justify-center"
              >
                Continue
                <LuChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <div className="flex items-center gap-3 order-1 sm:order-2">
                {/* Save Draft Button (only if authenticated) */}
                {isAuthenticated() && (
                  <button
                    onClick={handleSaveDraft}
                    disabled={saveStatus === "saving"}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
                  >
                    {saveStatus === "saving" ? (
                      <>
                        <LuLoader className="w-4 h-4 animate-spin" />
                        <span className="hidden sm:inline">Saving...</span>
                      </>
                    ) : saveStatus === "saved" ? (
                      <>
                        <LuCheck className="w-4 h-4 text-green-500" />
                        <span className="hidden sm:inline">Saved!</span>
                      </>
                    ) : (
                      <>
                        <LuSave className="w-4 h-4" />
                        <span className="hidden sm:inline">Save Draft</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className="flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-black text-white font-semibold rounded-lg sm:rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <LuLoader className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Testimony"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-4 sm:mt-6 md:mt-8">
          <p className="text-gray-500 text-xs sm:text-sm px-4 leading-relaxed">
            Your testimony is important. Thank you for sharing your story with
            us.
          </p>
        </div>
      </div>
    </div>
  );
}
