import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";

interface NotFoundProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  className?: string;
}

export default function NotFound({
  title = "404 - Page Not Found",
  subtitle = "Sorry, the page you are looking for doesn't exist.",
  showBackButton = true,
  className = "",
}: NotFoundProps) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center pt-32 ${className}`}
    >
      <div className="container mx-auto px-8 text-center">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-300 mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {showBackButton && (
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors"
            >
              <LuArrowLeft className="w-5 h-5 mr-2" />
              Go Back Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
