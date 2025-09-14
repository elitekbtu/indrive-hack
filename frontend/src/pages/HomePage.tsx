import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Shield, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: 'Мгновенный анализ',
      description: 'Определение состояния автомобиля за секунды',
      path: '/demo'
    },
    {
      icon: Shield,
      title: 'Высокая точность',
      description: '94% точность в реальных условиях',
      path: '/results'
    },
    {
      icon: Star,
      title: 'Простая интеграция',
      description: 'Готовое API для inDrive платформы',
      path: '/process'
    },
    {
      icon: TrendingUp,
      title: 'Постоянное развитие',
      description: 'Планы улучшения и новые функции',
      path: '/roadmap'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-mesh">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full opacity-30">
            <div className="animate-pulse-slow bg-gradient-to-r from-indrive-green-600/20 to-transparent rounded-full w-96 h-96 blur-3xl"></div>
          </div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full opacity-20">
            <div className="animate-pulse-slow delay-1000 bg-gradient-to-l from-indrive-green-500/20 to-transparent rounded-full w-80 h-80 blur-3xl"></div>
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indrive-green-600/30 bg-indrive-green-950/50 backdrop-blur-sm mb-8">
              <Sparkles className="w-4 h-4 text-indrive-green-400" />
              <span className="text-sm text-indrive-green-300 font-medium">
                AI-powered решение для inDrive
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gradient">AI-контроль качества:</span>
              <br />
              <span className="text-white">
                повышаем доверие и безопасность
              </span>
              <br />
              <span className="text-indrive-green-400">
                в поездках с inDrive
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-indrive-green-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Наша ML-модель определяет состояние автомобиля по фотографии, 
              гарантируя что каждая поездка соответствует высоким стандартам сервиса
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="xl" 
                onClick={() => navigate('/demo')}
                className="group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Попробовать Демо
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indrive-green-600 to-indrive-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => navigate('/problem')}
              >
                Узнать больше
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">94%</div>
                <div className="text-indrive-green-300 text-sm">Точность модели</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">2</div>
                <div className="text-indrive-green-300 text-sm">Параметра анализа</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">&lt;3</div>
                <div className="text-indrive-green-300 text-sm">Секунды обработки</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Ключевые</span>{' '}
              <span className="text-gradient">возможности</span>
            </h2>
            <p className="text-xl text-indrive-green-200 max-w-3xl mx-auto">
              Современное решение для автоматизации контроля качества автомобилей
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group cursor-pointer hover:scale-105 transition-all duration-300 hover:border-indrive-green-500/50"
                  onClick={() => navigate(feature.path)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto rounded-lg bg-indrive-green-500/20 border border-indrive-green-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-indrive-green-400" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                    <div className="mt-4 flex items-center justify-center text-indrive-green-400 group-hover:text-indrive-green-300 transition-colors">
                      <span className="text-sm font-medium">Подробнее</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-indrive-black-900/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Готовы увидеть AI в действии?
          </h2>
          <p className="text-xl text-indrive-green-200 mb-8">
            Протестируйте нашу модель на реальных данных
          </p>
          <Button 
            size="xl" 
            onClick={() => navigate('/demo')}
            className="group"
          >
            <span className="flex items-center gap-2">
              Запустить демо
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
            </span>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
