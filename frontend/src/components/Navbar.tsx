import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navigationItems } from '@/utils/navigation';
import { HeroPill } from '@/components/ui/hero-pill';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h2 className="font-bold text-gray-900 text-lg tracking-tight">AI Quality Control</h2>
              <p className="text-xs text-gray-600">inDrive Solution</p>
            </div>
          </div>

          {/* Hero Pill */}
          <div className="hidden md:block">
            <HeroPill 
              href="/demo"
              label="IndriveDecentathon 2025"
              announcement="🚀 AI Solution"
              className="mx-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={location.pathname === item.path ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavClick(item.path)}
                className={cn(
                  "flex items-center gap-2 transition-all duration-200",
                  location.pathname === item.path 
                    ? "bg-primary text-white shadow-md" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 py-4">
            <div className="flex flex-col gap-2">
              {/* Mobile Hero Pill */}
              <div className="mb-4">
                <HeroPill 
                  href="/demo"
                  label="IndriveDecentathon 2025"
                  announcement="🚀 AI"
                  className="mx-auto scale-90"
                />
              </div>
              
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleNavClick(item.path)}
                  className={cn(
                    "flex items-center gap-3 justify-start transition-all duration-200",
                    location.pathname === item.path 
                      ? "bg-primary text-white shadow-md" 
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <span className="text-base">{item.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs opacity-70">{item.description}</div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
