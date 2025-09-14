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
