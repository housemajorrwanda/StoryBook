import Link from "next/link";
import { Construction, ArrowLeft, Sparkles } from "lucide-react";

interface UnderDevelopmentProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  className?: string;
}

export default function UnderDevelopment({
  title = "Coming Soon",
  subtitle = "We&apos;re working hard to bring you something amazing. This page will be available soon!",
  showBackButton = true,
  className = "",
}: UnderDevelopmentProps) {
  return (
    <div className={`min-h-[80vh] flex items-center justify-center py-20 px-4 ${className}`}>
      <div className="text-center max-w-2xl mx-auto">
        {/* Animated Icon Container */}
        <div className="mb-8 relative">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-linear-to-br from-gray-100 to-gray-200 mb-6 relative overflow-hidden">
            <Construction className="w-16 h-16 text-gray-600 relative z-10 animate-pulse" />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent" 
              style={{
                animation: "shimmer 3s infinite",
              }}
            />
          </div>
          
          {/* Floating Sparkles */}
          <div className="absolute top-0 left-1/4">
            <Sparkles className="w-6 h-6 text-gray-400 animate-bounce" style={{ animationDelay: "0s", animationDuration: "2s" }} />
          </div>
          <div className="absolute top-0 right-1/4">
            <Sparkles className="w-5 h-5 text-gray-400 animate-bounce" style={{ animationDelay: "1s", animationDuration: "2.5s" }} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tight">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* Progress Indicator */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-gray-400 to-gray-600 rounded-full transition-all duration-2000 ease-out" 
              style={{ width: "65%" }} 
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">We&apos;re making progress...</p>
        </div>

        {/* Action Buttons */}
        {showBackButton && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <Link
              href="#testimonies"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-all duration-200"
            >
              Explore Testimonies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

