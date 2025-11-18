import React from 'react'

export default function SkeletonTestimonies() {
  return (
    <div className="max-w-9xl mx-auto px-4 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-32 bg-gray-200 rounded-full" />
          <div className="h-10 w-3/4 bg-gray-200 rounded-2xl" />
          <div className="h-4 w-1/2 bg-gray-200 rounded-full" />
          <div className="h-12 bg-gray-100 rounded-full" />
        </div>
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={`skeleton-${idx}`}
            className="animate-pulse rounded-3xl bg-white shadow-sm overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1.65fr,1fr]">
              <div className="p-4 md:p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-7 bg-gray-200 rounded-full" />
                  <div className="w-16 h-4 bg-gray-100 rounded-full" />
                  <div className="w-20 h-4 bg-gray-100 rounded-full" />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="h-6 bg-gray-200 rounded-full w-11/12" />
                  <div className="h-6 bg-gray-200 rounded-full w-3/4" />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full" />
                  <div className="h-4 bg-gray-100 rounded-full w-10/12" />
                  <div className="h-4 bg-gray-100 rounded-full w-9/12" />
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <div className="w-24 h-6 bg-gray-100 rounded-full" />
                  <div className="w-20 h-6 bg-gray-100 rounded-full" />
                  <div className="w-28 h-6 bg-gray-100 rounded-full" />
                </div>
              </div>
              <div className="hidden md:block h-full w-full bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
  )
}
