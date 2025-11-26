import { Sparkles } from "lucide-react";

export default function EducationHeader() {
  return (
    <div className="relative bg-gray-50 text-gray-900 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gray-900 rounded-full mix-blend-multiply blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gray-900 rounded-full mix-blend-multiply blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 border border-gray-200">
            <Sparkles className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Kwibuka Resources</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-balance">
            Honor. Remember. Learn.
          </h1>

          <p className="text-lg text-gray-600 mx-auto text-balance">
            Explore thoughtful educational resources that preserve the memory of the 1994 Genocide against the Tutsi. 
            Engage with learning materials that promote remembrance, unity, and a deeper understanding of Rwanda’s history.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors">
              Start Learning
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-white/50 transition-colors">
              View Testimonies
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
