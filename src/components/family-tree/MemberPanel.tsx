"use client";

import { useEffect } from "react";
import { X, ExternalLink, Calendar, User, FileText } from "lucide-react";
import { FamilyMember, FamilyRelation, RelationType } from "@/types/family-tree";
import Link from "next/link";

const RELATION_LABEL: Record<RelationType, string> = {
  parent: "Parent of",
  child: "Child of",
  spouse: "Spouse of",
  sibling: "Sibling of",
};

interface MemberPanelProps {
  member: FamilyMember;
  allMembers: FamilyMember[];
  relations: FamilyRelation[];
  onClose: () => void;
  /** Edit actions — omit for read-only */
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
  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const memberMap = new Map(allMembers.map((m) => [m.id, m]));

  // Find all relations for this member
  const myRelations = relations.filter(
    (r) => r.fromMemberId === member.id || r.toMemberId === member.id
  );

  const initials = member.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const avatarBg =
    member.gender === "male"
      ? "bg-blue-100 text-blue-600"
      : member.gender === "female"
      ? "bg-pink-100 text-pink-600"
      : "bg-gray-100 text-gray-500";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-40 w-full sm:w-[360px] bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0 ${avatarBg}`}>
            {member.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.photoUrl}
                alt={member.name}
                className="w-12 h-12 rounded-2xl object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 text-base leading-tight truncate">
              {member.name}
            </h2>
            {member.gender && (
              <p className="text-xs text-gray-400 capitalize mt-0.5">{member.gender}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Dates */}
          <div className="flex gap-3">
            {member.birthDate && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>Born {member.birthDate}</span>
              </div>
            )}
            {!member.isAlive && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                {member.deathDate ? `Died ${member.deathDate}` : "Deceased"}
              </div>
            )}
          </div>

          {/* Status badge */}
          <div>
            {member.isAlive ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Living
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                Deceased
              </span>
            )}
          </div>

          {/* Bio */}
          {member.bio && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Biography
              </p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {member.bio}
              </p>
            </div>
          )}

          {/* Relations */}
          {myRelations.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Family Relations
              </p>
              <div className="space-y-1.5">
                {myRelations.map((rel) => {
                  const otherId =
                    rel.fromMemberId === member.id
                      ? rel.toMemberId
                      : rel.fromMemberId;
                  const other = memberMap.get(otherId);
                  const label =
                    rel.fromMemberId === member.id
                      ? RELATION_LABEL[rel.relationType as RelationType]
                      : RELATION_LABEL[rel.relationType as RelationType];

                  return (
                    <div
                      key={rel.id}
                      className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-gray-400 text-xs">{label}</span>
                      <span className="font-medium truncate">{other?.name ?? "Unknown"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Linked testimony */}
          {member.testimony && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Linked Testimony
              </p>
              <Link
                href={`/testimonies/${member.testimony.id}`}
                target="_blank"
                className="flex items-start gap-2.5 p-3 rounded-xl border border-cyan-100 bg-cyan-50 hover:bg-cyan-100 transition-colors group"
              >
                <FileText className="w-4 h-4 text-cyan-600 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-cyan-900 truncate">
                    {member.testimony.eventTitle}
                  </p>
                  {member.testimony.fullName && (
                    <p className="text-xs text-cyan-600 mt-0.5">{member.testimony.fullName}</p>
                  )}
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0 group-hover:text-cyan-600 transition-colors" />
              </Link>
            </div>
          )}
        </div>

        {/* Footer actions (edit mode only) */}
        {(onEdit || onDelete) && (
          <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Edit Member
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
