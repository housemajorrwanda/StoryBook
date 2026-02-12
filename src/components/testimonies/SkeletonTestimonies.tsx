export default function SkeletonTestimonies() {
  return (
    <div className="w-full">
      {/* Search skeleton */}
      <div className="mb-8">
        <div className="h-11 bg-gray-100 rounded-xl animate-pulse" />
      </div>

      {/* Featured story skeleton */}
      <div className="animate-pulse mb-10">
        <div className="w-full aspect-video bg-gray-100 rounded-2xl mb-6" />
        <div className="flex items-center gap-3 mb-3">
          <div className="h-3 w-28 bg-gray-100 rounded" />
          <div className="w-1 h-1 rounded-full bg-gray-200" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-7 bg-gray-100 rounded w-4/5" />
          <div className="h-7 bg-gray-100 rounded w-3/5" />
        </div>
        <div className="space-y-2 mb-5">
          <div className="h-4 bg-gray-50 rounded w-full" />
          <div className="h-4 bg-gray-50 rounded w-11/12" />
          <div className="h-4 bg-gray-50 rounded w-4/5" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gray-100 rounded-full" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>
          <div className="h-4 w-20 bg-gray-50 rounded" />
        </div>
      </div>

      {/* Regular story skeletons */}
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={`skeleton-${idx}`}
          className={`animate-pulse flex gap-6 py-7 md:py-8 ${idx > 0 || true ? "border-t border-gray-100" : ""}`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="h-3 w-14 bg-gray-100 rounded" />
              <div className="w-1 h-1 rounded-full bg-gray-200" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
            <div className="space-y-2 mb-3">
              <div className="h-5 bg-gray-100 rounded w-11/12" />
              <div className="h-5 bg-gray-100 rounded w-3/5" />
            </div>
            <div className="space-y-1.5 mb-3">
              <div className="h-3.5 bg-gray-50 rounded w-full" />
              <div className="h-3.5 bg-gray-50 rounded w-4/5" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-20 bg-gray-100 rounded" />
              <div className="w-1 h-1 rounded-full bg-gray-200" />
              <div className="h-3 w-16 bg-gray-50 rounded" />
            </div>
          </div>
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-xl shrink-0" />
        </div>
      ))}
    </div>
  );
}
