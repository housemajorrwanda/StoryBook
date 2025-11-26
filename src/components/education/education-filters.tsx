"use client";

interface FilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  contentType: string;
  setContentType: (type: string) => void;
}

const categories = [
  { id: "all", label: "All Content" },
  { id: "history", label: "History & Context" },
  { id: "prevention", label: "Genocide Prevention" },
  { id: "reconciliation", label: "Reconciliation & Unity" },
  { id: "survivor-stories", label: "Survivor Stories" },
  { id: "memorials", label: "Memorials & Testimonies" }, 
];

const contentTypes = [
  { id: "all", label: "All Formats" },
  { id: "article", label: "Articles & Documents" },
  { id: "video", label: "Video Stories" },
  { id: "interactive", label: "Interactive Learning" },
  { id: "timeline", label: "Historical Timelines" },
  { id: "audio", label: "Audio Testimonies" },
];

export default function EducationFilters({
  selectedCategory,
  setSelectedCategory,
  contentType,
  setContentType,
}: FilterProps) {


  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-8">
        {/* Category Filter */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">Theme</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-gray-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Type Filter */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">Format</h3>
          <div className="flex flex-wrap gap-2">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  contentType === type.id
                    ? "bg-gray-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setContentType(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}