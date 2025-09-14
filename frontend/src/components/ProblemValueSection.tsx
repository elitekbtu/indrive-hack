import { Shield, Star, Bell, TrendingUp, Users, Clock, Target, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const problems = [
  {
    icon: Shield,
    title: 'Безопасность пассажиров',
    description: 'Повреждения автомобиля могут влиять на безопасность поездки',
    impact: 'Критично'
  },
  {
    icon: Users,
    title: 'Опыт пользователей',
    description: 'Грязные или поврежденные автомобили снижают доверие к сервису',
    impact: 'Высоко'
  },
  {
    icon: Clock,
    title: 'Ручной контроль',
    description: 'Проверка состояния автомобилей требует много времени и ресурсов',
    impact: 'Операционно'
  },
  {
    icon: Target,
    title: 'Субъективность оценки',
    description: 'Человеческий фактор в оценке состояния автомобиля',
    impact: 'Качество'
  }
];

const values = [
  {
    icon: Shield,
    title: 'Повышение безопасности',
    description: 'Автоматическое выявление повреждений, которые могут повлиять на безопасность поездки',
    benefit: '+25% снижение инцидентов'
  },
  {
    icon: Star,
    title: 'Рост качества сервиса',
    description: 'Пассажиры получают чистые и опрятные автомобили, что повышает лояльность',
    benefit: '+30% улучшение рейтинга'
  },
  {
    icon: Bell,
    title: 'Ценность для водителей',
    description: 'Автоматические напоминания о необходимости мойки или своевременного ремонта',
    benefit: 'Проактивные уведомления'
  },
  {
    icon: TrendingUp,
    title: 'Система качества',
    description: 'Данные для внутреннего рейтинга водителей и автоматизации контроля качества',
    benefit: 'Автоматизация процессов'
  }
];

export default function ProblemValueSection() {
  return (
    <section id="problem-value" className="py-20 px-6 bg-gradient-to-b from-transparent to-indrive-black-900/30">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Зачем это нужно</span>{' '}
            <span className="text-gradient">inDrive?</span>
          </h2>
          <p className="text-xl text-indrive-green-200 max-w-3xl mx-auto">
            Решаем реальные проблемы и создаем значимую ценность для всех участников экосистемы
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Problems */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30">
                <Target className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Проблемы, которые мы решаем</h3>
            </div>
            
            <div className="space-y-4">
              {problems.map((problem, index) => {
                const IconComponent = problem.icon;
                return (
                  <Card key={index} className="border-red-500/30 bg-red-950/20 hover:bg-red-950/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">{problem.title}</h4>
                            <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                              {problem.impact}
                            </span>
                          </div>
                          <p className="text-indrive-green-200 text-sm">{problem.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Solutions/Values */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-indrive-green-500/20 border border-indrive-green-500/30">
                <Award className="w-6 h-6 text-indrive-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Ценность нашего решения</h3>
            </div>
            
            <div className="space-y-4">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card key={index} className="border-indrive-green-500/30 bg-indrive-green-950/20 hover:bg-indrive-green-950/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-indrive-green-500/20 border border-indrive-green-500/30 flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-indrive-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">{value.title}</h4>
                            <span className="text-xs px-2 py-1 rounded-full bg-indrive-green-500/20 text-indrive-green-300 border border-indrive-green-500/30">
                              {value.benefit}
                            </span>
                          </div>
                          <p className="text-indrive-green-200 text-sm">{value.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '2.5M+', label: 'Поездок в день', icon: Users },
            { value: '500K+', label: 'Активных водителей', icon: Shield },
            { value: '15%', label: 'Рост удовлетворенности', icon: Star },
            { value: '40%', label: 'Экономия времени', icon: Clock }
          ].map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <IconComponent className="w-8 h-8 text-indrive-green-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gradient mb-1">{metric.value}</div>
                  <div className="text-sm text-indrive-green-300">{metric.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
