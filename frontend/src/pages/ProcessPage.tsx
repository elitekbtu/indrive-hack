import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HowItWorksSection from '@/components/HowItWorksSection';

const ProcessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-8">
      {/* Header */}
      <div className="container mx-auto px-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/results')}
            className="flex items-center gap-2"
          >
            Результаты
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Технический</span>{' '}
            <span className="text-white">процесс</span>
          </h1>
          <p className="text-xl text-indrive-green-200 max-w-3xl mx-auto">
            Подробный разбор архитектуры решения и технологического процесса 
            анализа изображений автомобилей.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <HowItWorksSection />
    </div>
  );
}

export default ProcessPage
