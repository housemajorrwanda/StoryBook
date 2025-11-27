"use client";

import {
  useMemo,
  useState,
  useEffect,
  type ReactNode,
  type ChangeEvent,
} from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  LuSearch,
  LuFilter,
  LuRefreshCw,
  LuCalendar,
  LuCircle,
  LuVideo,
  LuMic,
  LuFileText,
  LuExternalLink,
  LuChevronUp,
  LuChevronDown,
} from "react-icons/lu";
import { testimoniesService } from "@/services/testimonies.service";
import { Testimony, StoryType, TestimonyStatus } from "@/types/testimonies";
import { TESTIMONY_KEYS } from "@/hooks/useTestimonies";
import {
  formatImpressions,
  generateTestimonySlug,
  formatDateRange,
} from "@/utils/testimony.utils";
import { cn } from "@/lib/utils";
import Pagination from "@/components/shared/Pagination";

type GetTestimoniesFilters = Parameters<
  (typeof testimoniesService)["getTestimonies"]
>[0];
type TestimoniesResponse = Awaited<
  ReturnType<(typeof testimoniesService)["getTestimonies"]>
>;
type SubmissionTypeFilter = "all" | Exclude<StoryType, null>;
type PublishFilter = "all" | "published" | "unpublished";

const statusFilters: Array<{
  label: string;
  value: "all" | TestimonyStatus;
}> = [
  { label: "All statuses", value: "all" },
  { label: "Pending review", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const submissionTypeFilters: Array<{
  label: string;
  value: SubmissionTypeFilter;
  icon: ReactNode;
}> = [
  {
    label: "All formats",
    value: "all",
    icon: <LuFilter className="h-4 w-4" />,
  },
  {
    label: "Written",
    value: "written",
    icon: <LuFileText className="h-4 w-4" />,
  },
  {
    label: "Audio",
    value: "audio",
    icon: <LuMic className="h-4 w-4" />,
  },
  {
    label: "Video",
    value: "video",
    icon: <LuVideo className="h-4 w-4" />,
  },
];

const publishFilters: Array<{ label: string; value: PublishFilter }> = [
  { label: "All records", value: "all" },
  { label: "Published", value: "published" },
  { label: "Unpublished", value: "unpublished" },
];

export default function AllTestimoniesView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof statusFilters)[number]["value"]>(
    "all"
  );
  const [submissionType, setSubmissionType] =
    useState<SubmissionTypeFilter>("all");
  const [publishState, setPublishState] = useState<PublishFilter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(0);
  const limit = 10;
  const [filtersOpen, setFiltersOpen] = useState(true);

  const debouncedSearch = useDebouncedValue(search, 350);

  const queryParams = useMemo<GetTestimoniesFilters>(() => {
    return {
      search: debouncedSearch || undefined,
      submissionType:
        submissionType !== "all" ? submissionType : undefined,
      status: status !== "all" ? status : undefined,
      isPublished:
        publishState === "all" ? undefined : publishState === "published",
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      skip: page * limit,
      limit,
    };
  }, [
    debouncedSearch,
    submissionType,
    status,
    publishState,
    dateFrom,
    dateTo,
    page,
    limit,
  ]);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<TestimoniesResponse, Error>({
    queryKey: [...TESTIMONY_KEYS.lists(), queryParams],
    queryFn: () => testimoniesService.getTestimonies(queryParams),
  });

  const testimonies: Testimony[] = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleDateFromChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDateFrom(event.target.value);
    setPage(0);
  };

  const handleDateToChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDateTo(event.target.value);
    setPage(0);
  };

  const handlePublishChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPublishState(event.target.value as PublishFilter);
    setPage(0);
  };

  const handleSubmissionTypeChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSubmissionType(event.target.value as SubmissionTypeFilter);
    setPage(0);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              All Testimonies
            </h1>
            <p className="text-sm text-gray-500">
              Monitor every submission with granular filters and instant search.
            </p>
          </div>
          <div className="flex flex-wrap items-center">
            <button
              onClick={() => setFiltersOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              <LuFilter className="h-4 w-4" />
              {filtersOpen ? "Hide filters" : "Show filters"}
              {filtersOpen ? (
                <LuChevronUp className="h-4 w-4" />
              ) : (
                <LuChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {filtersOpen && (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="relative flex items-center">
                <LuSearch className="absolute left-4 h-4 w-4 text-gray-400 hover:text-gray-900 cursor-pointer" />
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search by title, name, email or ID"
                  className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-11 py-3 text-sm text-gray-900 shadow-inner focus:border-gray-900 focus:bg-white focus:outline-none"
                />
              </label>

              <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <LuCalendar className="h-4 w-4 text-gray-500 hover:text-gray-900 cursor-pointer" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={handleDateFromChange}
                  className="flex-1 bg-transparent outline-none cursor-pointer"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={handleDateToChange}
                  className="flex-1 bg-transparent outline-none cursor-pointer"
                />
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <LuFilter className="h-4 w-4 text-gray-500" />
                <select
                  value={publishState}
                  onChange={handlePublishChange}
                  className="flex-1 bg-transparent outline-none cursor-pointer"
                >
                  {publishFilters.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {submissionTypeFilters.find((o) => o.value === submissionType)
                  ?.icon ?? <LuFilter className="h-4 w-4 text-gray-500" />}
                <select
                  value={submissionType}
                  onChange={handleSubmissionTypeChange}
                  className="flex-1 bg-transparent outline-none cursor-pointer"
                >
                  {submissionTypeFilters.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setStatus(filter.value);
                    setPage(0);
                  }}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm transition",
                    status === filter.value
                      ? "border-gray-900 bg-gray-900 text-white shadow-sm cursor-pointer"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="rounded-lg border border-gray-100 bg-white shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
          <div>
            <p className="text-base font-semibold text-gray-900">
              {total.toLocaleString()} testimonies found
            </p>
            <p className="text-sm text-gray-500">
              {isFetching ? "Refreshing…" : "Data is up to date"}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
          >
            <LuRefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            Refresh
          </button>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Testimony
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Submission type
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Published
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Created
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Event date
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Impressions
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <LoadingRows />
              ) : testimonies.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No testimonies match the current filters.
                  </td>
                </tr>
              ) : (
                testimonies.map((testimony) => (
                  <TestimonyRow key={testimony.id} testimony={testimony} />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex justify-end">
          <Pagination
            total={total}
            limit={limit}
            skip={page * limit}
            onPageChange={(nextPage) => setPage(nextPage - 1)}
            showResultsInfo={false}
            className="px-0! py-0! sm:flex-row! justify-end!"
          />
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {(error as Error).message || "Unable to load testimonies."}
        </div>
      )}
    </div>
  );
}

function TestimonyRow({ testimony }: { testimony: Testimony }) {
  const slug = generateTestimonySlug(testimony.id, testimony.eventTitle);

  return (
    <tr className="hover:bg-gray-50/50">
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{testimony.eventTitle}</div>
        <p className="text-xs text-gray-500">
          {testimony.fullName} • {testimony.identityPreference ?? "identity N/A"}
        </p>
        <p className="text-xs text-gray-400">
          {formatEventDateRange(
            testimony.dateOfEventFrom,
            testimony.dateOfEventTo
          )}
          {testimony.location ? ` • ${testimony.location}` : ""}
        </p>
      </td>
      <td className="px-6 py-4">
        <TypeBadge type={testimony.submissionType} />
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={testimony.status} />
      </td>
      <td className="px-6 py-4">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium",
            testimony.isPublished
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          )}
        >
          <LuCircle
            className={cn(
              "h-2 w-2",
              testimony.isPublished ? "text-emerald-500" : "text-gray-400"
            )}
          />
          {testimony.isPublished ? "Published" : "Hidden"}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {formatDate(testimony.createdAt)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {formatEventDateRange(
          testimony.dateOfEventFrom,
          testimony.dateOfEventTo
        )}
      </td>
      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
        {formatImpressions(testimony.impressions || 0)} reads
      </td>
      <td className="px-6 py-4 text-right">
        <Link
          href={`/testimonies/${slug}`}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
        >
          View
          <LuExternalLink className="h-4 w-4" />
        </Link>
      </td>
    </tr>
  );
}

function TypeBadge({ type }: { type: StoryType }) {
  const iconMap: Record<Exclude<StoryType, null>, ReactNode> = {
    written: <LuFileText className="h-4 w-4" />,
    audio: <LuMic className="h-4 w-4" />,
    video: <LuVideo className="h-4 w-4" />,
  };

  if (!type) {
    return (
      <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
        <LuFilter className="h-4 w-4" />
        Unknown
      </span>
    );
  }

  const label = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      {iconMap[type]}
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: TestimonyStatus }) {
  const statusStyles: Record<TestimonyStatus, string> = {
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-rose-50 text-rose-700",
  };

  const dotColor: Record<TestimonyStatus, string> = {
    pending: "text-amber-400",
    approved: "text-emerald-500",
    rejected: "text-rose-500",
  };

  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-semibold",
        statusStyles[status]
      )}
    >
      <LuCircle className={cn("h-2 w-2", dotColor[status])} />
      {label}
    </span>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, idx) => (
        <tr key={idx} className="animate-pulse">
          {Array.from({ length: 8 }).map((__, cellIdx) => (
            <td key={cellIdx} className="px-6 py-4">
              <div className="h-4 rounded-full bg-gray-100" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatEventDateRange(
  from?: string,
  to?: string
): string {
  if (!from && !to) return "Event date not set";
  return formatDateRange(from, to);
}

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

