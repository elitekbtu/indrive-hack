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
        'group relative w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 hover:scale-[1.02]',
        isActive 
          ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent',
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
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full shadow-sm" />
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-3 px-3 py-2 bg-background border border-border rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
          <div className="font-medium">{item.label}</div>
          {item.description && (
            <div className="text-muted-foreground text-xs mt-1">{item.description}</div>
          )}
        </div>
      )}
    </button>
  );
};
