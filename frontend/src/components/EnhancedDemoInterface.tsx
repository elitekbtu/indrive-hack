import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type ComprehensiveAnalysis = {
  technical_analysis: any;
  condition_score: number;
  reports: {
    driver: string;
    passenger: string;
    business: string;
  };
  recommendations: Array<{
    action: string;
    impact: string;
    priority: string;
  }>;
  metadata: any;
};

interface EndpointOption {
  value: string;
  label: string;
  description: string;
}

export default function EnhancedDemoInterface() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ComprehensiveAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'technical' | 'driver' | 'passenger' | 'business'>('driver');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('analyze-comprehensive');

  const endpointOptions: EndpointOption[] = [
    {
      value: 'analyze-comprehensive',
      label: 'LLM-Powered Analysis',
      description: 'Advanced analysis with AI-generated reports for drivers, passengers, and business'
    },
    {
      value: 'analyze',
      label: 'Comprehensive Analysis',
      description: 'Full analysis with damage detection, parts localization, and type classification'
    },
    {
      value: 'damage_local',
      label: 'Damage Detection',
      description: 'Binary classification: damaged vs intact'
    },
    {
      value: 'dirty_local',
      label: 'Cleanliness Check',
      description: 'Detect if the car is clean or dirty'
    },
    {
      value: 'rust_scratch_local',
      label: 'Damage Type Classification',
      description: 'Classify damage type: rust, scratch, dent, etc.'
    },
    {
      value: 'damage_parts_local',
      label: 'Damage Parts Localization',
      description: 'Identify which specific part of the car is damaged'
    }
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setSelectedFile(file);
      setAnalysisResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  });

  const runAnalyze = async () => {
    if (!selectedFile) return;
    try {
      setIsAnalyzing(true);
      setAnalysisResult(null);
      const form = new FormData();
      form.append('image', selectedFile);
      const res = await fetch(`/${selectedEndpoint}`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      
      // Handle different response formats
      if (selectedEndpoint === 'analyze-comprehensive') {
        setAnalysisResult(data);
        setActiveTab('driver'); // Default to driver view for comprehensive analysis
      } else {
        // For other endpoints, create a simplified result structure
        setAnalysisResult({
          technical_analysis: data,
          condition_score: data.is_damaged ? 60 : 90, // Simple scoring
          reports: {
            driver: `Результат анализа: ${JSON.stringify(data, null, 2)}`,
            passenger: `Техническая информация: ${JSON.stringify(data, null, 2)}`,
            business: `Данные для анализа: ${JSON.stringify(data, null, 2)}`
          },
          recommendations: [],
          metadata: { endpoint: selectedEndpoint }
        });
        setActiveTab('technical'); // Default to technical view for other endpoints
      }
    } catch (e) {
      setAnalysisResult({
        technical_analysis: { error: 'Request failed', details: String(e) },
        condition_score: 0,
        reports: {
          driver: 'Анализ временно недоступен',
          passenger: 'Техническая ошибка',
          business: 'Сервис недоступен'
        },
        recommendations: [],
        metadata: { endpoint: selectedEndpoint }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetDemo = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setActiveTab('driver');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (score >= 60) return <Star className="w-5 h-5 text-yellow-400" />;
    return <AlertTriangle className="w-5 h-5 text-red-400" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'высокий': return 'bg-red-500';
      case 'средний': return 'bg-yellow-500';
      case 'низкий': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section id="demo-section" className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Умный анализ</span>{' '}
            <span className="text-white">автомобилей</span>
          </h2>
          <p className="text-xl text-indrive-green-200 max-w-3xl mx-auto">
            AI-powered система комплексной оценки состояния автомобиля с персонализированными отчетами для всех участников
          </p>
        </div>

        {/* Endpoint Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Выберите тип анализа</CardTitle>
            <CardDescription>
              Выберите нужный тип анализа для вашего изображения
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {endpointOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedEndpoint === option.value
                        ? 'border-indrive-green-400 bg-indrive-green-950/30'
                        : 'border-indrive-green-700 hover:border-indrive-green-600'
                    }`}
                    onClick={() => setSelectedEndpoint(option.value)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-indrive-green-200">
                        {option.label}
                      </h3>
                      {selectedEndpoint === option.value && (
                        <div className="w-3 h-3 rounded-full bg-indrive-green-400"></div>
                      )}
                    </div>
                    <p className="text-sm text-indrive-green-400">
                      {option.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Upload Area */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Загрузка изображения</CardTitle>
              <CardDescription>
                Перетащите фото или выберите файл (JPG, PNG, до 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!previewUrl ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-indrive-green-400 bg-indrive-green-950/30' 
                      : 'border-indrive-green-600 hover:border-indrive-green-500'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-indrive-green-400 mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-indrive-green-300">Отпустите файл здесь...</p>
                  ) : (
                    <>
                      <p className="text-indrive-green-300 mb-2">
                        Перетащите фото автомобиля сюда
                      </p>
                      <p className="text-sm text-indrive-green-500">
                        или нажмите для выбора файла
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Uploaded" 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={resetDemo}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {!isAnalyzing && !analysisResult && (
                    <Button 
                      onClick={runAnalyze}
                      disabled={!selectedFile}
                      className="w-full bg-gradient-to-r from-indrive-green-500 to-indrive-green-400 hover:from-indrive-green-600 hover:to-indrive-green-500"
                      size="lg"
                    >
                      🚀 {endpointOptions.find(opt => opt.value === selectedEndpoint)?.label || 'Запустить анализ'}
                    </Button>
                  )}
                  
                  {isAnalyzing && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-indrive-green-300">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>AI анализирует состояние... Генерируем отчеты</span>
                      </div>
                      <Progress value={66} className="w-full" />
                    </div>
                  )}
                  
                  {analysisResult && (
                    <Button 
                      onClick={resetDemo} 
                      variant="outline" 
                      className="w-full"
                      size="lg"
                    >
                      Новый анализ
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Condition Score & Quick Stats */}
          {analysisResult && (
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getScoreIcon(analysisResult.condition_score)}
                  Общая оценка состояния
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className={`text-6xl font-bold ${getScoreColor(analysisResult.condition_score)} mb-2`}>
                    {analysisResult.condition_score}
                  </div>
                  <div className="text-lg text-indrive-green-200">из 100 баллов</div>
                  <Progress 
                    value={analysisResult.condition_score} 
                    className="w-full mt-4"
                  />
                </div>
                
                {/* Quick indicators */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-indrive-black-800/50">
                    <div className="text-sm text-indrive-green-400">Повреждения</div>
                    <div className={`font-semibold ${
                      analysisResult.technical_analysis?.is_damaged ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {analysisResult.technical_analysis?.is_damaged ? 'Обнаружены' : 'Отсутствуют'}
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-indrive-black-800/50">
                    <div className="text-sm text-indrive-green-400">Состояние</div>
                    <div className={`font-semibold ${getScoreColor(analysisResult.condition_score)}`}>
                      {analysisResult.condition_score >= 80 ? 'Отличное' : 
                       analysisResult.condition_score >= 60 ? 'Хорошее' : 'Требует внимания'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results with Tabs */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 bg-indrive-black-800/50 p-2 rounded-lg">
              {[
                { key: 'driver', label: '🚗 Для водителя', color: 'text-blue-400' },
                { key: 'passenger', label: '👥 Для пассажира', color: 'text-green-400' },
                { key: 'business', label: '📊 Бизнес-анализ', color: 'text-purple-400' },
                { key: 'technical', label: '⚙️ Техническое', color: 'text-gray-400' }
              ].map(tab => (
                <Button
                  key={tab.key}
                  variant={activeTab === tab.key ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`${activeTab === tab.key ? 'bg-indrive-green-600' : ''} ${tab.color}`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="grid gap-6">
              {activeTab === 'driver' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-400">Отчет для водителя</CardTitle>
                    <CardDescription>Персональные рекомендации для повышения заработка</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-indrive-green-200 leading-relaxed whitespace-pre-line">
                        {analysisResult.reports.driver}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'passenger' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-400">Информация для пассажира</CardTitle>
                    <CardDescription>Безопасность и комфорт поездки</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-indrive-green-200 leading-relaxed whitespace-pre-line">
                        {analysisResult.reports.passenger}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'business' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-purple-400">Бизнес-аналитика</CardTitle>
                    <CardDescription>Инсайты для управления качеством сервиса</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-indrive-green-200 leading-relaxed whitespace-pre-line">
                        {analysisResult.reports.business}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'technical' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-400">Техническая информация</CardTitle>
                    <CardDescription>Детальные результаты AI-анализа</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-lg border border-indrive-green-700 bg-indrive-black-800/50 overflow-auto">
                      <pre className="text-sm text-indrive-green-200 whitespace-pre-wrap break-words">
{JSON.stringify(analysisResult.technical_analysis, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recommendations */}
            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>💡 Рекомендации</CardTitle>
                  <CardDescription>Конкретные действия для улучшения состояния</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-indrive-black-800/30 border border-indrive-green-800">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(rec.priority)} mt-2 flex-shrink-0`}></div>
                        <div className="flex-1">
                          <div className="font-medium text-white mb-1">{rec.action}</div>
                          <div className="text-sm text-indrive-green-300">{rec.impact}</div>
                          <div className="text-xs text-indrive-green-500 mt-1">
                            Приоритет: {rec.priority}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </section>
  );
}