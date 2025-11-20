"use client";

import {
  BarChart3,
  Eye,
  TrendingUp,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  useVirtualTours,
  useDeleteVirtualTour,
  usePublishVirtualTour,
  useUnpublishVirtualTour,
  useArchiveVirtualTour,
} from "@/hooks/virtual-tour/use-virtual-tours";
import { VirtualTour } from "@/types/tour";

const ITEMS_PER_PAGE = 25;
type StatusFilterType = "all" | "published" | "draft" | "archived";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const {
    data: toursResponse,
    isLoading,
    error,
  } = useVirtualTours({
    search: searchTerm || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    limit: ITEMS_PER_PAGE,
    skip: skip,
  });

  const deleteTourMutation = useDeleteVirtualTour();
  const publishTourMutation = usePublishVirtualTour();
  const unpublishTourMutation = useUnpublishVirtualTour();
  const archiveTourMutation = useArchiveVirtualTour();

  const tours = useMemo(() => toursResponse?.data || [], [toursResponse?.data]);
  const totalTours = useMemo(
    () => toursResponse?.meta?.total || 0,
    [toursResponse?.meta?.total]
  );

  const totalPages = useMemo(
    () => Math.ceil(totalTours / ITEMS_PER_PAGE),
    [totalTours]
  );

  const filteredTours = tours;

  const stats = useMemo(() => {
    const publishedTours = tours.filter(
      (tour) => tour.isPublished && !tour.isArchived
    );
    const draftTours = tours.filter(
      (tour) => !tour.isPublished && !tour.isArchived
    );
    const archivedTours = tours.filter((tour) => tour.isArchived);
    const totalImpressions = tours.reduce(
      (sum, tour) => sum + (tour.impressions || 0),
      0
    );
    return [
      {
        label: "Total Tours",
        value: totalTours.toLocaleString(),
        icon: BarChart3,
        description: "All virtual tours",
      },
      {
        label: "Published (on page)",
        value: publishedTours.length.toString(),
        icon: Eye,
        description: "Live tours on this page",
      },
      {
        label: "Archived (on page)",
        value: archivedTours.length.toString(),
        icon: Archive,
        description: "Archived tours on this page",
      },
      {
        label: "Drafts (on page)",
        value: draftTours.length.toString(),
        icon: Edit,
        description: "In progress on this page",
      },
      {
        label: "Total Views (on page)",
        value: totalImpressions.toLocaleString(),
        icon: TrendingUp,
        description: "Impressions on this page",
      },
    ];
  }, [tours, totalTours]);

  const handleDeleteTour = (id: number) => {
    if (
      confirm(
        "Are you sure you want to delete this tour? This action cannot be undone."
      )
    ) {
      deleteTourMutation.mutate(id);
    }
  };

  const handlePublishTour = (id: number) => {
    publishTourMutation.mutate(id);
    setOpenMenu(null);
  };

  const handleUnpublishTour = (id: number) => {
    unpublishTourMutation.mutate(id);
    setOpenMenu(null);
  };

  const handleArchiveTour = (id: number) => {
    archiveTourMutation.mutate(id);
    setOpenMenu(null);
  };

  const getStatusInfo = (tour: VirtualTour) => {
    if (tour.isArchived) {
      return {
        status: "archived",
        label: "Archived",
        color: "bg-gray-100 text-gray-600 border-gray-200",
        badgeColor: "text-gray-600",
      };
    }
    if (tour.isPublished) {
      return {
        status: "published",
        label: "Published",
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        badgeColor: "text-emerald-600",
      };
    }
    return {
      status: "draft",
      label: "Draft",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      badgeColor: "text-amber-600",
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setOpenMenu(null);
    }
  };

  const handleFilterChange = (status: StatusFilterType) => {
    setCurrentPage(1);
    setStatusFilter(status);
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

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-6 bg-white animate-pulse"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-8 bg-gray-200 rounded w-16" />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gray-200" />
                </div>
              </div>
            ))}
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
          <div className="text-red-600 mb-4">Failed to load dashboard data</div>
          <button
            onClick={() => window.location.reload()}
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
            Virtual Tour Management
          </h1>
          <p className="text-gray-600">
            Manage your virtual tours, analytics, and platform settings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tours Management */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          {/* Header with Search and Actions */}
          <div className="border-b border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
            <div className="flex-1 w-full">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tours..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)} // Use new handler
                  className="w-full pl-10 pr-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/create"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Tour
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="border-b border-gray-200 p-4 flex gap-2 flex-wrap bg-gray-50">
            {(["all", "published", "draft", "archived"] as const).map(
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Tour
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Impressions
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Hotspots
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Audio
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Created
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTours.map((tour) => {
                  const statusInfo = getStatusInfo(tour);
                  const hotspotsCount =
                    tour._count?.hotspots || tour.hotspots?.length || 0;
                  const audioRegionsCount =
                    tour._count?.audioRegions || tour.audioRegions?.length || 0;

                  return (
                    <tr
                      key={tour.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {tour.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {tour.location}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color} capitalize`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        {(tour.impressions || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {hotspotsCount}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {audioRegionsCount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(tour.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative flex justify-center">
                          <button
                            onClick={() =>
                              setOpenMenu(openMenu === tour.id ? null : tour.id)
                            }
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {openMenu === tour.id && (
                            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg shadow-gray-400/20 overflow-hidden z-50 w-48">
                              <Link
                                href={`/virtual-tours/${tour.id}`}
                                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 text-sm"
                              >
                                <Eye className="w-4 h-4" />
                                View Tour
                              </Link>
                              <Link
                                href={`/dashboard/edit/${tour.id}`}
                                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 text-sm"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </Link>
                              {!tour.isPublished && !tour.isArchived && (
                                <button
                                  onClick={() => handlePublishTour(tour.id)}
                                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-gray-900 text-sm"
                                >
                                  <TrendingUp className="w-4 h-4" />
                                  Publish
                                </button>
                              )}
                              {tour.isPublished && !tour.isArchived && (
                                <button
                                  onClick={() => handleUnpublishTour(tour.id)}
                                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-gray-600 text-sm"
                                >
                                  <Archive className="w-4 h-4" />
                                  Unpublish
                                </button>
                              )}
                              {!tour.isArchived && (
                                <button
                                  onClick={() => handleArchiveTour(tour.id)}
                                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-gray-600 text-sm"
                                >
                                  <Archive className="w-4 h-4" />
                                  Archive
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteTour(tour.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-50 transition-colors text-red-600 text-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredTours.length === 0 && totalTours === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <BarChart3 className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-gray-600 mb-4">No virtual tours created yet</p>
              <Link
                href="/dashboard/create"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Your First Tour
              </Link>
            </div>
          ) : filteredTours.length === 0 &&
            (searchTerm || statusFilter !== "all") ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-gray-600 mb-4">
                No tours found matching your current filters or search term.
              </p>
            </div>
          ) : null}

          {/* --- Pagination Controls --- */}
          {totalPages > 1 && filteredTours.length > 0 && (
            <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-white">
              <p className="text-sm text-gray-600">
                Viewing {(skip + 1).toLocaleString()}–
                {(skip + filteredTours.length).toLocaleString()} of{" "}
                {totalTours.toLocaleString()} remembrance tours. Never Again.
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
