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
        'fixed left-0 top-0 h-full glass-card transition-all duration-300 z-50 flex flex-col',
        isCollapsed ? 'w-16' : 'w-72'
      )}>
        
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground text-sm tracking-tight">AI Quality Control</h2>
                  <p className="text-xs text-muted-foreground">inDrive Solution</p>
                </div>
              </div>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
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
          <div className="p-4 border-t border-border">
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Текущая страница</span>
                <span className="font-medium">{navigationItems.find(item => item.path === location.pathname)?.label || 'Главная'}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-green-500 h-2 rounded-full transition-all duration-500 shadow-sm"
                  style={{ 
                    width: `${((navigationItems.findIndex(item => item.path === location.pathname) + 1) / navigationItems.length * 100) || 50}%` 
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="p-4 border-t border-border mt-auto">
          {isCollapsed ? (
            <div className="space-y-2">
              <button className="w-full p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200">
                <Github className="w-4 h-4 mx-auto" />
              </button>
              <button className="w-full p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200">
                <Mail className="w-4 h-4 mx-auto" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <a 
                href="https://github.com" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200 text-sm"
              >
                <Github className="w-4 h-4" />
                <span>GitHub проекта</span>
              </a>
              <a 
                href="mailto:team@example.com" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200 text-sm"
              >
                <Mail className="w-4 h-4" />
                <span>Связаться с нами</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
