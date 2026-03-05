"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  LuSearch,
  LuX,
  LuCheck,
  LuTrash2,
  LuFileText,
  LuMic,
  LuVideo,
  LuMapPin,
  LuChevronDown,
  LuLoader,
  LuArrowLeft,
  LuClock,
  LuUser,
  LuSplit,
  LuEye,
} from "react-icons/lu";
import {
  useAdminTestimonies,
  useUpdateTestimonyStatus,
  useDeleteTestimony,
} from "@/hooks/useTestimonies";
import { Testimony } from "@/types/testimonies";

// ─── Backend contract note ─────────────────────────────────────────────────────
// When a user edits an already-approved testimony, the backend should set:
//   testimony.status = "pending"
//   testimony.pendingUpdate = {
//     eventTitle: string
//     eventDescription?: string
//     fullTestimony?: string
//     location?: string
//     submittedAt: string  (ISO date)
//   }
// The root testimony fields remain the current LIVE (approved) version.
// On approval: backend replaces root fields with pendingUpdate fields, clears pendingUpdate.
// On rejection: backend clears pendingUpdate, status reverts to "approved".
// For BRAND NEW submissions (never approved), pendingUpdate is null — review as-is.

interface PendingUpdate {
  eventTitle?: string;
  eventDescription?: string;
  fullTestimony?: string;
  location?: string;
  submittedAt: string;
}

interface TestimonyWithPending extends Testimony {
  pendingUpdate?: PendingUpdate | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Diff highlight ───────────────────────────────────────────────────────────
// Simple word-level "changed" indicator — highlights if values differ

function DiffField({
  label,
  before,
  after,
  multiline = false,
}: {
  label: string;
  before?: string | null;
  after?: string | null;
  multiline?: boolean;
}) {
  const changed = before !== after && after != null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Current (live) */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-300">
          Current
        </p>
        <div
          className={`rounded-xl border p-3 text-sm text-gray-700 ${multiline ? "min-h-20 leading-relaxed" : ""} border-gray-100 bg-gray-50`}
        >
          {before || <span className="text-gray-300 italic">Empty</span>}
        </div>
      </div>

      {/* Proposed (pending) */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-300">
          Proposed
        </p>
        <div
          className={`rounded-xl border p-3 text-sm ${multiline ? "min-h-20 leading-relaxed" : ""} ${
            changed
              ? "border-amber-200 bg-amber-50 text-amber-900"
              : "border-gray-100 bg-gray-50 text-gray-700"
          }`}
        >
          {after || <span className="text-gray-300 italic">Empty</span>}
          {changed && (
            <span className="ml-2 inline-flex items-center text-[10px] font-bold text-amber-600 uppercase tracking-wide">
              · changed
            </span>
          )}
        </div>
      </div>

      <div className="col-span-2">
        <p className="text-[11px] text-gray-400 font-medium">{label}</p>
      </div>
    </div>
  );
}

// ─── Confirm Delete Dialog ────────────────────────────────────────────────────

function ConfirmDeleteDialog({
  testimony,
  onConfirm,
  onCancel,
  isPending,
}: {
  testimony: Testimony;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [typed, setTyped] = useState("");
  const CONFIRM_WORD = "DELETE";
  const confirmed = typed === CONFIRM_WORD;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <LuTrash2 className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Delete testimony
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              This action is permanent and cannot be undone.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {testimony.eventTitle}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            by {testimony.fullName || "Anonymous"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">
            Type{" "}
            <span className="font-bold text-gray-900 font-mono">
              {CONFIRM_WORD}
            </span>{" "}
            to confirm deletion
          </label>
          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value.toUpperCase())}
            placeholder={CONFIRM_WORD}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!confirmed || isPending}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <LuLoader className="w-4 h-4 animate-spin" />
            ) : (
              <LuTrash2 className="w-4 h-4" />
            )}
            {isPending ? "Deleting…" : "Delete permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Review Panel (slide-in) ──────────────────────────────────────────────────

function ReviewPanel({
  testimony,
  onClose,
  onApprove,
  onReject,
  onDelete,
  isActionPending,
}: {
  testimony: TestimonyWithPending;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  isActionPending: boolean;
}) {
  const isPending = testimony.status === "pending";
  const hasUpdate = !!testimony.pendingUpdate;
  const isEdit = isPending && hasUpdate;
  const isNew = isPending && !hasUpdate;

  // Decide view mode: "diff" (edit review) or "read" (new submission)
  const [mode, setMode] = useState<"diff" | "read">(isEdit ? "diff" : "read");

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <LuArrowLeft className="w-4 h-4" />
            Back to list
          </button>

          <div className="flex items-center gap-2">
            {isEdit && (
              <>
                <button
                  type="button"
                  onClick={() => setMode("diff")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    mode === "diff"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  <LuSplit className="w-3.5 h-3.5" /> Compare
                </button>
                <button
                  type="button"
                  onClick={() => setMode("read")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    mode === "read"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  <LuEye className="w-3.5 h-3.5" /> Preview
                </button>
              </>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Testimony meta */}
          <div className="flex items-start gap-4">
            {testimony.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={testimony.images[0].imageUrl}
                alt={testimony.eventTitle}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <LuFileText className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-gray-900 leading-tight">
                  {isEdit && mode === "diff"
                    ? testimony.pendingUpdate?.eventTitle ||
                      testimony.eventTitle
                    : testimony.eventTitle}
                </h2>
                <StatusChip status={testimony.status} />
                {isEdit && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    Edit Request
                  </span>
                )}
                {isNew && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                    New Submission
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <LuUser className="w-3 h-3" />
                  {testimony.fullName || "Anonymous"}
                </span>
                {testimony.location && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <LuMapPin className="w-3 h-3" />
                    {testimony.location}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <LuClock className="w-3 h-3" />
                  Submitted {formatDate(testimony.createdAt)}
                </span>
                {isEdit && testimony.pendingUpdate?.submittedAt && (
                  <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                    <LuClock className="w-3 h-3" />
                    Edit requested{" "}
                    {formatDateTime(testimony.pendingUpdate.submittedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* ── Diff / Compare view ── */}
          {isEdit && mode === "diff" && testimony.pendingUpdate ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                <LuSplit className="w-3.5 h-3.5" />
                Comparing changes — approve to publish the proposed version
              </div>

              <DiffField
                label="Event Title"
                before={testimony.eventTitle}
                after={testimony.pendingUpdate.eventTitle}
              />

              {(testimony.eventDescription != null ||
                testimony.pendingUpdate.eventDescription != null) && (
                <DiffField
                  label="Event Description"
                  before={testimony.eventDescription}
                  after={testimony.pendingUpdate.eventDescription}
                  multiline
                />
              )}

              {(testimony.location != null ||
                testimony.pendingUpdate.location != null) && (
                <DiffField
                  label="Location"
                  before={testimony.location}
                  after={testimony.pendingUpdate.location}
                />
              )}

              {(testimony.fullTestimony != null ||
                testimony.pendingUpdate.fullTestimony != null) && (
                <DiffField
                  label="Full Testimony"
                  before={testimony.fullTestimony}
                  after={testimony.pendingUpdate.fullTestimony}
                  multiline
                />
              )}
            </div>
          ) : (
            /* ── Read / Preview view ── */
            <div className="space-y-5">
              {testimony.eventDescription && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-300 mb-1.5">
                    Event Description
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {testimony.eventDescription}
                  </p>
                </div>
              )}

              {testimony.fullTestimony && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-300 mb-1.5">
                    Testimony
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {testimony.fullTestimony}
                  </p>
                </div>
              )}

              {testimony.submissionType === "audio" && testimony.audioUrl && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-300 mb-1.5">
                    Audio
                  </p>
                  <audio
                    controls
                    src={testimony.audioUrl}
                    className="w-full rounded-xl"
                  />
                </div>
              )}

              {testimony.submissionType === "video" && testimony.videoUrl && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-300 mb-1.5">
                    Video
                  </p>
                  <video
                    controls
                    src={testimony.videoUrl}
                    className="w-full rounded-xl"
                  />
                </div>
              )}

              {testimony.images.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-300 mb-2">
                    Images
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {testimony.images.map((img, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={img.imageUrl}
                        alt={img.description || `Image ${i + 1}`}
                        className="w-full aspect-square object-cover rounded-xl"
                      />
                    ))}
                  </div>
                </div>
              )}

              {testimony.adminFeedback && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-500 mb-1">
                    Previous Admin Feedback
                  </p>
                  <p className="text-sm text-amber-800">
                    {testimony.adminFeedback}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action footer */}
        {isPending && (
          <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex items-center gap-3 bg-white">
            <button
              type="button"
              onClick={onDelete}
              disabled={isActionPending}
              className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors disabled:opacity-50 shrink-0"
              title="Delete"
            >
              <LuTrash2 className="w-4 h-4" />
            </button>

            <div className="flex-1 flex gap-3">
              <button
                type="button"
                onClick={onReject}
                disabled={isActionPending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isActionPending ? (
                  <LuLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <LuX className="w-4 h-4" />
                )}
                Reject
              </button>
              <button
                type="button"
                onClick={onApprove}
                disabled={isActionPending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {isActionPending ? (
                  <LuLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <LuCheck className="w-4 h-4" />
                )}
                {isEdit ? "Approve & Publish Edit" : "Approve"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-green-50 text-green-700",
    pending: "bg-amber-50 text-amber-700",
    rejected: "bg-red-50 text-red-600",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${map[status] ?? "bg-gray-100 text-gray-500"}`}
    >
      {status}
    </span>
  );
}

function TestimonyRow({
  testimony,
  onClick,
}: {
  testimony: TestimonyWithPending;
  onClick: () => void;
}) {
  const isEdit = testimony.status === "pending" && !!testimony.pendingUpdate;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-4 py-4 text-left border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-xl px-3 -mx-3 transition-colors group"
    >
      {/* Thumbnail */}
      {testimony.images[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={testimony.images[0].imageUrl}
          alt={testimony.eventTitle}
          className="w-10 h-10 rounded-xl object-cover shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
          {testimony.submissionType === "audio" ? (
            <LuMic className="w-3.5 h-3.5 text-amber-500" />
          ) : testimony.submissionType === "video" ? (
            <LuVideo className="w-3.5 h-3.5 text-blue-500" />
          ) : (
            <LuFileText className="w-3.5 h-3.5 text-gray-400" />
          )}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-gray-900">
            {testimony.eventTitle}
          </p>
          <StatusChip status={testimony.status} />
          {isEdit && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
              Edit
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          <span className="text-xs text-gray-400 truncate">
            {testimony.fullName || "Anonymous"}
          </span>
          {testimony.location && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <LuMapPin className="w-3 h-3 shrink-0" />
              {testimony.location}
            </span>
          )}
          <span className="text-xs text-gray-300">
            {formatDate(testimony.createdAt)}
          </span>
        </div>
      </div>

      <div className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const TYPE_OPTIONS = [
  { value: "", label: "All types" },
  { value: "written", label: "Written" },
  { value: "audio", label: "Audio" },
  { value: "video", label: "Video" },
];

export default function ContentModerationsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("pending");
  const [submissionType, setSubmissionType] = useState("");
  const [selected, setSelected] = useState<TestimonyWithPending | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimony | null>(null);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useAdminTestimonies({
      search: search || undefined,
      status: status || undefined,
      submissionType: submissionType || undefined,
      limit: 20,
    });

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateTestimonyStatus();
  const { mutate: deleteTestimony, isPending: isDeleting } =
    useDeleteTestimony();

  const allItems = (data?.pages.flatMap((p) => p.data) ??
    []) as TestimonyWithPending[];

  // Infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    deleteTestimony(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        setSelected(null);
      },
    });
  }, [deleteTarget, deleteTestimony]);

  const handleApprove = useCallback(
    (t: Testimony) => {
      updateStatus(
        { id: t.id, status: "approved" },
        { onSuccess: () => setSelected(null) },
      );
    },
    [updateStatus],
  );

  const handleReject = useCallback(
    (t: Testimony) => {
      updateStatus(
        { id: t.id, status: "rejected" },
        { onSuccess: () => setSelected(null) },
      );
    },
    [updateStatus],
  );

  const total = data?.pages[0]?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Content Moderation</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Review new submissions and edit requests. Click a row to open the
          review panel.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author…"
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition bg-white"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <LuX className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="appearance-none pl-3.5 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <LuChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={submissionType}
            onChange={(e) => setSubmissionType(e.target.value)}
            className="appearance-none pl-3.5 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition"
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <LuChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Result count */}
      {!isLoading && (
        <p className="text-xs text-gray-400">
          {total.toLocaleString()} {total === 1 ? "testimony" : "testimonies"}{" "}
          found
        </p>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 px-6 py-4">
        {isLoading ? (
          <div className="flex flex-col animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
                <div className="flex-1">
                  <div className="w-48 h-3.5 bg-gray-100 rounded mb-2" />
                  <div className="w-32 h-3 bg-gray-100 rounded" />
                </div>
                <div className="w-4 h-4 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : allItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <LuFileText className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              No testimonies found
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {status === "pending"
                ? "No pending submissions right now. Check back later."
                : "Try adjusting your filters or search query."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {allItems.map((item) => (
              <TestimonyRow
                key={item.id}
                testimony={item}
                onClick={() => setSelected(item)}
              />
            ))}
          </div>
        )}

        <div ref={loadMoreRef} className="h-1" />
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <LuLoader className="w-5 h-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Review Panel */}
      {selected && (
        <ReviewPanel
          testimony={selected}
          onClose={() => setSelected(null)}
          onApprove={() => handleApprove(selected)}
          onReject={() => handleReject(selected)}
          onDelete={() => setDeleteTarget(selected)}
          isActionPending={isUpdating}
        />
      )}

      {/* Confirm Delete Dialog */}
      {deleteTarget && (
        <ConfirmDeleteDialog
          testimony={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}
