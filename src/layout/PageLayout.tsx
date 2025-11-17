import { ReactNode } from 'react';
import Navigation from '@/components/shared/Navigation';

interface PageLayoutProps {
  children: ReactNode;
  showBackgroundEffects?: boolean;
  variant?: "default" | "transparent";
}

export default function PageLayout({ 
  children, 
  showBackgroundEffects = true, 
  variant = "default" 
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden">
      <Navigation 
        showBackgroundEffects={showBackgroundEffects} 
        variant={variant}
      />
      
      {/* Spacer for fixed header */}
      <div className="h-28 sm:h-32 md:h-36" />
      
      {children}
    </div>
  );
}