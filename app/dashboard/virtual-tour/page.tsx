"use client";

import {
  Eye,
  TrendingUp,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import {
  EmptyState,
  SearchEmptyState,
  ErrorState,
  TableLoadingState,
  PageHeader,
  Pagination,
  ConfirmModal,
} from "@/components/shared";
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
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [publishTarget, setPublishTarget] = useState<number | null>(null);
  const [unpublishTarget, setUnpublishTarget] = useState<number | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<number | null>(null);

  const toggleMenu = (tourId: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (openMenu === tourId) {
      setOpenMenu(null);
      setMenuPos(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
      setOpenMenu(tourId);
    }
  };

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
    [toursResponse?.meta?.total],
  );

  const totalPages = useMemo(
    () => Math.ceil(totalTours / ITEMS_PER_PAGE),
    [totalTours],
  );

  const filteredTours = tours;

  const handleDeleteTour = (id: number) => {
    setDeleteTarget(id);
    setOpenMenu(null);
    setMenuPos(null);
  };

  const confirmDelete = () => {
    if (deleteTarget !== null) {
      deleteTourMutation.mutate(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const handlePublishTour = (id: number) => {
    setPublishTarget(id);
    setOpenMenu(null);
    setMenuPos(null);
  };

  const handleUnpublishTour = (id: number) => {
    setUnpublishTarget(id);
    setOpenMenu(null);
    setMenuPos(null);
  };

  const handleArchiveTour = (id: number) => {
    setArchiveTarget(id);
    setOpenMenu(null);
    setMenuPos(null);
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
    setMenuPos(null);
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
      <div className="p-6">
        <div className="h-8 bg-gray-100 rounded-lg w-56 mb-1 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded-lg w-80 mb-8 animate-pulse" />
        <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
          <TableLoadingState cols={7} rows={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Virtual Tour Management"
        description="Manage your virtual tours, analytics, and platform settings"
        actions={[
          {
            label: "Create Tour",
            href: "/dashboard/virtual-tour/create",
            icon: <Plus className="w-4 h-4" />,
          },
        ]}
      />

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete tour?"
        description="This action cannot be undone. The tour and all its hotspots and audio regions will be permanently removed."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isConfirming={deleteTourMutation.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        isOpen={publishTarget !== null}
        title="Publish tour?"
        description="This tour will be visible to the public."
        confirmLabel="Publish"
        cancelLabel="Cancel"
        isConfirming={publishTourMutation.isPending}
        onConfirm={() => { if (publishTarget !== null) { publishTourMutation.mutate(publishTarget); setPublishTarget(null); } }}
        onClose={() => setPublishTarget(null)}
      />

      <ConfirmModal
        isOpen={unpublishTarget !== null}
        title="Unpublish tour?"
        description="This tour will be hidden from the public."
        confirmLabel="Unpublish"
        cancelLabel="Cancel"
        isConfirming={unpublishTourMutation.isPending}
        onConfirm={() => { if (unpublishTarget !== null) { unpublishTourMutation.mutate(unpublishTarget); setUnpublishTarget(null); } }}
        onClose={() => setUnpublishTarget(null)}
      />

      <ConfirmModal
        isOpen={archiveTarget !== null}
        title="Archive tour?"
        description="This tour will be archived and hidden from listings."
        confirmLabel="Archive"
        cancelLabel="Cancel"
        isConfirming={archiveTourMutation.isPending}
        onConfirm={() => { if (archiveTarget !== null) { archiveTourMutation.mutate(archiveTarget); setArchiveTarget(null); } }}
        onClose={() => setArchiveTarget(null)}
      />

      {openMenu !== null && (
        <div className="fixed inset-0 z-40" onClick={() => { setOpenMenu(null); setMenuPos(null); }} />
      )}

      {/* Tours Management */}
      <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
        {/* Search bar */}
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tours…"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm placeholder:text-gray-500 text-gray-700 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-gray-200 p-4 flex gap-2 flex-wrap bg-gray-50">
          {(["all", "published", "draft", "archived"] as const).map(
            (status) => (
              <button
                type="button"
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
            ),
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full min-w-[700px]">
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
                        <p className="text-sm text-gray-600">{tour.location}</p>
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
                    <td className="px-6 py-4 text-gray-700">{hotspotsCount}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {audioRegionsCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(tour.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={(e) => toggleMenu(tour.id, e)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {openMenu === tour.id && menuPos && (
                          <div
                            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg shadow-gray-400/20 overflow-hidden z-50 w-48"
                            style={{ top: menuPos.top, right: menuPos.right }}
                          >
                            <Link
                              href={`/virtual-tours/${tour.id}`}
                              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              View Tour
                            </Link>
                            <Link
                              href={`/dashboard/create?edit=${tour.id}`}
                              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 text-sm"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Link>
                            {!tour.isPublished && !tour.isArchived && (
                              <button
                                type="button"
                                onClick={() => handlePublishTour(tour.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-gray-900 text-sm"
                              >
                                <TrendingUp className="w-4 h-4" />
                                Publish
                              </button>
                            )}
                            {tour.isPublished && !tour.isArchived && (
                              <button
                                type="button"
                                onClick={() => handleUnpublishTour(tour.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-gray-600 text-sm"
                              >
                                <Archive className="w-4 h-4" />
                                Unpublish
                              </button>
                            )}
                            {!tour.isArchived && (
                              <button
                                type="button"
                                onClick={() => handleArchiveTour(tour.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-gray-600 text-sm"
                              >
                                <Archive className="w-4 h-4" />
                                Archive
                              </button>
                            )}
                            <button
                              type="button"
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
          <EmptyState
            variant="table"
            title="No virtual tours yet"
            subtitle="Create your first tour to get started."
            action={{
              label: "Create Tour",
              href: "/dashboard/virtual-tour/create",
              icon: <Plus className="w-4 h-4" />,
            }}
          />
        ) : filteredTours.length === 0 &&
          (searchTerm || statusFilter !== "all") ? (
          <SearchEmptyState
            query={searchTerm}
            onClear={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
          />
        ) : null}

        {/* Pagination */}
        {totalTours > ITEMS_PER_PAGE && filteredTours.length > 0 && (
          <div className="border-t border-gray-100">
            <Pagination
              total={totalTours}
              limit={ITEMS_PER_PAGE}
              skip={skip}
              onPageChange={handlePageChange}
              variant="default"
            />
          </div>
        )}
      </div>
    </div>
  );
}
