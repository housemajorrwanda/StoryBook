"use client";

interface FilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  contentType: string;
  setContentType: (type: string) => void;
}

const categories = [
  { id: "all", label: "All Themes" },
  { id: "history", label: "History" },
  { id: "prevention", label: "Prevention" },
  { id: "reconciliation", label: "Reconciliation" },
  { id: "survivor-stories", label: "Survivors" },
  { id: "memorials", label: "Memorials" },
];

const contentTypes = [
  { id: "all", label: "All Formats" },
  { id: "article", label: "Articles" },
  { id: "video", label: "Videos" },
  { id: "interactive", label: "Interactive" },
  { id: "timeline", label: "Timelines" },
  { id: "audio", label: "Audio" },
];

export default function EducationFilters({
  selectedCategory,
  setSelectedCategory,
  contentType,
  setContentType,
}: FilterProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Category row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mr-1 shrink-0">
          Theme
        </span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategory === cat.id
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Format row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mr-1 shrink-0">
          Format
        </span>
        {contentTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setContentType(type.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              contentType === type.id
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}