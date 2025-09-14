import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getBreadcrumbs } from '@/utils/navigation';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on home page
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-indrive-green-400 mb-6">
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-indrive-green-600" />
          )}
          
          <Link
            to={item.path}
            className={cn(
              'flex items-center gap-1 hover:text-indrive-green-300 transition-colors',
              index === breadcrumbs.length - 1 
                ? 'text-indrive-green-200 cursor-default pointer-events-none' 
                : 'text-indrive-green-400'
            )}
          >
            {index === 0 && <Home className="w-4 h-4" />}
            <span>{item.label}</span>
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
};
