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
    <div className={`min-h-screen flex items-center justify-center pt-32 ${className}`}>
      <div className="container mx-auto px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          {title}
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
