import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Particles } from '@/components/ui/particles';
import EnhancedDemoInterface from '@/components/EnhancedDemoInterface';

const DemoPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-mesh">
      {/* Particles Background */}
      <Particles 
        className="absolute inset-0"
        quantity={60}
        ease={80}
        color="#000000"
        refresh
      />
      
      {/* Header Section */}
  <div className="relative z-10 pt-6 pb-6">
        <div className="container mx-auto px-6">
          {/* Navigation */}
          <div className="flex items-center justify-start mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 hover:bg-gray-100/80 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Button>
          </div>
          
          {/* Hero Header */}
          <div className="text-center max-w-4xl mx-auto">
            
            
            
            {/* Removed descriptive paragraph per request */}
          </div>
        </div>
      </div>

      {/* Demo Interface - This is the main focus */}
      <div className="relative z-10">
        <EnhancedDemoInterface />
      </div>
    </div>
  );
};

export default DemoPage;