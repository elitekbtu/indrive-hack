import { Target, Zap, Award, BarChart3, PieChart, Activity, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const keyMetrics = [
  {
    metric: 'Accuracy',
    value: 94,
    description: 'Общая точность модели',
    icon: Target,
    benchmark: 79
  },
  {
    metric: 'F1-Score',
    value: 91,
    description: 'Сбалансированная метрика',
    icon: BarChart3,
    benchmark: 75
  },
  {
    metric: 'Precision',
    value: 93,
    description: 'Точность положительных предсказаний',
    icon: Zap,
    benchmark: 77
  },
  {
    metric: 'Recall',
    value: 89,
    description: 'Полнота обнаружения',
    icon: Activity,
    benchmark: 73
  }
];

const comparisonCases = [
  {
    title: 'Сложный случай: Царапина в тени',
    description: 'Поврежденный автомобиль в условиях плохого освещения',
    baseline: 'Ошибка',
    ourSolution: 'Правильно',
    confidence: 87,
    imageUrl: '/api/placeholder/300/200?text=Scratched+Car+Shadow'
  },
  {
    title: 'Грязь на темном кузове',
    description: 'Определение загрязнения на черном автомобиле',
    baseline: 'Ложное срабатывание',
    ourSolution: 'Правильно',
    confidence: 92,
    imageUrl: '/api/placeholder/300/200?text=Dirty+Black+Car'
  },
  {
    title: 'Отражения на чистом кузове',
    description: 'Различение отражений и реальных повреждений',
    baseline: 'Ложное срабатывание',
    ourSolution: 'Правильно',
    confidence: 89,
    imageUrl: '/api/placeholder/300/200?text=Clean+Car+Reflection'
  }
];

const performanceStats = [
  {
    title: 'Скорость обработки',
    value: '2.8',
    unit: 'сек',
    improvement: '+65%',
    icon: Zap
  },
  {
    title: 'Потребление памяти',
    value: '145',
    unit: 'МБ',
    improvement: '-40%',
    icon: PieChart
  },
  {
    title: 'Точность в сумерках',
    value: '89',
    unit: '%',
    improvement: '+22%',
    icon: Target
  },
  {
    title: 'Работа с размытием',
    value: '91',
    unit: '%',
    improvement: '+18%',
    icon: Activity
  }
];

export default function ResultsMetricsSection() {
  return (
    <section id="results-metrics" className="py-20 px-6 bg-gradient-to-b from-indrive-black-900/30 to-transparent">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Точность, которой</span>{' '}
            <span className="text-gradient">можно доверять</span>
          </h2>
          <p className="text-xl text-indrive-green-200 max-w-3xl mx-auto">
            Наша модель превосходит стандартные решения и показывает высокую эффективность в реальных условиях
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {keyMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="text-center hover:scale-105 transition-transform">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-indrive-green-500/20 border border-indrive-green-500/30 flex items-center justify-center mb-3">
                    <IconComponent className="w-6 h-6 text-indrive-green-400" />
                  </div>
                  <CardTitle className="text-lg">{metric.metric}</CardTitle>
                  <CardDescription className="text-sm">{metric.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-gradient mb-2">
                    {metric.value}%
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-indrive-green-300">
                      <span>Baseline</span>
                      <span>Наша модель</span>
                    </div>
                    <div className="relative h-2 bg-indrive-black-800 rounded-full overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-red-500/60 rounded-full"
                        style={{ width: `${metric.benchmark}%` }}
                      ></div>
                      <div 
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-indrive-green-600 to-indrive-green-400 rounded-full"
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-indrive-green-400 font-medium">
                      +{metric.value - metric.benchmark}% улучшение
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Comparison Cases */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-white">
            Сравнение с Baseline на сложных случаях
          </h3>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {comparisonCases.map((case_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={case_.imageUrl} 
                    alt={case_.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-indrive-green-500/20 backdrop-blur-sm border border-indrive-green-500/30">
                    <span className="text-xs text-indrive-green-300">
                      {case_.confidence}% уверенности
                    </span>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{case_.title}</CardTitle>
                  <CardDescription>{case_.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-indrive-green-300 mb-1">Baseline</div>
                      <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                        {case_.baseline}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-indrive-green-300 mb-1">Наше решение</div>
                      <div className="px-3 py-1 rounded-full bg-indrive-green-500/20 border border-indrive-green-500/30 text-indrive-green-300 text-sm flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {case_.ourSolution}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Performance Improvements */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-white">
            Преимущества в производительности
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <IconComponent className="w-8 h-8 text-indrive-green-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                      <span className="text-lg text-indrive-green-300 ml-1">{stat.unit}</span>
                    </div>
                    <div className="text-sm text-indrive-green-200 mb-2">{stat.title}</div>
                    <div className="text-xs font-medium text-indrive-green-400 bg-indrive-green-500/20 rounded-full px-2 py-1 border border-indrive-green-500/30">
                      {stat.improvement} быстрее
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Validation Summary */}
        <Card className="bg-gradient-to-r from-indrive-green-950/30 to-indrive-black-900/50 border-indrive-green-600/30">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-indrive-green-500/20 border border-indrive-green-500/30">
                <Award className="w-6 h-6 text-indrive-green-400" />
              </div>
              <CardTitle className="text-2xl">Валидация и тестирование</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-white mb-4">Набор данных</h4>
                <ul className="space-y-2 text-indrive-green-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indrive-green-400 flex-shrink-0" />
                    50,000+ размеченных изображений
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indrive-green-400 flex-shrink-0" />
                    Различные условия освещения
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indrive-green-400 flex-shrink-0" />
                    Разные типы автомобилей
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indrive-green-400 flex-shrink-0" />
                    Кросс-валидация (5-fold)
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Условия тестирования</h4>
                <ul className="space-y-2 text-indrive-green-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indrive-green-400 flex-shrink-0" />
                    Реальные данные из приложения
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indrive-green-400 flex-shrink-0" />
                    A/B тестирование с baseline
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indrive-green-400 flex-shrink-0" />
                    Стресс-тесты производительности
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indrive-green-400 flex-shrink-0" />
                    Проверка на edge cases
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
