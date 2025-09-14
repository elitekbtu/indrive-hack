import { Shield, AlertTriangle, Eye, Database, Globe, Smartphone, Settings, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const risks = [
  {
    icon: Eye,
    title: 'Приватность данных',
    description: 'Обработка персональных данных и изображений автомобилей',
    mitigation: 'Все номера на фото автоматически размываются, данные обрабатываются локально'
  },
  {
    icon: AlertTriangle,
    title: 'Предвзятость модели',
    description: 'Возможные перекосы из-за разного качества камер и условий съемки',
    mitigation: 'Аугментация данных и сбалансированный датасет для всех типов устройств'
  },
  {
    icon: Database,
    title: 'Качество данных',
    description: 'Зависимость точности от качества входных изображений',
    mitigation: 'Автоматическая проверка качества фото и запрос повторной съемки при необходимости'
  },
  {
    icon: Globe,
    title: 'Региональные особенности',
    description: 'Различия в типах загрязнений и повреждений в разных регионах',
    mitigation: 'Непрерывное обучение модели на локальных данных каждого региона'
  }
];

const nextSteps = [
  {
    icon: Database,
    title: 'Расширение датасета',
    description: 'Сбор данных для локальных условий (пыль, снег, специфические повреждения)',
    timeline: '1-2 месяца',
    priority: 'Высокий'
  },
  {
    icon: Smartphone,
    title: 'Многоклассовая классификация',
    description: 'Детализация степени загрязнения и типов повреждений',
    timeline: '2-3 месяца',
    priority: 'Средний'
  },
  {
    icon: Settings,
    title: 'API интеграция',
    description: 'Разработка RESTful API для встраивания в приложение inDrive',
    timeline: '1 месяц',
    priority: 'Критический'
  },
  {
    icon: Users,
    title: 'Пилотное тестирование',
    description: 'Запуск в ограниченном регионе с обратной связью от пользователей',
    timeline: '1-2 месяца',
    priority: 'Высокий'
  }
];

const ethicsGuidelines = [
  {
    title: 'Прозрачность',
    description: 'Водители информированы о системе оценки и её критериях'
  },
  {
    title: 'Справедливость',
    description: 'Равные возможности для всех участников независимо от устройства и региона'
  },
  {
    title: 'Конфиденциальность',
    description: 'Минимизация сбора данных и защита персональной информации'
  },
  {
    title: 'Подотчетность',
    description: 'Возможность обжалования решений и ручная проверка спорных случаев'
  }
];

export default function RisksNextStepsSection() {
  return (
    <section id="risks-next-steps" className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Этика, ограничения и</span>{' '}
            <span className="text-gradient">взгляд в будущее</span>
          </h2>
          <p className="text-xl text-indrive-green-200 max-w-3xl mx-auto">
            Ответственный подход к разработке и четкий план развития решения
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Risks and Ethics */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Риски и этические аспекты</h3>
            </div>
            
            <div className="space-y-4 mb-8">
              {risks.map((risk, index) => {
                const IconComponent = risk.icon;
                return (
                  <Card key={index} className="border-yellow-500/30 bg-yellow-950/10 hover:bg-yellow-950/20 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-2">{risk.title}</h4>
                          <p className="text-indrive-green-200 text-sm mb-3">{risk.description}</p>
                          <div className="p-3 rounded-lg bg-indrive-green-950/30 border border-indrive-green-600/30">
                            <p className="text-sm text-indrive-green-300">
                              <span className="font-medium text-indrive-green-400">Митигация:</span> {risk.mitigation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Ethics Guidelines */}
            <Card className="border-indrive-green-600/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indrive-green-400" />
                  Этические принципы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ethicsGuidelines.map((guideline, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-indrive-green-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <h5 className="font-medium text-indrive-green-400">{guideline.title}</h5>
                        <p className="text-sm text-indrive-green-200">{guideline.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-indrive-green-500/20 border border-indrive-green-500/30">
                <Globe className="w-6 h-6 text-indrive-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Что дальше</h3>
            </div>
            
            <div className="space-y-4">
              {nextSteps.map((step, index) => {
                const IconComponent = step.icon;
                
                return (
                  <Card key={index} className="border-indrive-green-600/30 hover:border-indrive-green-500/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-indrive-green-500/20 border border-indrive-green-500/30 flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-indrive-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-white">{step.title}</h4>
                            <span className={
                              step.priority === 'Критический' 
                                ? 'text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30'
                                : step.priority === 'Высокий'
                                ? 'text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                : 'text-xs px-2 py-1 rounded-full bg-indrive-green-500/20 text-indrive-green-300 border border-indrive-green-500/30'
                            }>
                              {step.priority}
                            </span>
                          </div>
                          <p className="text-indrive-green-200 text-sm mb-3">{step.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-indrive-green-400 font-medium">Timeline:</span>
                            <span className="text-xs text-indrive-green-300">{step.timeline}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Integration */}
        <Card className="bg-gradient-to-r from-indrive-green-950/30 to-indrive-black-900/50 border-indrive-green-600/30">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-indrive-green-500/20 border border-indrive-green-500/30">
                <Settings className="w-6 h-6 text-indrive-green-400" />
              </div>
              <CardTitle className="text-2xl">Готовность к продуктовой интеграции</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Мы готовы предоставить полноценное решение для интеграции в экосистему inDrive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-indrive-green-500/20 border border-indrive-green-500/30 flex items-center justify-center mb-4">
                  <Settings className="w-8 h-8 text-indrive-green-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">RESTful API</h4>
                <p className="text-sm text-indrive-green-200">
                  Готовый API endpoint для интеграции в мобильное приложение
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-indrive-green-500/20 border border-indrive-green-500/30 flex items-center justify-center mb-4">
                  <Database className="w-8 h-8 text-indrive-green-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Масштабирование</h4>
                <p className="text-sm text-indrive-green-200">
                  Архитектура готова для обработки миллионов запросов в день
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-indrive-green-500/20 border border-indrive-green-500/30 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-indrive-green-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Поддержка</h4>
                <p className="text-sm text-indrive-green-200">
                  Полная техническая поддержка и continuous improvement
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
