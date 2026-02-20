"use client";

import Image from "next/image";
import Link from "next/link";
import {
  LuMapPin,
  LuUser,
  LuMail,
  LuCalendar,
  LuArrowRight,
  LuLink2,
} from "react-icons/lu";
import type { MyTestimonyConnection } from "@/types/testimonies";
import { generateTestimonySlug, formatDateRange } from "@/utils/testimony.utils";
import AccuracyRing from "./AccuracyRing";

function stripHtml(html: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

function getConnectionBadge(type: string) {
  const t = type.toLowerCase();
  if (t.includes("strong") || t.includes("hybrid"))
    return { label: "Strong Match", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (t.includes("moderate") || t.includes("content"))
    return { label: "Content Match", classes: "bg-blue-50 text-blue-700 border-blue-200" };
  if (t.includes("same_month") || t.includes("temporal") || t.includes("location"))
    return { label: "Time/Place Match", classes: "bg-amber-50 text-amber-700 border-amber-200" };
  if (t.includes("same_relation"))
    return { label: "Shared Relation", classes: "bg-violet-50 text-violet-700 border-violet-200" };
  return { label: "Related", classes: "bg-gray-50 text-gray-700 border-gray-200" };
}

interface ConnectionCardProps {
  connection: MyTestimonyConnection;
}

export default function ConnectionCard({ connection }: ConnectionCardProps) {
  const { connectedTestimony: ct, connectionDetails, contactInfo } = connection;
  const coverImage = ct.images?.[0]?.imageUrl;
  const summaryText = stripHtml(ct.summary);
  const badge = getConnectionBadge(connectionDetails.connectionType);
  const slug = generateTestimonySlug(ct.id, ct.eventTitle);

  return (
    <Link href={`/testimonies/${slug}`} className="block group">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white">
        {/* Cover image */}
        {coverImage && (
          <div className="relative w-full sm:w-28 h-36 sm:h-28 rounded-xl overflow-hidden shrink-0">
            <Image
              src={coverImage}
              alt={ct.eventTitle}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, 112px"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badge.classes}`}
            >
              <LuLink2 className="w-3 h-3" />
              {badge.label}
            </span>
            {ct.submissionType && (
              <span className="text-xs text-gray-400 capitalize">
                {ct.submissionType}
              </span>
            )}
            {/* Mobile-only score */}
            <span className="sm:hidden text-xs font-bold text-gray-500">
              {connectionDetails.accuracyScore}% match
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1.5 line-clamp-2 group-hover:text-gray-600 transition-colors">
            {ct.eventTitle}
          </h3>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-2">
            {ct.location && (
              <span className="inline-flex items-center gap-1">
                <LuMapPin className="w-3 h-3" />
                {ct.location}
              </span>
            )}
            {(ct.dateOfEventFrom || ct.dateOfEventTo) && (
              <span className="inline-flex items-center gap-1">
                <LuCalendar className="w-3 h-3" />
                {formatDateRange(ct.dateOfEventFrom, ct.dateOfEventTo)}
              </span>
            )}
          </div>

          {/* Summary snippet */}
          {summaryText && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {summaryText}
            </p>
          )}

          {/* Connection reason */}
          {connectionDetails.connectionReason && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
              <span>{connectionDetails.connectionReason}</span>
            </div>
          )}

          {/* Contact info */}
          {contactInfo && (
            <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-gray-100">
              {contactInfo.fullName && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <LuUser className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-medium">{contactInfo.fullName}</span>
                </div>
              )}
              {contactInfo.email && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <LuMail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate max-w-[180px]">
                    {contactInfo.email}
                  </span>
                </div>
              )}
              {contactInfo.residentPlace && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <LuMapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{contactInfo.residentPlace}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Accuracy ring + arrow (desktop) */}
        <div className="hidden sm:flex flex-col items-center justify-between shrink-0">
          <AccuracyRing score={connectionDetails.accuracyScore} />
          <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors mt-2">
            <LuArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}
