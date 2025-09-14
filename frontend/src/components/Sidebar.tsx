import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Github, Mail } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarItem } from '@/components/ui/sidebar-item';
import { navigationItems } from '@/utils/navigation';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-40 opacity-0 pointer-events-none transition-opacity" />
      
      {/* Sidebar */}
      <div className={cn(
        'fixed left-0 top-0 h-full bg-gradient-to-b from-indrive-black-900/95 to-indrive-black-950/95 backdrop-blur-xl border-r border-indrive-green-700/30 transition-all duration-300 z-50 flex flex-col',
        isCollapsed ? 'w-16' : 'w-72'
      )}>
        
        {/* Header */}
        <div className="p-4 border-b border-indrive-green-700/30">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indrive-green-500 to-indrive-green-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-indrive-green-300 text-sm">AI Quality Control</h2>
                  <p className="text-xs text-indrive-green-500">inDrive Solution</p>
                </div>
              </div>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-indrive-green-600/10 text-indrive-green-400 hover:text-indrive-green-300 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={location.pathname === item.path}
              isCollapsed={isCollapsed}
              onClick={() => handleNavClick(item.path)}
            />
          ))}
        </nav>

        {/* Progress Indicator */}
        {!isCollapsed && (
          <div className="p-4 border-t border-indrive-green-700/30">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-indrive-green-400">
                <span>Текущая страница</span>
                <span>{navigationItems.find(item => item.path === location.pathname)?.label || 'Главная'}</span>
              </div>
              <div className="w-full bg-indrive-black-800 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-indrive-green-600 to-indrive-green-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${((navigationItems.findIndex(item => item.path === location.pathname) + 1) / navigationItems.length * 100) || 16.67}%` 
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="p-3 border-t border-indrive-green-700/30">
          {isCollapsed ? (
            <div className="space-y-2">
              <button className="w-full p-2 rounded-lg hover:bg-indrive-green-600/10 text-indrive-green-400 hover:text-indrive-green-300 transition-colors">
                <Github className="w-4 h-4 mx-auto" />
              </button>
              <button className="w-full p-2 rounded-lg hover:bg-indrive-green-600/10 text-indrive-green-400 hover:text-indrive-green-300 transition-colors">
                <Mail className="w-4 h-4 mx-auto" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <a 
                href="https://github.com" 
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indrive-green-600/10 text-indrive-green-400 hover:text-indrive-green-300 transition-colors text-sm"
              >
                <Github className="w-4 h-4" />
                <span>GitHub проекта</span>
              </a>
              <a 
                href="mailto:team@example.com" 
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indrive-green-600/10 text-indrive-green-400 hover:text-indrive-green-300 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                <span>Связаться с нами</span>
              </a>
            </div>
          )}
        </div>

        {/* Gradient overlay for visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-r from-indrive-green-600/5 to-transparent pointer-events-none" />
      </div>
    </>
  );
};
