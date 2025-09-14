import React, { useState } from 'react';
import { ArrowUp, Zap, Github, Mail, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const FloatingActions: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDemo = () => {
    navigate('/demo');
  };

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const actions = [
    {
      icon: ArrowUp,
      label: 'Наверх',
      onClick: scrollToTop,
      className: 'bg-indrive-green-600 hover:bg-indrive-green-700'
    },
    {
      icon: Zap,
      label: 'Демо',
      onClick: navigateToDemo,
      className: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      icon: Github,
      label: 'GitHub',
      onClick: () => window.open('https://github.com', '_blank'),
      className: 'bg-gray-600 hover:bg-gray-700'
    },
    {
      icon: Mail,
      label: 'Контакты',
      onClick: () => window.open('mailto:team@example.com'),
      className: 'bg-blue-600 hover:bg-blue-700'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col-reverse items-end gap-3">
      {/* Action Buttons */}
      {actions.map((action, index) => {
        const IconComponent = action.icon;
        return (
          <div
            key={index}
            className={cn(
              'transform transition-all duration-300 ease-out',
              isExpanded 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-4 opacity-0 scale-75 pointer-events-none'
            )}
            style={{ transitionDelay: `${index * 75}ms` }}
          >
            <button
              onClick={action.onClick}
              className={cn(
                'group relative flex items-center gap-3 px-4 py-3 rounded-full text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200',
                action.className
              )}
            >
              <IconComponent className="w-5 h-5" />
              <span className="hidden sm:block text-sm font-medium whitespace-nowrap">
                {action.label}
              </span>
              
              {/* Tooltip for mobile */}
              <div className="sm:hidden absolute right-full mr-3 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {action.label}
              </div>
            </button>
          </div>
        );
      })}

      {/* Main Toggle Button */}
      <button
        onClick={toggleExpanded}
        className={cn(
          'group relative w-14 h-14 rounded-full bg-gradient-to-r from-indrive-green-600 to-indrive-green-500 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center',
          isExpanded && 'rotate-45'
        )}
      >
        {isExpanded ? (
          <X className="w-6 h-6 transition-transform" />
        ) : (
          <Plus className="w-6 h-6 transition-transform" />
        )}
        
        {/* Pulse animation when collapsed */}
        {!isExpanded && (
          <div className="absolute inset-0 rounded-full bg-indrive-green-600 animate-ping opacity-20" />
        )}
      </button>
    </div>
  );
};
