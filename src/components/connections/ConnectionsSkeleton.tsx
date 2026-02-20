export default function ConnectionsSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-8 md:py-12">
        {/* Back link */}
        <div className="h-4 w-16 bg-gray-200 rounded mb-8 animate-pulse" />

        {/* Title */}
        <div className="mb-10 animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-200 rounded-xl" />
            <div className="h-8 w-64 bg-gray-200 rounded" />
          </div>
          <div className="h-5 w-96 max-w-full bg-gray-100 rounded mt-2" />
          <div className="h-4 w-48 bg-gray-100 rounded mt-3" />
        </div>

        {/* Group skeletons */}
        {[1, 2].map((g) => (
          <div
            key={g}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-10 animate-pulse"
          >
            {/* Group header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="h-3 w-24 bg-gray-100 rounded mb-2" />
              <div className="h-5 w-72 max-w-full bg-gray-200 rounded" />
            </div>

            {/* Card skeletons */}
            <div className="p-6 space-y-4">
              {[1, 2].map((c) => (
                <div
                  key={c}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl border border-gray-100"
                >
                  <div className="w-full sm:w-28 h-32 sm:h-28 bg-gray-100 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-5 w-24 bg-gray-100 rounded-full" />
                      <div className="h-5 w-16 bg-gray-100 rounded" />
                    </div>
                    <div className="h-5 w-4/5 bg-gray-200 rounded" />
                    <div className="flex gap-4">
                      <div className="h-3 w-28 bg-gray-100 rounded" />
                      <div className="h-3 w-36 bg-gray-100 rounded" />
                    </div>
                    <div className="h-4 w-full bg-gray-50 rounded" />
                    <div className="h-4 w-3/4 bg-gray-50 rounded" />
                  </div>
                  <div className="hidden sm:block w-12 h-12 bg-gray-100 rounded-full shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
