// Navigation configuration for multi-page app (KISS принцип)
export type NavigationItem = {
  id: string;
  path: string;
  label: string;
  icon: string;
  description?: string;
};

export const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    path: '/',
    label: 'Главная',
    icon: '🏠',
    description: 'AI-контроль качества для inDrive'
  },
  {
    id: 'demo',
    path: '/demo',
    label: 'Демо',
    icon: '⚡',
    description: 'Интерактивный тест модели'
  },
  {
    id: 'problem',
    path: '/problem',
    label: 'Проблема',
    icon: '🎯',
    description: 'Ценность решения'
  },
  {
    id: 'process',
    path: '/process',
    label: 'Процесс',
    icon: '⚙️',
    description: 'Как это работает'
  },
  {
    id: 'results',
    path: '/results',
    label: 'Результаты',
    icon: '📊',
    description: 'Метрики и точность'
  },
  {
    id: 'roadmap',
    path: '/roadmap',
    label: 'Планы',
    icon: '🚀',
    description: 'Риски и развитие'
  }
];

// Utility to get current navigation item by path
export const getCurrentNavItem = (pathname: string): NavigationItem | undefined => {
  return navigationItems.find(item => item.path === pathname);
};

// Utility to get breadcrumbs
export const getBreadcrumbs = (pathname: string): NavigationItem[] => {
  const currentItem = getCurrentNavItem(pathname);
  const homeItem = navigationItems[0]; // Home is always first
  
  if (!currentItem || currentItem.path === '/') {
    return [homeItem];
  }
  
  return [homeItem, currentItem];
};
