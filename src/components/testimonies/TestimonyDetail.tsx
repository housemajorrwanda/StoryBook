"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LuCalendar,
  LuUser,
  LuMapPin,
  LuArrowLeft,
  LuLoaderCircle,
  LuPencilLine,
} from "react-icons/lu";
import { useTestimony } from "@/hooks/useTestimonies";
import { getCurrentUser, isAuthenticated } from "@/lib/decodeToken";
import AudioPlayer from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";

interface TestimonyDetailProps {
  id: number;
}

type AuthState = {
  initialized: boolean;
  loggedIn: boolean;
  userId: string | null;
};

export default function TestimonyDetail({ id }: TestimonyDetailProps) {
  const { data: testimony, isLoading, error } = useTestimony(id);
  const [authState, setAuthState] = useState<AuthState>({
    initialized: false,
    loggedIn: false,
    userId: null,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const frame = requestAnimationFrame(() => {
      const authenticated = isAuthenticated();
      const currentUser = getCurrentUser();
      const derivedId =
        (currentUser?.id && String(currentUser.id)) ??
        (currentUser?.sub ? String(currentUser.sub) : null);

      setAuthState({
        initialized: true,
        loggedIn: authenticated,
        userId: derivedId,
      });
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LuLoaderCircle className="w-12 h-12 animate-spin text-gray-600" />
          <span className="text-lg font-medium text-gray-700">
            Loading testimony...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to Load Testimony
          </h2>
          <p className="text-gray-600 mb-8">
            The testimony you&apos;re looking for might not exist or be unavailable.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
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
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Testimony Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The testimony you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
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

  const ownerId =
    (testimony.user?.id && String(testimony.user.id)) ??
    (testimony.userId ? String(testimony.userId) : null);
  const canEdit = Boolean(
    authState.loggedIn &&
      ownerId &&
      authState.userId &&
      ownerId === authState.userId
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-5xl">
        <article className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Hero Section */}
          <div className="p-6 sm:p-8 md:p-12 bg-linear-to-br from-gray-50 via-gray-100 to-gray-50 border-b border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <span className="px-4 py-1.5 bg-gray-900 text-white rounded-full capitalize font-medium shadow-sm">
                  {testimony.submissionType} Testimony
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {formatDate(testimony.createdAt)}
                </span>
              </div>
              {canEdit && (
                <Link
                  href={`/share-testimony?edit=${testimony.id}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:border-gray-300 hover:bg-white transition-colors"
                >
                  <LuPencilLine className="w-4 h-4" />
                  Edit my testimony
                </Link>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {testimony.eventTitle}
            </h1>

            {testimony.eventDescription && (
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                {testimony.eventDescription}
              </p>
            )}

            {/* Metadata Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <LuUser className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Shared by
                    </p>
                    <p className="font-semibold text-gray-900 truncate">
                      {testimony.identityPreference === "anonymous"
                        ? "Anonymous"
                        : testimony.fullName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <LuMapPin className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Location
                    </p>
                    <p className="font-semibold text-gray-900 truncate">
                      {testimony.location}
                    </p>
                  </div>
                </div>
              </div>

              {(testimony.dateOfEventFrom || testimony.dateOfEventTo) && (
                <div className="p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors sm:col-span-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <LuCalendar className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        Date of Event
                      </p>
                      <p className="font-semibold text-gray-900 text-xs">
                        {testimony.dateOfEventFrom && testimony.dateOfEventTo
                          ? `${formatDate(testimony.dateOfEventFrom)} - ${formatDate(
                              testimony.dateOfEventTo
                            )}`
                          : testimony.dateOfEventFrom
                          ? formatDate(testimony.dateOfEventFrom)
                          : formatDate(testimony.dateOfEventTo!)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Media Section */}
          {(testimony.audioUrl ||
            testimony.videoUrl ||
            (testimony.images && testimony.images.length > 0)) && (
            <div className="p-6 sm:p-8 md:p-12 bg-gray-50">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-1 w-12 bg-gray-900 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Media</h2>
              </div>

              {/* Audio Player */}
              {testimony.audioUrl && (
                <div className="mb-8">
                  <AudioPlayer
                    src={testimony.audioUrl}
                    duration={testimony.audioDuration}
                  />
                </div>
              )}

              {/* Video Player */}
              {testimony.videoUrl && (
                <div className="mb-8">
                  <VideoPlayer
                    src={testimony.videoUrl}
                    duration={testimony.videoDuration}
                  />
                </div>
              )}

              {/* Images Gallery */}
              {testimony.images && testimony.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <span>Photo Gallery</span>
                    <span className="text-sm font-normal text-gray-500">
                      ({testimony.images.length} {testimony.images.length === 1 ? "photo" : "photos"})
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {testimony.images.map((image, index) => (
                      <div
                        key={image.id || index}
                        className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200"
                      >
                        <div className="relative aspect-4/3 overflow-hidden">
                          <Image
                            src={image.imageUrl}
                            alt={image.description || `Image ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-linear-to-br from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        {image.description && (
                          <div className="p-4 bg-white">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {image.description}
                            </p>
                          </div>
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
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-gray-900 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                {testimony.submissionType === "written" 
                  ? "Full Testimony" 
                  : "Full Transcript"}
              </h2>
            </div>
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: testimony.fullTestimony }}
            />

            {/* Author Info */}
            {testimony.identityPreference === "public" && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
                  <div className="w-14 h-14 bg-linear-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-inner">
                    <LuUser className="w-7 h-7 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {testimony.fullName}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {testimony.relationToEvent || "Witness"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
          >
            <LuArrowLeft className="w-5 h-5" />
            View More Testimonies
          </Link>
        </div>
      </div>
    </div>
  );
}
