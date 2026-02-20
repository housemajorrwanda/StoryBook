"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Loader2,
  MapPin,
  Pencil,
  AlertCircle,
  Search,
} from "lucide-react";
import { useTestimony } from "@/hooks/useTestimonies";
import { getCurrentUser, isAuthenticated } from "@/lib/decodeToken";
import AudioPlayer from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";
import TestimonyConnections from "./TestimonyConnections";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="text-sm text-gray-500">Loading story...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to load story
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            This testimony might not exist or is temporarily unavailable.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to stories
          </Link>
        </div>
      </div>
    );
  }

  if (!testimony) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Story not found
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            The testimony you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to stories
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

  const authorName =
    testimony.identityPreference === "anonymous"
      ? "Anonymous"
      : testimony.fullName;

  const coverImage = testimony.images?.[0]?.imageUrl;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        {/* Back navigation */}
        <div className="pt-6 pb-8 md:pt-8 md:pb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All stories
          </Link>
        </div>

        <article>
          {/* Header */}
          <header className="mb-8 md:mb-10">
            {/* Meta line */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-5">
              <span className="capitalize">{testimony.submissionType}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{formatDate(testimony.createdAt)}</span>
              {testimony.location && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {testimony.location}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-gray-900 leading-tight mb-5">
              {testimony.eventTitle}
            </h1>

            {/* Description */}
            {testimony.eventDescription && (
              <p className="text-lg text-gray-500 leading-relaxed mb-6">
                {testimony.eventDescription}
              </p>
            )}

            {/* Author + Edit */}
            <div className="flex items-center justify-between pb-8 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
                  {authorName[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {authorName}
                  </p>
                  {testimony.relationToEvent && (
                    <p className="text-xs text-gray-400 capitalize">
                      {testimony.relationToEvent}
                    </p>
                  )}
                </div>
              </div>
              {canEdit && (
                <Link
                  href={`/share-testimony?edit=${testimony.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-md hover:text-gray-700 hover:border-gray-300 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </Link>
              )}
            </div>
          </header>

          {/* === VIDEO TESTIMONY === */}
          {testimony.submissionType === "video" && testimony.videoUrl && (
            <>
              <div className="mb-10 md:mb-12">
                <VideoPlayer
                  src={testimony.videoUrl}
                  duration={testimony.videoDuration}
                  testimonyId={testimony.id}
                />
              </div>

              {/* Event date */}
              {(testimony.dateOfEventFrom || testimony.dateOfEventTo) && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {testimony.dateOfEventFrom && testimony.dateOfEventTo
                      ? `${formatDate(testimony.dateOfEventFrom)} — ${formatDate(testimony.dateOfEventTo)}`
                      : testimony.dateOfEventFrom
                        ? formatDate(testimony.dateOfEventFrom)
                        : formatDate(testimony.dateOfEventTo!)}
                  </span>
                </div>
              )}

              {/* Transcript / written content if available */}
              {testimony.fullTestimony && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                    Transcript
                  </p>
                  <div
                    className="prose prose-base max-w-none text-gray-600 leading-[1.8] prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900"
                    dangerouslySetInnerHTML={{ __html: testimony.fullTestimony }}
                  />
                </div>
              )}
            </>
          )}

          {/* === AUDIO TESTIMONY === */}
          {testimony.submissionType === "audio" && testimony.audioUrl && (
            <>
              {/* Cover image if available */}
              {coverImage && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
                  <Image
                    src={coverImage}
                    alt={testimony.eventTitle}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 720px, 100vw"
                    priority
                  />
                </div>
              )}

              <div className="mb-10 md:mb-12">
                <AudioPlayer
                  src={testimony.audioUrl}
                  duration={testimony.audioDuration}
                  testimonyId={testimony.id}
                />
              </div>

              {/* Event date */}
              {(testimony.dateOfEventFrom || testimony.dateOfEventTo) && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {testimony.dateOfEventFrom && testimony.dateOfEventTo
                      ? `${formatDate(testimony.dateOfEventFrom)} — ${formatDate(testimony.dateOfEventTo)}`
                      : testimony.dateOfEventFrom
                        ? formatDate(testimony.dateOfEventFrom)
                        : formatDate(testimony.dateOfEventTo!)}
                  </span>
                </div>
              )}

              {/* Transcript / written content if available */}
              {testimony.fullTestimony && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                    Transcript
                  </p>
                  <div
                    className="prose prose-base max-w-none text-gray-600 leading-[1.8] prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900"
                    dangerouslySetInnerHTML={{ __html: testimony.fullTestimony }}
                  />
                </div>
              )}

              {/* Additional images */}
              {testimony.images && testimony.images.length > 1 && (
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {testimony.images.slice(1).map((image, index) => (
                      <div key={image.id || index} className="group rounded-xl overflow-hidden">
                        <div className="relative aspect-4/3 overflow-hidden rounded-xl">
                          <Image
                            src={image.imageUrl}
                            alt={image.description || `Image ${index + 2}`}
                            fill
                            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        </div>
                        {image.description && (
                          <p className="text-xs text-gray-400 mt-2 px-1">{image.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* === WRITTEN TESTIMONY === */}
          {(testimony.submissionType === "written" ||
            (!testimony.audioUrl && !testimony.videoUrl)) && (
            <>
              {/* Cover image */}
              {coverImage && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 md:mb-12">
                  <Image
                    src={coverImage}
                    alt={testimony.eventTitle}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 720px, 100vw"
                    priority
                  />
                </div>
              )}

              {/* Event date */}
              {(testimony.dateOfEventFrom || testimony.dateOfEventTo) && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {testimony.dateOfEventFrom && testimony.dateOfEventTo
                      ? `${formatDate(testimony.dateOfEventFrom)} — ${formatDate(testimony.dateOfEventTo)}`
                      : testimony.dateOfEventFrom
                        ? formatDate(testimony.dateOfEventFrom)
                        : formatDate(testimony.dateOfEventTo!)}
                  </span>
                </div>
              )}

              {/* Full testimony text */}
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-[1.8] prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-strong:text-gray-900 prose-blockquote:border-gray-900 prose-blockquote:text-gray-600 prose-a:text-gray-900"
                dangerouslySetInnerHTML={{ __html: testimony.fullTestimony }}
              />

              {/* Additional images */}
              {testimony.images && testimony.images.length > 1 && (
                <div className="mt-12 pt-10 border-t border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {testimony.images.slice(1).map((image, index) => (
                      <div key={image.id || index} className="group rounded-xl overflow-hidden">
                        <div className="relative aspect-4/3 overflow-hidden rounded-xl">
                          <Image
                            src={image.imageUrl}
                            alt={image.description || `Image ${index + 2}`}
                            fill
                            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        </div>
                        {image.description && (
                          <p className="text-xs text-gray-400 mt-2 px-1">{image.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Author footer */}
          {testimony.identityPreference === "public" && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-bold">
                  {testimony.fullName[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimony.fullName}
                  </p>
                  <p className="text-sm text-gray-400 capitalize">
                    {testimony.relationToEvent || "Witness"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </article>

        {/* Connections - only show for written testimonies */}
        {testimony.connections &&
          testimony.connections.length > 0 &&
          (testimony.submissionType === "written" ||
            (!testimony.audioUrl && !testimony.videoUrl)) && (
            <div className="mt-14 pt-10 border-t border-gray-100">
              <TestimonyConnections
                connections={testimony.connections}
                currentTestimonyId={testimony.id}
              />
            </div>
          )}

        {/* Back to stories */}
        <div className="py-14 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all stories
          </Link>
        </div>
      </div>
    </div>
  );
}
