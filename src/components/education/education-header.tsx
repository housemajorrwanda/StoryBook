import Link from "next/link";

export default function EducationHeader() {
  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Kwibuka Resources
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Honor. <span className="text-gray-400">Remember.</span> Learn.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl">
            Educational resources that preserve the memory of the 1994 Genocide
            against the Tutsi promoting remembrance, unity, and a deeper
            understanding of Rwanda&apos;s history.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <a
              href="#content"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
            >
              Start Learning
            </a>
            <Link
              href="/all-testimonies"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              View Testimonies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
