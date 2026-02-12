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
    <div className="min-h-screen bg-[#fafafa] relative">
      <Navigation 
        showBackgroundEffects={showBackgroundEffects} 
        variant={variant}
      />
      
      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20" />
      
      {children}
    </div>
  );
}