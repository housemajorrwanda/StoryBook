"use client";

interface PaginationProps {
  total: number;
  limit: number;
  skip: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPageNumbers?: boolean;
  showResultsInfo?: boolean;
  variant?: "default" | "minimal";
}

const MAX_VISIBLE_PAGES = 5;

export default function Pagination({
  total,
  limit,
  skip,
  onPageChange,
  className = "",
  showPageNumbers = true,
  showResultsInfo = true,
  variant = "default",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Math.floor(skip / limit) + 1),
  );

  const goToPage = (page: number) => {
    const next = Math.min(Math.max(page, 1), totalPages);
    onPageChange(next);
  };

  const getVisiblePages = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: number[] = [];
    const half = Math.floor(MAX_VISIBLE_PAGES / 2);
    let start = Math.max(currentPage - half, 1);
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - MAX_VISIBLE_PAGES + 1, 1);
    }

    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push(-1); // -1 represents ellipsis
    }

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(-1); // -1 represents ellipsis
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const isMinimal = variant === "minimal";

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-6 ${className}`}>
      {/* Results Info */}
      {showResultsInfo && (
        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {Math.min(skip + 1, total)}-{Math.min(skip + limit, total)}
          </span>{" "}
          of <span className="font-semibold text-gray-900">{total}</span>{" "}
          results
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {!isMinimal && "Previous"}
        </button>

        {/* Page Numbers */}
        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {getVisiblePages().map((page, index) =>
              page === -1 ? (
                <span
                  key={`ellipsis-${index}`}
                  className="min-w-10 h-10 px-3 flex items-center justify-center text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={`min-w-10 h-10 px-3 text-sm font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer ${
                    page === currentPage
                      ? "bg-gray-600 text-white shadow-sm hover:bg-gray-700 cursor-pointer"
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        )}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
        >
          {!isMinimal && "Next"}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}