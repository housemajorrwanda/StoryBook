"use client";

import {
  LuEye,
  LuPencil,
  LuTrash2,
  LuArchive,
  LuPlus,
  LuSearch,
  LuChevronLeft,
  LuChevronRight,
  LuBookOpen,
  LuVideo,
  LuZap,
  LuClock,
  LuPlay,
  LuEllipsis,
  LuTrendingUp,
  LuGraduationCap,
} from "react-icons/lu";
import Link from "next/link";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  useEducationContent,
  useDeleteEducation,
} from "@/hooks/education/use-education-content";
import { EducationContent } from "@/types/education";

const ITEMS_PER_PAGE = 25;
type StatusFilterType = "all" | "published" | "draft" | "archived";
type TypeFilterType = string | "all";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_META: Record<
  string,
  { icon: React.ReactNode; label: string; color: string }
> = {
  article: {
    icon: <LuBookOpen className="w-3.5 h-3.5" />,
    label: "Article",
    color: "bg-gray-100 text-gray-600",
  },
  video: {
    icon: <LuVideo className="w-3.5 h-3.5" />,
    label: "Video",
    color: "bg-blue-50 text-blue-600",
  },
  interactive: {
    icon: <LuZap className="w-3.5 h-3.5" />,
    label: "Interactive",
    color: "bg-purple-50 text-purple-600",
  },
  timeline: {
    icon: <LuClock className="w-3.5 h-3.5" />,
    label: "Timeline",
    color: "bg-amber-50 text-amber-600",
  },
  audio: {
    icon: <LuPlay className="w-3.5 h-3.5" />,
    label: "Audio",
    color: "bg-green-50 text-green-600",
  },
};

const STATUS_META: Record<
  string,
  { label: string; dot: string; text: string; bg: string }
> = {
  published: {
    label: "Published",
    dot: "bg-green-500",
    text: "text-green-700",
    bg: "bg-green-50",
  },
  draft: {
    label: "Draft",
    dot: "bg-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50",
  },
  archived: {
    label: "Archived",
    dot: "bg-gray-400",
    text: "text-gray-600",
    bg: "bg-gray-100",
  },
  pending: {
    label: "Pending",
    dot: "bg-blue-400",
    text: "text-blue-700",
    bg: "bg-blue-50",
  },
};

function getStatus(content: EducationContent) {
  if (content.status === "archived") return STATUS_META.archived;
  if (content.status === "published" && content.isPublished)
    return STATUS_META.published;
  if (content.status === "draft") return STATUS_META.draft;
  return STATUS_META.pending;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Row action menu ──────────────────────────────────────────────────────────

function ActionMenu({
  content,
  onDelete,
  onClose,
}: {
  content: EducationContent;
  onDelete: (id: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg shadow-black/5 z-50 py-1 overflow-hidden"
    >
      <Link
        href={`/education/${content.id}`}
        onClick={onClose}
        className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
      >
        <LuEye className="w-3.5 h-3.5" /> View
      </Link>
      <Link
        href={`/dashboard/education/edit/${content.id}`}
        onClick={onClose}
        className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
      >
        <LuPencil className="w-3.5 h-3.5" /> Edit
      </Link>
      {content.status === "draft" && (
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LuTrendingUp className="w-3.5 h-3.5" /> Publish
        </button>
      )}
      {content.status === "published" && (
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LuArchive className="w-3.5 h-3.5" /> Unpublish
        </button>
      )}
      {content.status !== "archived" && (
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LuArchive className="w-3.5 h-3.5" /> Archive
        </button>
      )}
      <div className="my-1 border-t border-gray-100" />
      <button
        type="button"
        onClick={() => {
          onDelete(content.id);
          onClose();
        }}
        className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
      >
        <LuTrash2 className="w-3.5 h-3.5" /> Delete
      </button>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="divide-y divide-gray-50 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="w-9 h-9 rounded-xl bg-gray-100 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-3.5 w-48 bg-gray-100 rounded mb-1.5" />
            <div className="h-3 w-32 bg-gray-100 rounded" />
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-16 h-5 rounded-full bg-gray-100" />
            <div className="w-14 h-5 rounded-full bg-gray-100" />
            <div className="w-10 h-4 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EducationDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilterType>("all");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const skip = (page - 1) * ITEMS_PER_PAGE;

  const {
    data: resp,
    isLoading,
    error,
  } = useEducationContent({
    search: search || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    type: typeFilter === "all" ? undefined : typeFilter,
    limit: ITEMS_PER_PAGE,
    skip,
  });

  const { mutate: deleteContent } = useDeleteEducation();

  const items = useMemo(() => resp?.data ?? [], [resp?.data]);
  const total = useMemo(() => resp?.meta?.total ?? 0, [resp?.meta?.total]);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleDelete = (id: number) => {
    if (confirm("Delete this content? This cannot be undone."))
      deleteContent(id);
  };

  const resetPage = () => setPage(1);

  const STATUS_FILTERS: { value: StatusFilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
  ];

  const TYPE_FILTERS: { value: TypeFilterType; label: string }[] = [
    { value: "all", label: "All types" },
    { value: "article", label: "Article" },
    { value: "video", label: "Video" },
    { value: "interactive", label: "Interactive" },
    { value: "timeline", label: "Timeline" },
    { value: "audio", label: "Audio" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center shrink-0">
            <LuGraduationCap className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">
              Education
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {total > 0
                ? `${total.toLocaleString()} pieces of content`
                : "Manage educational content"}
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/education/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          <LuPlus className="w-4 h-4" />
          New Content
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 px-5 py-4 border-b border-gray-100">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search content…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>

          {/* Status filters */}
          <div className="flex items-center gap-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => {
                  setStatusFilter(f.value);
                  resetPage();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === f.value
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-1 sm:ml-auto flex-wrap">
            {TYPE_FILTERS.map((f) => {
              const meta = f.value !== "all" ? TYPE_META[f.value] : null;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => {
                    setTypeFilter(f.value);
                    resetPage();
                  }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    typeFilter === f.value
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {meta?.icon}
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400 mb-3">Failed to load content</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-xs font-semibold text-gray-900 underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            {search || statusFilter !== "all" || typeFilter !== "all" ? (
              <>
                <LuSearch className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">
                  No content matches your filters
                </p>
              </>
            ) : (
              <>
                <LuGraduationCap className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400 mb-4">
                  No educational content yet
                </p>
                <Link
                  href="/dashboard/education/create"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 transition-colors"
                >
                  <LuPlus className="w-3.5 h-3.5" />
                  Create first content
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Mobile card list — shown below sm */}
            <div className="sm:hidden divide-y divide-gray-50">
              {items.map((content) => {
                const status = getStatus(content);
                const typeMeta = TYPE_META[content.type] ?? TYPE_META.article;
                const progress = content._count?.userProgress ?? 0;
                return (
                  <div
                    key={content.id}
                    className="px-4 py-4 flex items-start gap-3"
                  >
                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${typeMeta.color}`}
                    >
                      {typeMeta.icon}
                    </div>
                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {content.title}
                      </p>
                      {content.description && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {content.description.replace(/<[^>]*>/g, "")}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${status.bg} ${status.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                          />
                          {status.label}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {(content.views ?? 0).toLocaleString()} views
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {progress} completed
                        </span>
                        {content.category && (
                          <span className="text-[10px] text-gray-400 capitalize">
                            {content.category}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-300 mt-1">
                        {formatDate(content.createdAt)}
                      </p>
                    </div>
                    {/* Menu */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === content.id ? null : content.id,
                          )
                        }
                        className="p-1.5 rounded-lg text-gray-300 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <LuEllipsis className="w-4 h-4" />
                      </button>
                      {openMenu === content.id && (
                        <ActionMenu
                          content={content}
                          onDelete={handleDelete}
                          onClose={() => setOpenMenu(null)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table — hidden below sm */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {[
                      "Content",
                      "Type",
                      "Status",
                      "Views",
                      "Progress",
                      "Category",
                      "Created",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap last:w-10"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((content) => {
                    const status = getStatus(content);
                    const typeMeta =
                      TYPE_META[content.type] ?? TYPE_META.article;
                    const progress = content._count?.userProgress ?? 0;

                    return (
                      <tr
                        key={content.id}
                        className="group hover:bg-gray-50/60 transition-colors"
                      >
                        {/* Content */}
                        <td className="px-5 py-3.5 max-w-60">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {content.title}
                          </p>
                          {content.description && (
                            <p
                              className="text-xs text-gray-400 truncate mt-0.5"
                              dangerouslySetInnerHTML={{
                                __html: content.description.replace(
                                  /<[^>]*>/g,
                                  "",
                                ),
                              }}
                            />
                          )}
                        </td>

                        {/* Type */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${typeMeta.color}`}
                          >
                            {typeMeta.icon}
                            {typeMeta.label}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${status.bg} ${status.text}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`}
                            />
                            {status.label}
                          </span>
                        </td>

                        {/* Views */}
                        <td className="px-5 py-3.5 text-sm font-semibold text-gray-900 whitespace-nowrap">
                          {(content.views ?? 0).toLocaleString()}
                        </td>

                        {/* Progress */}
                        <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                          {progress} completed
                        </td>

                        {/* Category */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="text-xs text-gray-500 capitalize">
                            {content.category || "—"}
                          </span>
                        </td>

                        {/* Created */}
                        <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                          {formatDate(content.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 relative">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenu(
                                openMenu === content.id ? null : content.id,
                              )
                            }
                            className="p-1.5 rounded-lg text-gray-300 hover:text-gray-700 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <LuEllipsis className="w-4 h-4" />
                          </button>
                          {openMenu === content.id && (
                            <ActionMenu
                              content={content}
                              onDelete={handleDelete}
                              onClose={() => setOpenMenu(null)}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && items.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              {(skip + 1).toLocaleString()}–
              {(skip + items.length).toLocaleString()} of{" "}
              {total.toLocaleString()}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <LuChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-xs font-semibold text-gray-600">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <LuChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
