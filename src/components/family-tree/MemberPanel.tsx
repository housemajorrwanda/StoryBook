"use client";

import { useEffect, useState } from "react";
import {
  X,
  ExternalLink,
  Calendar,
  User,
  FileText,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
} from "lucide-react";
import { FamilyMember, FamilyRelation, RelationType } from "@/types/family-tree";
import Link from "next/link";

const RELATION_LABEL: Record<RelationType, string> = {
  parent:  "Parent of",
  child:   "Child of",
  spouse:  "Spouse of",
  sibling: "Sibling of",
};

const GENDER_CONFIG: Record<string, { strip: string; badge: string; text: string }> = {
  male:    { strip: "from-gray-700 to-gray-900", badge: "bg-gray-100 text-gray-700 border-gray-200", text: "text-gray-600" },
  female:  { strip: "from-gray-700 to-gray-900", badge: "bg-gray-100 text-gray-700 border-gray-200", text: "text-gray-600" },
  other:   { strip: "from-gray-700 to-gray-900", badge: "bg-gray-100 text-gray-700 border-gray-200", text: "text-gray-600" },
  unknown: { strip: "from-gray-600 to-gray-800", badge: "bg-gray-100 text-gray-600 border-gray-200", text: "text-gray-500" },
};

interface MemberPanelProps {
  member: FamilyMember;
  allMembers: FamilyMember[];
  relations: FamilyRelation[];
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MemberPanel({
  member,
  allMembers,
  relations,
  onClose,
  onEdit,
  onDelete,
}: MemberPanelProps) {
  const [photoIdx, setPhotoIdx] = useState(0);

  // Reset photo index when member changes
  useEffect(() => { setPhotoIdx(0); }, [member.id]);

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const memberMap = new Map(allMembers.map((m) => [m.id, m]));
  const myRelations = relations.filter(
    (r) => r.fromMemberId === member.id || r.toMemberId === member.id
  );

  const cfg = GENDER_CONFIG[member.gender ?? "unknown"] ?? GENDER_CONFIG.unknown;

  // Build photo list: photoUrls array first, fallback to single photoUrl
  const photos: string[] = member.photoUrls?.length
    ? member.photoUrls
    : member.photoUrl
    ? [member.photoUrl]
    : [];

  const initials = member.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const locationParts = [member.district, member.sector, member.cell, member.village].filter(Boolean);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px]" onClick={onClose} />

      {/* Panel — bottom sheet on mobile, right sidebar on sm+ */}
      <div className="fixed inset-x-0 bottom-0 z-40 sm:inset-x-auto sm:right-0 sm:top-0 sm:bottom-0 sm:w-[340px] md:w-[380px] bg-white shadow-2xl flex flex-col overflow-hidden rounded-t-2xl sm:rounded-none max-h-[88vh] sm:max-h-none">

        {/* ── Cover / photo hero ──────────────────────────────────────────── */}
        <div className="relative shrink-0">
          {photos.length > 0 ? (
            <div className="relative h-40 sm:h-48 md:h-52 overflow-hidden bg-gray-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photos[photoIdx]}
                alt={member.name}
                className="w-full h-full object-cover opacity-90"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

              {/* Photo navigation */}
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() => setPhotoIdx((i) => (i - 1 + photos.length) % photos.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() => setPhotoIdx((i) => (i + 1) % photos.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {/* Dots */}
                  <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1">
                    {photos.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Photo ${i + 1}`}
                        onClick={() => setPhotoIdx(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === photoIdx ? "bg-white scale-125" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Name overlay on photo */}
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                <h2 className="font-bold text-white text-lg leading-tight drop-shadow">{member.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  {member.gender && (
                    <span className="text-xs text-white/80 capitalize">{member.gender}</span>
                  )}
                  {member.isAlive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/80 text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/80" /> Living
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-black/40 text-white/80">
                      Deceased
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* No photo — gradient strip header */
            <div className={`h-24 bg-gradient-to-br ${cfg.strip} relative`}>
              <div className="absolute inset-0 bg-black/5" />
            </div>
          )}

          {/* Close button — always top-right */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            title="Close"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── No-photo header (shown when no photo) ───────────────────────── */}
        {photos.length === 0 && (
          <div className="flex items-start gap-3 px-5 -mt-7 mb-1 relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 border-4 border-white shadow-md ${cfg.badge}`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0 pt-8">
              <h2 className="font-bold text-gray-900 text-base leading-tight truncate">{member.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                {member.gender && <span className={`text-xs capitalize font-medium ${cfg.text}`}>{member.gender}</span>}
                {member.isAlive ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Living
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-500 border border-gray-200">
                    Deceased
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Dates row */}
          {(member.birthDate || !member.isAlive) && (
            <div className="flex flex-wrap gap-3">
              {member.birthDate && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>b. {member.birthDate}</span>
                </div>
              )}
              {!member.isAlive && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Calendar className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                  <span>{member.deathDate ? `d. ${member.deathDate}` : "Deceased"}</span>
                </div>
              )}
            </div>
          )}

          {/* Location */}
          {locationParts.length > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">Location</p>
                <p className="text-sm text-gray-800 break-words">{locationParts.join(", ")}</p>
              </div>
            </div>
          )}

          {/* Bio */}
          {member.bio && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Biography</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{member.bio}</p>
            </div>
          )}

          {/* Photo thumbnails strip (when has multiple photos) */}
          {photos.length > 1 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Photos ({photos.length})</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {photos.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    aria-label={`View photo ${i + 1}`}
                    onClick={() => setPhotoIdx(i)}
                    className={`shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === photoIdx ? "border-gray-900 scale-105" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Family relations */}
          {myRelations.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Family Relations</p>
              <div className="space-y-1.5">
                {myRelations.map((rel) => {
                  const otherId = rel.fromMemberId === member.id ? rel.toMemberId : rel.fromMemberId;
                  const other = memberMap.get(otherId);
                  const label = RELATION_LABEL[rel.relationType as RelationType];
                  const otherInitials = (other?.name ?? "?").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

                  return (
                    <div key={rel.id}
                      className="flex items-center gap-2.5 text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                      <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center shrink-0 text-xs font-bold bg-gray-100 text-gray-600">
                        {(other?.photoUrls?.[0] ?? other?.photoUrl) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={(other.photoUrls?.[0] ?? other.photoUrl)!} alt={other.name} className="w-7 h-7 object-cover" />
                        ) : otherInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold truncate block">{other?.name ?? "Unknown"}</span>
                        <span className="text-xs text-gray-400">{label}</span>
                      </div>
                      {other?.isAlive === false && (
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full shrink-0">RIP</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Linked testimony */}
          {member.testimony && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Linked Testimony</p>
              <Link
                href={`/testimonies/${member.testimony.id}`}
                target="_blank"
                className="flex items-start gap-2.5 p-3.5 rounded-xl border border-cyan-100 bg-cyan-50 hover:bg-cyan-100 transition-colors group"
              >
                <FileText className="w-4 h-4 text-cyan-600 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-cyan-900 truncate">{member.testimony.eventTitle}</p>
                  {member.testimony.fullName && (
                    <p className="text-xs text-cyan-600 mt-0.5">{member.testimony.fullName}</p>
                  )}
                  <p className="text-xs text-cyan-500 mt-1 font-medium group-hover:underline">View testimony →</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0 group-hover:text-cyan-600 transition-colors" />
              </Link>
            </div>
          )}

          {/* Empty state nudge */}
          {!member.bio && !member.birthDate && locationParts.length === 0 && myRelations.length === 0 && !member.testimony && (
            <div className="text-center py-6 text-gray-400">
              <User className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No details added yet</p>
              {onEdit && <p className="text-xs mt-1">Tap Edit to fill in more info</p>}
            </div>
          )}
        </div>

        {/* ── Footer actions ───────────────────────────────────────────────── */}
        {(onEdit || onDelete) && (
          <div className="px-5 py-4 border-t border-gray-100 flex gap-2 shrink-0">
            {onEdit && (
              <button type="button" onClick={onEdit}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                <Edit2 className="w-4 h-4" /> Edit Member
              </button>
            )}
            {onDelete && (
              <button type="button" onClick={onDelete} title="Remove member" aria-label="Remove member"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
