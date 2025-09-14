import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    demoSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-mesh">
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

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="xl" 
              onClick={scrollToDemo}
              className="group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Попробовать Демо
                <ArrowDown className="w-5 h-5 group-hover:animate-bounce" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indrive-green-600 to-indrive-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
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

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-indrive-green-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-indrive-green-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
