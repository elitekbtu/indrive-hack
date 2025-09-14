import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DemoInterface from '@/components/DemoInterface';

const DemoPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-8">
      {/* Header */}
      <div className="container mx-auto px-6 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>
        </div>
        
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Интерактивное</span>{' '}
            <span className="text-white">демо</span>
          </h1>
          <p className="text-xl text-indrive-green-200 max-w-3xl mx-auto">
            Протестируйте нашу AI-модель на реальных изображениях автомобилей. 
            Загрузите фото или выберите из готовых примеров.
          </p>
        </div>
      </div>

      {/* Demo Interface */}
      <DemoInterface />

      {/* Additional Info */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Как использовать демо</h3>
              <ul className="space-y-3 text-indrive-green-200">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indrive-green-500/20 border border-indrive-green-500 flex items-center justify-center text-sm font-bold text-indrive-green-400 flex-shrink-0">1</span>
                  <span>Загрузите изображение автомобиля (JPG, PNG до 10MB)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indrive-green-500/20 border border-indrive-green-500 flex items-center justify-center text-sm font-bold text-indrive-green-400 flex-shrink-0">2</span>
                  <span>Нажмите "Анализировать состояние" или выберите готовый пример</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indrive-green-500/20 border border-indrive-green-500 flex items-center justify-center text-sm font-bold text-indrive-green-400 flex-shrink-0">3</span>
                  <span>Получите результат анализа с указанием уверенности модели</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Что анализирует модель</h3>
              <ul className="space-y-3 text-indrive-green-200">
                <li className="flex items-start gap-3">
                  <span className="text-indrive-green-400">🧽</span>
                  <div>
                    <div className="font-medium text-white">Чистота автомобиля</div>
                    <div className="text-sm">Определение степени загрязнения кузова</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indrive-green-400">🔧</span>
                  <div>
                    <div className="font-medium text-white">Целостность кузова</div>
                    <div className="text-sm">Обнаружение царапин, вмятин и повреждений</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DemoPage;
