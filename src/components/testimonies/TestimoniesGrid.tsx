"use client";

import Link from "next/link";
import Image from "next/image";
import {
  User,
  MapPin,
  Mic,
  Video,
  ArrowRight,
  Eye,
  FileText,
} from "lucide-react";
import { useTestimonies } from "@/hooks/useTestimonies";
import { Testimony } from "@/types/testimonies";
import {
  formatImpressions,
  generateTestimonySlug,
} from "@/utils/testimony.utils";
import { EmptyState } from "@/components/shared";

interface TestimoniesGridProps {
  limit?: number;
  showHeader?: boolean;
}

export default function TestimoniesGrid({
  limit,
  showHeader = true,
}: TestimoniesGridProps) {
  const { data: testimonies, isLoading, error } = useTestimonies();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSubmissionIcon = (type: string) => {
    switch (type) {
      case "audio":
        return <Mic className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="relative">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
              <div className="absolute inset-0 blur-2xl bg-gray-400 opacity-20 animate-pulse" />
            </div>
            <div className="text-center">
              <span className="text-xl text-gray-900 font-bold tracking-wide block">
                Loading Stories
              </span>
              <span className="text-sm text-gray-500 mt-1 block">
                Preparing testimonies for you
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <div className="inline-block p-12 bg-red-50 border-l-4 border-red-600">
          <p className="text-2xl font-black text-red-900 mb-3">
            Unable to Load Testimonies
          </p>
          <p className="text-base text-red-600 mb-6">
            Please refresh the page or try again later
          </p>
          <button className="px-8 py-4 bg-red-600 text-white font-bold hover:bg-red-700 transition-all duration-300">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayedTestimonies = limit
    ? testimonies?.slice(0, limit)
    : testimonies;

  if (!displayedTestimonies || displayedTestimonies.length === 0) {
    return (
      <EmptyState
        title="No Testimonies Yet"
        subtitle="Be the first to share your story and inspire others with your journey"
        icon={<FileText className="w-16 h-16 text-gray-300" />}
        size="lg"
      />
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-8">
      {showHeader && (
        <div className="max-w-6xl mx-auto mb-20">
          <div className="border-l-8 border-black pl-6">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-600 block mb-2">
              Testimonies
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-black leading-none">
              Stories That Matter
            </h1>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl">
              Voices of resilience, courage, and remembrance from survivors and
              witnesses
            </p>
          </div>
        </div>
      )}

      {/* List-Style Layout */}
      <div className="max-w-8xl mx-auto space-y-1">
        {displayedTestimonies.map((testimony: Testimony) => {
          const hasImage = testimony.images && testimony.images.length > 0;

          return (
            <Link
              key={testimony.id}
              href={`/testimonies/${generateTestimonySlug(
                testimony.id,
                testimony.eventTitle
              )}`}
              className="group block"
            >
              <article className="border-b border-gray-50 hover:border-black transition-all duration-300 py-8 hover:bg-gray-50 px-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {hasImage ? (
                    <div className="md:w-48 md:h-48 w-full h-64 shrink-0 overflow-hidden relative">
                      <Image
                        src={testimony.images[0].imageUrl}
                        alt={
                          testimony.images[0].description ||
                          testimony.eventTitle
                        }
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 192px"
                      />
                    </div>
                  ) : (
                    <div className="hidden md:flex md:w-48 md:h-48 shrink-0 bg-black items-center justify-center">
                      <div className="text-white opacity-40">
                        {getSubmissionIcon(testimony.submissionType!)}
                      </div>
                    </div>
                  )}

                  {/* Right: Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    {/* Top Section */}
                    <div>
                      {/* Meta Row */}
                      <div className="flex items-center gap-4 mb-3 text-xs uppercase tracking-widest font-bold text-gray-500">
                        <span className="flex items-center gap-2">
                          {getSubmissionIcon(testimony.submissionType!)}
                          {testimony.submissionType}
                        </span>
                        {testimony.relationToEvent && (
                          <>
                            <span>•</span>
                            <span>{testimony.relationToEvent}</span>
                          </>
                        )}
                        {(testimony.dateOfEventFrom ||
                          testimony.dateOfEventTo) && (
                          <>
                            <span>•</span>
                            <span>
                              {testimony.dateOfEventFrom &&
                              testimony.dateOfEventTo
                                ? `${formatDate(
                                    testimony.dateOfEventFrom
                                  )} - ${formatDate(testimony.dateOfEventTo)}`
                                : testimony.dateOfEventFrom
                                ? formatDate(testimony.dateOfEventFrom)
                                : formatDate(testimony.dateOfEventTo!)}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-3xl md:text-4xl font-black text-black mb-4 leading-tight group-hover:underline decoration-4 underline-offset-8">
                        {testimony.eventTitle}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-lg text-gray-700 leading-relaxed line-clamp-2 mb-6">
                        {testimony.fullTestimony.replace(/<[^>]*>/g, "")}
                      </p>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                      {/* Left: Author & Location */}
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-semibold">
                            {testimony.identityPreference === "anonymous"
                              ? "Anonymous"
                              : testimony.fullName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{testimony.location}</span>
                        </div>
                      </div>

                      {/* Views & CTA */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span className="font-bold">
                            {formatImpressions(testimony.impressions)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-black font-bold text-sm uppercase tracking-wider group-hover:gap-4 transition-all duration-300">
                          <span>Read Full Testimony</span>
                          <ArrowRight className="w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>

      {/* Load More */}
      {limit && testimonies && testimonies.length > limit && (
        <div className="max-w-6xl mx-auto mt-16 text-center">
          <Link
            href="/testimonies"
            className="inline-flex items-center gap-4 px-12 py-5 bg-black text-white font-bold uppercase tracking-wider text-sm hover:bg-gray-900 transition-all duration-300 border-4 border-black hover:border-gray-900"
          >
            <span>View All Testimonies</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      )}
    </div>
  );
}
