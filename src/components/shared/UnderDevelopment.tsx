interface UnderDevelopmentProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function UnderDevelopment({
  title = "Page Under Development",
  subtitle = "This page is still under development. Please check back later.",
  className = "",
}: UnderDevelopmentProps) {
  return (
    <div className={`flex items-center justify-center min-h-[60vh] ${className}`}>
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-6">
          <svg
            className="w-20 h-20 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {title}
        </h2>
        <p className="text-gray-600 text-base md:text-lg">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

