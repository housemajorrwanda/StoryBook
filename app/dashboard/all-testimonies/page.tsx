"use client";

import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Headphones,
  Video,
  User,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useTestimonies } from "@/hooks/useTestimonies";
import { Testimony } from "@/types/testimonies";

const ITEMS_PER_PAGE = 25;
type StatusFilterType = "all" | "approved" | "pending" | "rejected";
type TypeFilterType = "all" | "written" | "audio" | "video";

export default function AllTestimonials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const {
    data: testimoniesResponse,
    isLoading,
    error,
    refetch,
  } = useTestimonies({
    search: searchTerm || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    submissionType: typeFilter === "all" ? undefined : typeFilter,
    limit: ITEMS_PER_PAGE,
  });

const testimonies = useMemo(() => {
  if (!testimoniesResponse?.pages) return [];
  return testimoniesResponse.pages.flatMap((page) => page.data);
}, [testimoniesResponse]);

const totalTestimonies = useMemo(
  () => testimoniesResponse?.pages?.[0]?.meta?.total || 0,
  [testimoniesResponse]
);

  const totalPages = useMemo(
    () => Math.ceil(totalTestimonies / ITEMS_PER_PAGE),
    [totalTestimonies]
  );




  const getStatusInfo = (testimony: Testimony) => {
    switch (testimony.status) {
      case "approved":
        return {
          status: "approved",
          label: "Approved",
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
      case "rejected":
        return {
          status: "rejected",
          label: "Rejected",
          color: "bg-red-100 text-red-800 border-red-200",
        };
      default:
        return {
          status: "pending",
          label: "Pending",
          color: "bg-amber-100 text-amber-800 border-amber-200",
        };
    }
  };

  const getTypeInfo = (testimony: Testimony) => {
    switch (testimony.submissionType) {
      case "audio":
        return {
          label: "Audio",
          icon: Headphones,
          color: "text-indigo-600",
        };
      case "video":
        return {
          label: "Video",
          icon: Video,
          color: "text-rose-600",
        };
      default:
        return {
          label: "Written",
          icon: FileText,
          color: "text-emerald-600",
        };
    }
  };

  const getAuthorName = (testimony: Testimony) => {
    return testimony.identityPreference === "anonymous"
      ? "Anonymous"
      : testimony.user?.name || testimony.fullName || "Unknown";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatReads = (value?: number) => {
    if (!value || value <= 0) return "0 reads";
    if (value < 1000) return `${value} reads`;
    const abbreviated = (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1);
    return `${abbreviated}k reads`;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (status: StatusFilterType) => {
    setCurrentPage(1);
    setStatusFilter(status);
  };

  const handleTypeFilterChange = (type: TypeFilterType) => {
    setCurrentPage(1);
    setTypeFilter(type);
  };

  const handleSearchChange = (term: string) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-6 py-12">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
          </div>


          {/* Table Skeleton */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
            </div>
            <div className="p-8 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Failed to load testimonies</div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Testimonies Management
          </h1>
          <p className="text-gray-600">
            Manage submitted testimonies, review content, and track engagement
          </p>
        </div>


        {/* Testimonies Management */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          {/* Header with Search and Actions */}
          <div className="border-b border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
            <div className="flex-1 w-full">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, author, or content..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/share-testimony"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Testimony
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="border-b border-gray-200 p-4 flex gap-2 flex-wrap bg-gray-50">
            <div className="flex gap-2">
              <span className="text-sm text-gray-600 font-medium py-2">Status:</span>
              {(["all", "approved", "pending", "rejected"] as const).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterChange(status)}
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-colors capitalize ${
                      statusFilter === status
                        ? "bg-gray-900 text-white font-semibold"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
            <div className="flex gap-2 ml-4">
              <span className="text-sm text-gray-600 font-medium py-2">Type:</span>
              {(["all", "written", "audio", "video"] as const).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeFilterChange(type)}
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-colors capitalize ${
                      typeFilter === type
                        ? "bg-gray-900 text-white font-semibold"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Testimony
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Author
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Location
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Event Date
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Impressions
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Submitted
                  </th>
                
                </tr>
              </thead>
              <tbody>
                {testimonies.map((testimony) => {
                  const statusInfo = getStatusInfo(testimony);
                  const typeInfo = getTypeInfo(testimony);
                  const TypeIcon = typeInfo.icon;

                  return (
                    <tr
                      key={testimony.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-2">
                            {testimony.eventTitle}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {testimony.fullTestimony?.replace(/<[^>]+>/g, "").substring(0, 60)}...
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{getAuthorName(testimony)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                          <span className="text-gray-700">{typeInfo.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color} capitalize`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{testimony.location || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(testimony.dateOfEventFrom)}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        {formatReads(testimony.impressions)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(testimony.createdAt)}
                      </td>
                   
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {testimonies.length === 0 && totalTestimonies === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FileText className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-gray-600 mb-4">No testimonies submitted yet</p>
              <Link
                href="/share-testimony"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add First Testimony
              </Link>
            </div>
          ) : testimonies.length === 0 &&
            (searchTerm || statusFilter !== "all" || typeFilter !== "all") ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-gray-600 mb-4">
                No testimonies found matching your current filters or search term.
              </p>
            </div>
          ) : null}

          {/* Pagination Controls */}
          {totalPages > 1 && testimonies.length > 0 && (
            <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-white">
              <p className="text-sm text-gray-600">
                Viewing {(skip + 1).toLocaleString()}–
                {(skip + testimonies.length).toLocaleString()} of{" "}
                {totalTestimonies.toLocaleString()} testimonies
              </p>

              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-sm font-medium text-gray-700">
                  Page {currentPage.toLocaleString()} of{" "}
                  {totalPages.toLocaleString()}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}