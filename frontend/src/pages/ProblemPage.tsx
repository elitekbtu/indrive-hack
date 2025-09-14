import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProblemValueSection from '@/components/ProblemValueSection';

const ProblemPage = () => {
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
            onClick={() => navigate('/process')}
            className="flex items-center gap-2"
          >
            Как это работает
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">Проблемы и</span>{' '}
            <span className="text-gradient">решения</span>
          </h1>
          <p className="text-xl text-indrive-green-200 max-w-3xl mx-auto">
            Анализ текущих вызовов индустрии и того, как наше AI-решение 
            создает значимую ценность для всех участников экосистемы inDrive.
          </p>
        </div>
      </div>

      {/* Problem Value Section */}
      <ProblemValueSection />

      {/* Additional Context */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Почему это важно для inDrive?
            </h2>
            <p className="text-lg text-indrive-green-200 max-w-4xl mx-auto">
              В условиях растущей конкуренции на рынке поездок, качество сервиса становится ключевым дифференциатором. 
              Наше решение помогает inDrive поддерживать высокие стандарты качества автоматически.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-indrive-green-500/20 border border-indrive-green-500/30 flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Фокус на качество</h3>
              <p className="text-indrive-green-200">
                Автоматический контроль состояния автомобилей повышает общий уровень сервиса и доверие пользователей.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-indrive-green-500/20 border border-indrive-green-500/30 flex items-center justify-center mb-6">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Масштабируемость</h3>
              <p className="text-indrive-green-200">
                AI-решение может обрабатывать миллионы фотографий в день, что критично для глобальной платформы.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-indrive-green-500/20 border border-indrive-green-500/30 flex items-center justify-center mb-6">
                <span className="text-3xl">🔮</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Будущее</h3>
              <p className="text-indrive-green-200">
                Основа для дальнейшего развития AI-сервисов: от анализа безопасности до предиктивного обслуживания.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button 
              size="lg"
              onClick={() => navigate('/demo')}
              className="group"
            >
              <span className="flex items-center gap-2">
                Посмотреть решение в действии
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProblemPage
