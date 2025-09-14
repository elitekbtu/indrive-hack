import React from 'react';
import { TubelightNavBar } from './ui/tubelight-navbar';
import { Home, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: 'Главная', url: '/', icon: Home },
  { name: 'Демо', url: '/demo', icon: Zap }
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Tubelight Navbar */}
      <TubelightNavBar items={navItems} />
      
      {/* Main content */}
      <main>        
        {children}
      </main>
    </div>
  );
};
