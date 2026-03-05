"use client"

import { BookOpen, FilterX, Search } from "lucide-react"
import { useState } from "react"
import EducationCard from "./education-card"
import { useEducationContent } from "@/hooks/education/use-education-content"

interface EducationGridProps {
  category: string
  contentType: string
  searchQuery: string
  onClearFilters: () => void
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        <div className="h-3 w-1/2 bg-gray-100 rounded" />
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-4/5 bg-gray-100 rounded" />
        </div>
        <div className="h-9 w-full bg-gray-100 rounded-xl mt-2" />
      </div>
    </div>
  )
}

export default function EducationGrid({
  category,
  contentType,
  searchQuery,
  onClearFilters
}: EducationGridProps) {
  const [skip, setSkip] = useState(0)
  const limit = 12

  const { data, isLoading, error } = useEducationContent({
    skip,
    limit,
    search: searchQuery || undefined,
    type: contentType !== "all" ? contentType : undefined,
    category: category !== "all" ? category : undefined,
    isPublished: true,
  })

  const content = data?.data || []
  const total = data?.meta.total || 0
  const hasNextPage = skip + limit < total
  const hasActiveFilters = category !== "all" || contentType !== "all" || searchQuery !== ""

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-4" />
        <p className="text-sm font-semibold text-gray-900 mb-1">Failed to load content</p>
        <p className="text-sm text-gray-400 mb-5">Please try again later.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-xs font-semibold text-gray-900 underline underline-offset-2"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : content.length === 0 ? (
        <EmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
          searchQuery={searchQuery}
        />
      ) : (
        <div className="space-y-8">
          {/* Result header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-gray-900">{total.toLocaleString()}</span>{" "}
              {total === 1 ? "resource" : "resources"} found
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
              >
                <FilterX className="w-3.5 h-3.5" />
                Clear filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {content.map((item) => (
              <EducationCard key={item.id} content={item} />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={() => setSkip(skip + limit)}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface EmptyStateProps {
  hasActiveFilters: boolean
  onClearFilters: () => void
  searchQuery: string
}

function EmptyState({ hasActiveFilters, onClearFilters, searchQuery }: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      {hasActiveFilters ? (
        <>
          <Search className="w-10 h-10 text-gray-200 mx-auto mb-4" />
          <p className="text-sm font-semibold text-gray-900 mb-1">No results found</p>
          <p className="text-sm text-gray-400 mb-5 max-w-xs mx-auto">
            {searchQuery
              ? `Nothing matched "${searchQuery}". Try a different search or clear your filters.`
              : "No content matches the current filters."}
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FilterX className="w-3.5 h-3.5" />
            Clear all filters
          </button>
        </>
      ) : (
        <>
          <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-4" />
          <p className="text-sm font-semibold text-gray-900 mb-1">No content yet</p>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            We&apos;re working on adding new resources. Check back soon.
          </p>
        </>
      )}
    </div>
  )
}