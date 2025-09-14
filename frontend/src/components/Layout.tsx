import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';
import { FloatingActions } from './FloatingActions';
import { Breadcrumbs } from './Breadcrumbs';

interface LayoutProps {
  children: React.ReactNode;
}

// Layout компонент следует принципу Dependency Inversion
// Зависит от абстракции (children), а не от конкретных компонентов
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indrive-black-950 via-indrive-black-900 to-indrive-black-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Floating Actions */}
      <FloatingActions />
      
      {/* Main content with proper spacing for sidebar */}
      <main className="lg:ml-72 transition-all duration-300">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-6 pt-6">
          <Breadcrumbs />
        </div>
        
        {children}
      </main>
    </div>
  );
};
