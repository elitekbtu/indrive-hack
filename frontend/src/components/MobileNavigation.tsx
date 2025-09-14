import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarItem } from '@/components/ui/sidebar-item';
import { navigationItems } from '@/utils/navigation';

export const MobileNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsOpen(false); // Close menu after navigation
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 rounded-lg bg-indrive-black-900/90 backdrop-blur-sm border border-indrive-green-600/30 text-indrive-green-400 hover:text-indrive-green-300 transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40 transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-indrive-black-900/95 to-indrive-black-950/95 backdrop-blur-xl border-r border-indrive-green-700/30 lg:hidden z-50 transition-transform duration-300 flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-indrive-green-700/30 mt-12">
          <h2 className="font-bold text-indrive-green-300 text-lg">AI Quality Control</h2>
          <p className="text-sm text-indrive-green-500">inDrive Solution</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={location.pathname === item.path}
              isCollapsed={false}
              onClick={() => handleNavClick(item.path)}
            />
          ))}
        </nav>

        {/* Progress */}
        <div className="p-4 border-t border-indrive-green-700/30">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-indrive-green-400">
              <span>Текущая страница</span>
              <span>{navigationItems.find(item => item.path === location.pathname)?.label || 'Главная'}</span>
            </div>
            <div className="w-full bg-indrive-black-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indrive-green-600 to-indrive-green-400 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${((navigationItems.findIndex(item => item.path === location.pathname) + 1) / navigationItems.length * 100) || 16.67}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
