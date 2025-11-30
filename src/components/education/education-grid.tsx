"use client"

import { BookOpen, Loader2, FilterX } from "lucide-react"
import { useState } from "react"
import EducationCard from "./education-card"
import { useEducationContent } from "@/hooks/education/use-education-content"

interface EducationGridProps {
  category: string
  contentType: string
  searchQuery: string
  onClearFilters: () => void
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

  // Check if filters are active
  const hasActiveFilters = category !== "all" || contentType !== "all" || searchQuery !== ""

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Content</h3>
          <p className="text-gray-700">Please try again later or contact support.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-gray-700">Loading educational content...</p>
        </div>
      ) : content.length === 0 ? (
        <EmptyState 
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
          searchQuery={searchQuery}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black">{total} Resources Found</h2>
              <p className="text-sm text-gray-600 mt-1">Explore and learn at your own pace</p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-black transition-colors border border-border rounded-lg hover:border-foreground/20"
              >
                <FilterX className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <EducationCard key={item.id} content={item} />
            ))}
          </div>

          {/* Pagination */}
          {hasNextPage && (
            <div className="flex justify-center pt-8">
              <button
                onClick={() => setSkip(skip + limit)}
                className="px-6 py-2 bg-primary text-gray-800 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Empty State Component
interface EmptyStateProps {
  hasActiveFilters: boolean
  onClearFilters: () => void
  searchQuery: string
}

function EmptyState({ hasActiveFilters, onClearFilters, searchQuery }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <BookOpen className="h-20 w-20 text-gray-700 mx-auto mb-6 opacity-50" />
      
      {hasActiveFilters ? (
        <>
          <h3 className="text-2xl font-semibold text-foreground mb-3">
            No matching content found
          </h3>
          <p className="text-gray-700 mb-6 max-w-md mx-auto">
            {searchQuery ? (
              `No results found for "${searchQuery}" with the current filters. Try adjusting your search or filters.`
            ) : (
              "No content matches the current filters. Try adjusting your selection."
            )}
          </p>
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm text-gray-700 hover:text-black transition-colors border border-border rounded-lg hover:border-foreground/20"
          >
            <FilterX className="h-5 w-5" />
            Clear All Filters
          </button>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-semibold text-foreground mb-3">
            No educational content available
          </h3>
          <p className="text-gray-700 max-w-md mx-auto">
            We&lsquo;re working on adding new educational resources. Check back soon for updates.
          </p>
        </>
      )}
    </div>
  )
}