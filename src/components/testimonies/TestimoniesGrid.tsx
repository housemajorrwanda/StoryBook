"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LuCalendar,
  LuUser,
  LuMapPin,
  LuMic,
  LuVideo,
  LuArrowRight,
  LuQuote,
  LuSparkles,
  LuEye,
  LuFileText,
} from "react-icons/lu";
import { useTestimonies } from "@/hooks/useTestimonies";
import { Testimony } from "@/types/testimonies";
import {
  formatImpressions,
  generateTestimonySlug,
} from "@/utils/testimony.utils";

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
        <div className="inline-block p-12 bg-red-50 rounded-4xl border border-red-100 shadow-2xl">
          <p className="text-2xl font-black text-red-900 mb-3">
            Unable to Load Testimonies
          </p>
          <p className="text-base text-red-600 mb-6">
            Please refresh the page or try again later
          </p>
          <button className="px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all duration-300 hover:scale-105 shadow-lg">
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
      <div className="text-center py-24">
        <div className="inline-block p-16 bg-gray-50 rounded-[2.5rem] border border-gray-200 shadow-2xl">
          <div className="w-24 h-24 mx-auto mb-8 bg-gray-900 rounded-4xl flex items-center justify-center animate-pulse">
            <LuQuote className="w-12 h-12 text-white" />
          </div>
          <p className="text-3xl font-black text-gray-900 mb-4">
            No Testimonies Yet
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            Be the first to share your story and inspire others with your
            journey
          </p>
          <button className="px-10 py-5 bg-gray-900 text-white font-bold text-lg rounded-2xl hover:bg-black transition-all duration-300 hover:scale-105 shadow-2xl shadow-gray-900/30">
            Share Your Story
          </button>
        </div>
      </div>
    );
  }

  const getSubmissionIcon = (type: string) => {
    switch (type) {
      case "audio":
        return <LuMic className="w-5 h-5" />;
      case "video":
        return <LuVideo className="w-5 h-5" />;
      default:
        return <LuFileText className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gray-900 rounded-full blur-[150px] opacity-5 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-900 rounded-full blur-[150px] opacity-5 pointer-events-none" />

      {showHeader && (
        <div className="text-center mb-20 md:mb-24 relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gray-900 text-white text-sm font-black rounded-full tracking-widest shadow-xl shadow-gray-900/20">
            <LuSparkles className="w-4 h-4" />
            TESTIMONIES
            <LuSparkles className="w-4 h-4" />
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-8 tracking-tighter leading-none">
            Stories That
            <br />
            <span className="italic">Matter</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Voices of resilience, courage, and remembrance from survivors and
            witnesses who lived through history
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {displayedTestimonies.map((testimony: Testimony, index: number) => {
          return (
            <Link
              key={testimony.id}
              href={`/testimonies/${generateTestimonySlug(
                testimony.id,
                testimony.eventTitle
              )}`}
              className="group block animate-fade-in"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              <article className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-900 transition-all duration-700 h-full flex flex-col group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] group-hover:-translate-y-2 relative">
                {/* Animated Border Effect */}
                <div className="absolute inset-0 rounded-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 rounded-4xl animate-pulse bg-gray-900/5" />
                </div>

                {/* Image Container */}
                <div className="relative h-72 bg-gray-900 overflow-hidden">
                  {testimony.images && testimony.images.length > 0 ? (
                    <>
                      <Image
                        src={testimony.images[0].imageUrl}
                        alt={
                          testimony.images[0].description ||
                          testimony.eventTitle
                        }
                        fill
                        className="object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-1000 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Dark Overlay on hover */}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-900">
                      <div className="text-white opacity-30 scale-[2]">
                        {getSubmissionIcon(testimony.submissionType!)}
                      </div>
                    </div>
                  )}

                  {/* Media Type Badge */}
                  <div className="absolute top-5 right-5 flex items-center gap-2">
                    <div className="flex items-center gap-2 p-2 bg-white/95 text-gray-700 text-xs font-black rounded-full group-hover:scale-110 transition-transform duration-500">
                      {getSubmissionIcon(testimony.submissionType!)}
                    </div>
                    <span className="uppercase tracking-widest text-xs text-black font-semibold">
                      {testimony.submissionType}
                    </span>
                  </div>

                  {/* Quote Icon Overlay */}
                  <div className="absolute bottom-5 left-5 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <LuQuote className="w-16 h-16 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 flex-1 flex flex-col relative">
                  <h3 className="text-xl font-black text-gray-900 mb-4 leading-tight group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                    {testimony.eventTitle}
                  </h3>

                  <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-3 font-light">
                    {testimony.fullTestimony.replace(/<[^>]*>/g, "")}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <LuUser className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-gray-900 truncate">
                          {testimony.identityPreference === "anonymous"
                            ? "Anonymous"
                            : testimony.fullName}
                        </span>
                        <span className="text-xs text-gray-500 capitalize truncate">
                          {testimony.relationToEvent}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center shrink-0">
                        <LuMapPin className="w-5 h-5 text-gray-900" />
                      </div>
                      <span className="font-semibold text-gray-700 truncate">
                        {testimony.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center shrink-0">
                        <LuCalendar className="w-5 h-5 text-gray-900" />
                      </div>
                      <span className="font-semibold text-gray-700 truncate">
                        {formatDate(testimony.dateOfEvent)}
                      </span>
                    </div>
                  </div>

                  {/* Engagement Bar */}
                  <div className="mt-6 border-gray-100">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full`} />
                        <span className="font-semibold text-gray-500 uppercase tracking-wider">
                          Engagement
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <LuEye className="w-3 h-3 text-gray-400" />
                        <span className="font-black text-gray-900">
                          {formatImpressions(testimony.impressions)}
                        </span>
                        <span className="text-gray-400">views</span>
                      </div>
                    </div>
                  </div>

                  {/* Read More CTA */}
                  <div className="mt-4 border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-gray-900 tracking-widest uppercase">
                        Read Story
                      </span>
                      <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-gray-900/20">
                        <LuArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>

      {/* Show More Link */}
      {limit && testimonies && testimonies.length > limit && (
        <div className="text-center mt-20 relative z-10">
          <Link
            href="/testimonies"
            className="inline-flex items-center gap-4 px-12 py-6 bg-gray-900 hover:bg-black text-white font-black text-lg rounded-4xl transition-all duration-500 hover:scale-110 shadow-2xl shadow-gray-900/30 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] group"
          >
            <span className="tracking-wide">View All Testimonies</span>
            <LuArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
