"use client";

import SingleEducationContent from "@/components/education/SingleEducationContent";
import {
  useEducationById,
  useTrackProgress,
  useIncrementViews,
} from "@/hooks/education/use-education-content";
import PageLayout from "@/layout/PageLayout";
import { useParams } from "next/navigation";

const SingleContentPage = () => {
  const { id } = useParams();
  const contentId = id ? Number(id) : 0;

 
  const trackProgressHook = useTrackProgress();
  const incrementViewsHook = useIncrementViews();

 
  const wrappedUseTrackProgress = () => ({
    mutate: trackProgressHook.mutate,
    isLoading: trackProgressHook.isPending,
  });

  const wrappedUseIncrementViews = () => ({
    mutate: incrementViewsHook.mutate,
  });

  // Validate the contentId
  if (!contentId || isNaN(contentId) || contentId <= 0) {
    return (
      <PageLayout showBackgroundEffects={true} variant="default">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.196 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Invalid Content ID
            </h2>
            <p className="text-gray-600 mb-4">
              The education content ID is invalid. Please check the URL and try
              again.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
            >
              Go Back
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBackgroundEffects={true} variant="default">
      <SingleEducationContent
        contentId={contentId}
        useEducationById={useEducationById}
        useTrackProgress={wrappedUseTrackProgress}
        useIncrementViews={wrappedUseIncrementViews}
      />
    </PageLayout>
  );
};

export default SingleContentPage;
