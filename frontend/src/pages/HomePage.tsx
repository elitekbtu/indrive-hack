import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { HeroPill } from '@/components/ui/hero-pill';
import { Particles } from '@/components/ui/particles';
import { Typewriter } from '@/components/ui/typewriter';
import OrbitingSkills from '@/components/ui/orbiting-skills';
import TestimonialSection from '@/components/ui/testimonials';
import VideoPlayer from '@/components/ui/video-player';

const HomePage = () => {
  const navigate = useNavigate();


  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden hero-gradient">
        {/* Particles Background */}
        <Particles 
          className="absolute inset-0"
          quantity={150}
          ease={80}
          color="#000000"
          refresh
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* HeroPill Badge */}
            <div className="mb-8">
              <HeroPill 
                href="/demo"
                label="IndriveDecentathon 2025"
                announcement=" AI Solution"
                className="mx-auto"
              />
            </div>

            {/* Main heading with Typewriter */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              <span className="text-gradient">AI-контроль качества:</span>
              <br />
              <span className="text-foreground">повышаем </span>
              <Typewriter
                text={[
                  "доверие и безопасность",
                  "качество сервиса", 
                  "удобство поездок",
                  "надежность платформы"
                ]}
                speed={80}
                className="text-primary"
                waitTime={2000}
                deleteSpeed={50}
                cursorChar="_"
              />
              <br />
              <span className="text-primary">
                в поездках с inDrive
              </span>
            </h1>

            

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <RainbowButton 
                onClick={() => navigate('/demo')}
                className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Попробовать Демо
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </RainbowButton>
              
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => navigate('/demo')}
                className="border-border hover:bg-secondary"
              >
                Подробнее о технологии
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center p-6 rounded-2xl glass-card">
                <div className="text-4xl font-bold text-gradient mb-2">83.4%</div>
                <div className="text-muted-foreground text-sm font-medium">Точность модели</div>
              </div>
              <div className="text-center p-6 rounded-2xl glass-card">
                <div className="text-4xl font-bold text-gradient mb-2">7</div>
                <div className="text-muted-foreground text-sm font-medium">Типов анализа</div>
              </div>
              <div className="text-center p-6 rounded-2xl glass-card">
                <div className="text-4xl font-bold text-gradient mb-2">&lt;2</div>
                <div className="text-muted-foreground text-sm font-medium">Секунды обработки</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              <span className="text-foreground">AI в</span>{' '}
              <span className="text-gradient">действии</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Посмотрите как наша технология работает в реальном времени
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
          
            
            {/* Основной видеоплеер */}
            <VideoPlayer 
              src="/denetrathon.mp4"
              title="Демонстрация AI-анализа"
              description="Загрузка фото → AI обработка → Результат анализа"
            />
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <OrbitingSkills />
        
        {/* CTA Button */}
        <div className="container mx-auto max-w-4xl text-center mt-16">
          <RainbowButton 
            onClick={() => navigate('/demo')}
            className="group shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg"
          >
            <span className="flex items-center gap-2">
              Протестировать AI-анализ
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
            </span>
          </RainbowButton>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
