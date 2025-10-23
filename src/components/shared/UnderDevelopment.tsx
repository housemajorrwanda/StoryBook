interface UnderDevelopmentProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function UnderDevelopment({ 
  title = "Welcome to StoryBook",
  subtitle = "This page is still under development",
  className = ""
}: UnderDevelopmentProps) {
  return (
    <div className={`flex items-center justify-center h-full ${className}`}>
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
