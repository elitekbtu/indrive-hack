import { Upload, Brain, CheckCircle, ArrowRight, Camera, Cpu, Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const steps = [
  {
    icon: Upload,
    title: 'Загрузка фото',
    description: 'Пользователь или система загружает фотографию автомобиля',
    details: [
      'Поддержка любых ракурсов',
      'Работа в разных условиях освещения',
      'Автоматическая предобработка'
    ],
    color: 'indrive-green-500'
  },
  {
    icon: Brain,
    title: 'AI-анализ',
    description: 'Наша модель классифицирует изображение по двум параметрам',
    details: [
      'Deep Learning архитектура',
      'Обучение на 50K+ изображений',
      'Специальная обработка сложных случаев'
    ],
    color: 'indrive-green-400'
  },
  {
    icon: CheckCircle,
    title: 'Готовый результат',
    description: 'Система получает четкий ответ и может принять действие',
    details: [
      'Уведомление водителю',
      'Предупреждение пассажира',
      'Обновление рейтинга'
    ],
    color: 'indrive-green-600'
  }
];

const techDetails = [
  {
    icon: Camera,
    title: 'Компьютерное зрение',
    description: 'Современные CNN архитектуры для анализа изображений',
    tech: 'ResNet-50, EfficientNet'
  },
  {
    icon: Cpu,
    title: 'Машинное обучение',
    description: 'Двухэтапная классификация с высокой точностью',
    tech: 'PyTorch, Transfer Learning'
  },
  {
    icon: Smartphone,
    title: 'Быстрая обработка',
    description: 'Оптимизация для мобильных устройств',
    tech: 'ONNX, TensorRT'
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">От фотографии до результата</span>{' '}
            <span className="text-gradient">за 3 шага</span>
          </h2>
          <p className="text-xl text-indrive-green-200 max-w-3xl mx-auto">
            Простой процесс, мощная технология под капотом
          </p>
        </div>

        {/* Main Steps */}
        <div className="relative mb-20">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indrive-green-600 via-indrive-green-400 to-indrive-green-600 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="h-full hover:scale-105 transition-transform duration-300">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-indrive-green-500/20 border-2 border-indrive-green-500 flex items-center justify-center mb-4">
                        <IconComponent className="w-8 h-8 text-indrive-green-400" />
                      </div>
                      <div className="text-sm font-semibold text-indrive-green-400 mb-2">
                        Шаг {index + 1}
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                      <CardDescription className="text-base">
                        {step.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center gap-3 text-sm text-indrive-green-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-indrive-green-400 flex-shrink-0"></div>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                      <div className="w-8 h-8 rounded-full bg-indrive-black-900 border-2 border-indrive-green-400 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-indrive-green-400" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Details */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-white">
            Техническая архитектура
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {techDetails.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <Card key={index} className="border-indrive-green-600/30">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-indrive-green-500/20 border border-indrive-green-500/30 flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-indrive-green-400" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">{tech.title}</h4>
                    <p className="text-indrive-green-200 text-sm mb-3">{tech.description}</p>
                    <span className="text-xs px-3 py-1 rounded-full bg-indrive-green-500/20 text-indrive-green-300 border border-indrive-green-500/30">
                      {tech.tech}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Process Visualization */}
        <Card className="bg-gradient-to-r from-indrive-black-900/50 to-indrive-green-950/20 border-indrive-green-600/30">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Детальный процесс анализа</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indrive-green-500/20 border border-indrive-green-500 flex items-center justify-center text-sm font-bold text-indrive-green-400">
                    1
                  </div>
                  <span className="text-indrive-green-200">Предварительная обработка изображения</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indrive-green-500/20 border border-indrive-green-500 flex items-center justify-center text-sm font-bold text-indrive-green-400">
                    2
                  </div>
                  <span className="text-indrive-green-200">Извлечение признаков через CNN</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indrive-green-500/20 border border-indrive-green-500 flex items-center justify-center text-sm font-bold text-indrive-green-400">
                    3
                  </div>
                  <span className="text-indrive-green-200">Двойная классификация (чистота + целостность)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indrive-green-500/20 border border-indrive-green-500 flex items-center justify-center text-sm font-bold text-indrive-green-400">
                    4
                  </div>
                  <span className="text-indrive-green-200">Вычисление уверенности и постобработка</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="relative">
                  <div className="w-48 h-32 mx-auto rounded-lg bg-gradient-to-r from-indrive-green-600/20 to-indrive-green-400/20 border border-indrive-green-500/30 flex items-center justify-center">
                    <Brain className="w-16 h-16 text-indrive-green-400 animate-pulse-slow" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indrive-green-500 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-sm text-indrive-green-300 mt-4">
                  Модель обрабатывает ~3 секунды
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
