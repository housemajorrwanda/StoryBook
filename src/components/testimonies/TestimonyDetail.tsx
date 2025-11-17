"use client";

import Image from "next/image";
import Link from "next/link";
import {
  LuCalendar,
  LuUser,
  LuMapPin,
  LuArrowLeft,
  LuMic,
  LuVideo,
  LuClock,
  LuLoaderCircle,
} from "react-icons/lu";
import { useTestimony } from "@/hooks/useTestimonies";
import { formatDuration } from "@/utils/testimony.utils";

interface TestimonyDetailProps {
  id: number;
}

export default function TestimonyDetail({ id }: TestimonyDetailProps) {
  const { data: testimony, isLoading, error } = useTestimony(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <LuLoaderCircle className="w-8 h-8 animate-spin" />
          <span className="text-lg">Loading testimony...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-6">
            <p className="text-xl font-semibold mb-2">
              Failed to load testimony
            </p>
            <p className="text-gray-600">
              The testimony you&apos;re looking for might not exist or be
              unavailable.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors duration-200"
          >
            <LuArrowLeft className="w-4 h-4" />
            Back to Testimonies
          </Link>
        </div>
      </div>
    );
  }

  if (!testimony) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900 mb-2">
            Testimony not found
          </p>
          <p className="text-gray-600 mb-6">
            The testimony you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors duration-200"
          >
            <LuArrowLeft className="w-4 h-4" />
            Back to Testimonies
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
  

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <article className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Hero Section */}
          <div className="p-6 sm:p-8 md:p-12 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span className="px-3 py-1 bg-gray-100 rounded-full capitalize">
                {testimony.submissionType} Testimony
              </span>
              <span>•</span>
              <span>{formatDate(testimony.createdAt)}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {testimony.eventTitle}
            </h1>

            {testimony.eventDescription && (
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {testimony.eventDescription}
              </p>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <LuUser className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Shared by</p>
                  <p className="font-semibold text-gray-900">
                    {testimony.identityPreference === "anonymous"
                      ? "Anonymous"
                      : testimony.fullName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <LuMapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900">
                    {testimony.location}
                  </p>
                </div>
              </div>

              {(testimony.dateOfEventFrom || testimony.dateOfEventTo) && (
                <div className="flex items-center gap-3">
                  <LuCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Event</p>
                    <p className="font-semibold text-gray-900">
                      {testimony.dateOfEventFrom && testimony.dateOfEventTo
                        ? `${formatDate(
                            testimony.dateOfEventFrom
                          )} - ${formatDate(testimony.dateOfEventTo)}`
                        : testimony.dateOfEventFrom
                        ? formatDate(testimony.dateOfEventFrom)
                        : formatDate(testimony.dateOfEventTo!)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Media Section */}
          {(testimony.audioUrl ||
            testimony.videoUrl ||
            (testimony.images && testimony.images.length > 0)) && (
            <div className="p-6 sm:p-8 md:p-12 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Media</h2>

              {/* Audio Player */}
              {testimony.audioUrl && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <LuMic className="w-5 h-5 text-gray-400" />
                    <span className="font-semibold text-gray-900">
                      Audio Testimony
                    </span>
                    {testimony.audioDuration && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <LuClock className="w-4 h-4" />
                        {formatDuration(testimony.audioDuration)}
                      </div>
                    )}
                  </div>
                  <audio controls className="w-full" preload="metadata">
                    <source src={testimony.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Video Player */}
              {testimony.videoUrl && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <LuVideo className="w-5 h-5 text-gray-400" />
                    <span className="font-semibold text-gray-900">
                      Video Testimony
                    </span>
                    {testimony.videoDuration && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <LuClock className="w-4 h-4" />
                        {formatDuration(testimony.videoDuration)}
                      </div>
                    )}
                  </div>
                  <video
                    controls
                    className="w-full rounded-xl"
                    preload="metadata"
                  >
                    <source src={testimony.videoUrl} type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                </div>
              )}

              {/* Images */}
              {testimony.images && testimony.images.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Images ({testimony.images.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {testimony.images.map((image, index) => (
                      <div key={image.id || index} className="group">
                        <div className="relative aspect-video rounded-xl overflow-hidden">
                          <Image
                            src={image.imageUrl}
                            alt={image.description || `Image ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        </div>
                        {image.description && (
                          <p className="text-sm text-gray-600 mt-2 px-2">
                            {image.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Testimony Content */}
          <div className="p-6 sm:p-8 md:p-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Full Testimony
            </h2>
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: testimony.fullTestimony }}
            />

            {/* Author Info */}
            {testimony.identityPreference === "public" && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <LuUser className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimony.fullName}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {testimony.relationToEvent || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-colors duration-200"
          >
            <LuArrowLeft className="w-4 h-4" />
            View More Testimonies
          </Link>
        </div>
      </div>
    </div>
  );
}
