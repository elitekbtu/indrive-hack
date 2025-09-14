import React from 'react';
import { cn } from '@/lib/utils';
import type { NavigationItem } from '@/utils/navigation';

interface SidebarItemProps {
  item: NavigationItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

// Single Responsibility: только отображение одного элемента навигации
export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  isCollapsed,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-300 hover:scale-105',
        isActive 
          ? 'bg-indrive-green-600/20 text-indrive-green-300 border border-indrive-green-600/40 shadow-lg shadow-indrive-green-600/10' 
          : 'text-indrive-green-400 hover:bg-indrive-green-600/10 hover:text-indrive-green-300 border border-transparent',
        isCollapsed ? 'justify-center px-2' : 'justify-start'
      )}
    >
      {/* Icon */}
      <span className="text-xl flex-shrink-0 transition-transform group-hover:scale-110">
        {item.icon}
      </span>

      {/* Label and Description */}
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm leading-tight">{item.label}</div>
          {item.description && (
            <div className="text-xs opacity-70 truncate">{item.description}</div>
          )}
        </div>
      )}

      {/* Active indicator */}
      {isActive && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indrive-green-400 to-indrive-green-600 rounded-l-full" />
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-indrive-black-800 border border-indrive-green-600/30 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          {item.label}
          {item.description && (
            <div className="text-indrive-green-400 text-xs">{item.description}</div>
          )}
        </div>
      )}
    </button>
  );
};
