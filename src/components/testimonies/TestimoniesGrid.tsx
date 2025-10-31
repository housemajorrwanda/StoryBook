"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LuCalendar,
  LuUser,
  LuMapPin,
  LuImage,
  LuMic,
  LuVideo,
  LuLoader,
} from "react-icons/lu";
import { useTestimonies } from "@/hooks/useTestimonies";
import { Testimony } from "@/types/testimonies";

interface TestimoniesGridProps {
  limit?: number;
  showHeader?: boolean;
}

export default function TestimoniesGrid({
  limit,
  showHeader = true,
}: TestimoniesGridProps) {
  const { data: testimonies, isLoading, error } = useTestimonies();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-gray-500">
          <LuLoader className="w-6 h-6 animate-spin" />
          <span>Loading testimonies...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <p className="text-lg font-semibold">Failed to load testimonies</p>
          <p className="text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  const displayedTestimonies = limit
    ? testimonies?.slice(0, limit)
    : testimonies;

  if (!displayedTestimonies || displayedTestimonies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <p className="text-lg font-semibold mb-2">No testimonies found</p>
          <p className="text-sm">Be the first to share your story</p>
        </div>
      </div>
    );
  }

  const getSubmissionIcon = (type: string) => {
    switch (type) {
      case "audio":
        return <LuMic className="w-4 h-4" />;
      case "video":
        return <LuVideo className="w-4 h-4" />;
      default:
        return <LuImage className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="w-full">
      {showHeader && (
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Testimonies
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Stories of resilience, courage, and remembrance from survivors and
            witnesses
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {displayedTestimonies.map((testimony: Testimony) => (
          <Link
            key={testimony.id}
            href={`/testimonies/${testimony.id}`}
            className="group block"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 group-hover:scale-[1.02]">
              {/* Image or Media Indicator */}
              <div className="relative h-48 bg-gray-100">
                {testimony.images && testimony.images.length > 0 ? (
                  <Image
                    src={testimony.images[0].imageUrl}
                    alt={
                      testimony.images[0].description || testimony.eventTitle
                    }
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-400">
                      {getSubmissionIcon(testimony.submissionType!)}
                    </div>
                  </div>
                )}

                {/* Media Type Badge */}
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                    {getSubmissionIcon(testimony.submissionType!)}
                    <span className="capitalize">
                      {testimony.submissionType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">
                  {truncateText(testimony.eventTitle, 60)}
                </h3>

                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                  {truncateText(
                    testimony.fullTestimony.replace(/<[^>]*>/g, ""), // Strip HTML tags
                    120
                  )}
                </p>

                {/* Metadata */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <LuUser className="w-4 h-4" />
                    <span>
                      {testimony.identityPreference === "anonymous"
                        ? "Anonymous"
                        : testimony.fullName}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="capitalize">
                      {testimony.relationToEvent}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <LuMapPin className="w-4 h-4" />
                    <span>{testimony.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <LuCalendar className="w-4 h-4" />
                    <span>{formatDate(testimony.dateOfEvent)}</span>
                  </div>
                </div>

                {/* Read More Indicator */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm font-semibold text-black group-hover:text-gray-600 transition-colors">
                    Read full testimony →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Show More Link */}
      {limit && testimonies && testimonies.length > limit && (
        <div className="text-center mt-8">
          <Link
            href="/testimonies"
            className="inline-block px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-colors duration-200"
          >
            View All Testimonies
          </Link>
        </div>
      )}
    </div>
  );
}
