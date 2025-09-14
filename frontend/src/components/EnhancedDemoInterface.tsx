import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, Star, AlertTriangle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { AnimatedText } from '@/components/ui/animated-underline-text-one';
import AnalysisRadioGroup from '@/components/ui/analysis-radio-group';

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
  const [selectedPart, setSelectedPart] = useState<string>('damage_parts_local');
  const [outputType, setOutputType] = useState<string>('structured');

  const endpointOptions: EndpointOption[] = [
    {
      value: 'analyze-comprehensive',
      label: 'Полный анализ автомобиля',
      description: 'Комплексный анализ всего автомобиля с детальными отчетами для водителей, пассажиров и бизнеса'
    },
    {
      value: 'analyze',
      label: 'Анализ по частям',
      description: 'Специализированный анализ конкретных частей: царапины, окна, бампер, фары и другие элементы'
    }
  ];

  const partAnalysisOptions = [
    { value: 'damage_parts_local', label: 'Повреждения', description: 'Обнаружение царапин, вмятин, трещин' },
    { value: 'unified_windows_local', label: 'Окна', description: 'Состояние стекол и оконных рам' },
    { value: 'tire_classification_local', label: 'Шины', description: 'Состояние покрышек и дисков' },
    { value: 'dirty_local', label: 'Чистота', description: 'Уровень загрязнения автомобиля' }
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
      
      // Determine endpoint based on analysis type and output format
      let url;
      if (selectedEndpoint === 'analyze-comprehensive') {
        if (outputType === 'structured') {
          url = '/analyze-comprehensive';
        } else {
          url = '/analyze'; // Raw data goes to analyze endpoint
        }
      } else {
        // Use the selected part endpoint directly
        url = `/${selectedPart}`;
      }
      
      console.log('Making request to:', url);
      console.log('Selected endpoint:', selectedEndpoint);
      console.log('Selected part:', selectedPart);
      console.log('Output type:', outputType);
      
      const res = await fetch(url, {
        method: 'POST',
        body: form,
      });
      
      // Check if response is ok
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      // Get response text first to debug
      const responseText = await res.text();
      console.log('Response text:', responseText);
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      // Handle different response formats
      if (selectedEndpoint === 'analyze-comprehensive' && outputType === 'structured') {
        setAnalysisResult(data);
        setActiveTab('driver'); // Default to driver view for comprehensive analysis
      } else if (selectedEndpoint === 'analyze-comprehensive' && outputType === 'raw') {
        // Raw data from /analyze endpoint - create simplified structure
        setAnalysisResult({
          technical_analysis: data,
          condition_score: data.is_damaged ? 60 : 90, // Simple scoring
          reports: {
            driver: `Технические данные: ${JSON.stringify(data, null, 2)}`,
            passenger: `Технические данные: ${JSON.stringify(data, null, 2)}`,
            business: `Технические данные: ${JSON.stringify(data, null, 2)}`
          },
          recommendations: [],
          metadata: { endpoint: 'analyze', output_type: 'raw' }
        });
        setActiveTab('technical'); // Default to technical view for raw data
      } else {
        // For other endpoints (parts analysis), create a simplified result structure
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
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (score >= 60) return <Star className="w-5 h-5 text-yellow-500" />;
    return <AlertTriangle className="w-5 h-5 text-red-500" />;
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
  <section id="demo-section" className="pt-6 pb-12 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header with animated text */}
        <div className="text-center mb-12">
          <AnimatedText 
            text="ML-анализ автомобилей" 
            textClassName="text-5xl md:text-6xl font-bold text-gradient mb-4"
            underlineClassName="text-primary"
          />
          <p className="text-xl text-gray-600 mt-8">Протестируйте нашу AI-модель на реальных изображениях</p>
        </div>
        {/* Step 1: Analysis Type Selection */}
        <div className="mb-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3 justify-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</div>
              <h3 className="text-xl font-bold text-gray-900">Выберите тип анализа</h3>
            </div>
            
          </div>

          {/* Radio Group Selection */}
          <div className="mb-8">
            <AnalysisRadioGroup 
              selectedValue={selectedEndpoint}
              onValueChange={setSelectedEndpoint}
            />
          </div>

          {/* Output Type Selection - Only show when "Полный анализ" is selected */}
          {selectedEndpoint === 'analyze-comprehensive' && (
            <div className="mb-8">
              <div className="text-center mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Выберите тип отчета</h4>
                <p className="text-sm text-gray-600">Структурированный с описаниями или технические данные</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <button
                  onClick={() => setOutputType('structured')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    outputType === 'structured'
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm mb-1">Структурированный отчет</h5>
                    <p className="text-xs text-gray-600">Детальные отчеты для водителей, пассажиров и бизнеса с рекомендациями</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setOutputType('raw')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    outputType === 'raw'
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm mb-1">Технические данные</h5>
                    <p className="text-xs text-gray-600">Сырые данные анализа без обработки LLM</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Part Selection - Only show when "По частям" is selected */}
          {selectedEndpoint === 'analyze' && (
            <div className="mb-8">
              <div className="text-center mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Выберите часть для анализа</h4>
                <p className="text-sm text-gray-600">Укажите конкретную область автомобиля</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {partAnalysisOptions.map((part) => (
                   <button
                     key={part.value}
                     onClick={() => setSelectedPart(part.value)}
                     className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                       selectedPart === part.value
                         ? 'border-primary bg-primary/5 shadow-md'
                         : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                     }`}
                   >
                     <div>
                       <h5 className="font-semibold text-gray-900 text-sm mb-1">{part.label}</h5>
                       <p className="text-xs text-gray-600">{part.description}</p>
                     </div>
                   </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Step 2: Upload Area - Centered */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-4xl glass-card p-6 rounded-2xl">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  selectedEndpoint ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
                }`}>2</div>
                <h3 className="text-xl font-bold text-gray-900">Загрузка изображения</h3>
              </div>
              <p className="text-gray-600">
                Перетащите фото или выберите файл (JPG, PNG, до 10MB)
              </p>
            </div>
            
            {!previewUrl ? (
              <div
                {...getRootProps()}
                className={`relative overflow-hidden ${!selectedEndpoint ? 'pointer-events-none opacity-50' : ''}`}
              >
                <input {...getInputProps()} disabled={!selectedEndpoint} />
                <motion.div 
                  className={`
                    relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer 
                    transition-all duration-300 group overflow-hidden min-h-[400px] flex flex-col justify-center items-center
                    ${!selectedEndpoint 
                      ? 'border-gray-200 bg-gray-50' 
                      : isDragActive 
                        ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                        : 'border-gray-300 hover:border-primary hover:bg-primary/5 hover:shadow-md'
                    }
                  `}
                  whileHover={selectedEndpoint ? { scale: 1.02 } : {}}
                  whileTap={selectedEndpoint ? { scale: 0.98 } : {}}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Glowing effect */}
                  {isDragActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    />
                  )}
                  
                  <div className="relative z-10">
                    <motion.div
                      className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center shadow-xl"
                      animate={isDragActive ? { rotate: 360 } : {}}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    >
                      {isDragActive ? (
                        <ImageIcon className="w-8 h-8 text-white" />
                      ) : (
                        <Upload className="w-8 h-8 text-white" />
                      )}
                    </motion.div>
                    
                    {isDragActive ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-2"
                      >
                        <p className="text-lg font-semibold text-primary">Отпустите файл здесь!</p>
                        <div className="flex justify-center">
                          <motion.div
                            className="w-2 h-2 bg-primary rounded-full mx-1"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-primary rounded-full mx-1"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-primary rounded-full mx-1"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="space-y-3"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {!selectedEndpoint 
                            ? 'Сначала выберите тип анализа' 
                            : 'Перетащите фото автомобиля сюда'
                          }
                        </h3>
                        <p className="text-gray-600 group-hover:text-gray-700">
                          {!selectedEndpoint 
                            ? 'Выберите тип анализа выше, чтобы продолжить' 
                            : 'или нажмите для выбора файла'
                          }
                        </p>
                        <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3 group-hover:bg-white transition-colors">
                          <p> Поддерживаемые форматы: JPG, PNG, GIF</p>
                          <p> Максимальный размер: 10MB</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-primary/20 rounded-full group-hover:scale-150 transition-transform duration-300" />
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-green-500/20 rounded-full group-hover:scale-150 transition-transform duration-300 delay-100" />
                </motion.div>
              </div>
            ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Uploaded" 
                      className="w-full h-80 object-cover rounded-lg border border-gray-200"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={resetDemo}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>                {!isAnalyzing && !analysisResult && (
                  <Button 
                    onClick={runAnalyze}
                    disabled={!selectedFile}
                    className="w-full bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 text-white font-medium"
                    size="lg"
                  >
                    🚀 {endpointOptions.find(opt => opt.value === selectedEndpoint)?.label || 'Запустить анализ'}
                  </Button>
                )}
                
                {isAnalyzing && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span>Наша AI-модель анализирует состояние... Генерируем отчеты</span>
                    </div>
                    <Progress value={66} className="w-full" />
                  </div>
                )}
                
                {analysisResult && (
                  <Button 
                    onClick={resetDemo} 
                    variant="outline" 
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                    size="lg"
                  >
                    Новый анализ
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results with Tabs */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Score Card - Centered */}
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-md glass-card p-6 rounded-2xl">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3 justify-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">3</div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      {getScoreIcon(analysisResult.condition_score)}
                      Результаты анализа
                    </h3>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className={`text-6xl font-bold ${getScoreColor(analysisResult.condition_score)} mb-2`}>
                    {analysisResult.condition_score}
                  </div>
                  <div className="text-lg text-gray-600">из 100 баллов</div>
                  <Progress 
                    value={analysisResult.condition_score} 
                    className="w-full mt-4"
                  />
                </div>

                {/* Quick indicators */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-sm text-gray-600">Повреждения</div>
                    <div className={`font-semibold ${
                      analysisResult.technical_analysis?.is_damaged ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {analysisResult.technical_analysis?.is_damaged ? 'Обнаружены' : 'Отсутствуют'}
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-sm text-gray-600">Состояние</div>
                    <div className={`font-semibold ${getScoreColor(analysisResult.condition_score)}`}>
                      {analysisResult.condition_score >= 80 ? 'Отличное' : 
                       analysisResult.condition_score >= 60 ? 'Хорошее' : 'Требует внимания'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
              {[
                { key: 'driver', label: ' Для водителя', color: 'text-blue-600' },
                { key: 'passenger', label: ' Для пассажира', color: 'text-green-600' },
                { key: 'business', label: ' Бизнес-анализ', color: 'text-purple-600' },
                { key: 'technical', label: ' Техническое', color: 'text-gray-600' }
              ].map(tab => (
                <Button
                  key={tab.key}
                  variant={activeTab === tab.key ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`${activeTab === tab.key ? 'bg-primary text-white' : 'text-gray-700 hover:bg-white'} ${tab.color}`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="grid gap-6">
              {activeTab === 'driver' && (
                <div className="glass-card p-6 rounded-2xl">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-blue-600 mb-2">Отчет для водителя</h3>
                    <p className="text-gray-600">Персональные рекомендации для повышения заработка</p>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {analysisResult.reports.driver}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'passenger' && (
                <div className="glass-card p-6 rounded-2xl">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-green-600 mb-2">Информация для пассажира</h3>
                    <p className="text-gray-600">Безопасность и комфорт поездки</p>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {analysisResult.reports.passenger}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'business' && (
                <div className="glass-card p-6 rounded-2xl">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-purple-600 mb-2">Бизнес-аналитика</h3>
                    <p className="text-gray-600">Инсайты для управления качеством сервиса</p>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {analysisResult.reports.business}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'technical' && (
                <div className="glass-card p-6 rounded-2xl">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-600 mb-2">Техническая информация</h3>
                    <p className="text-gray-600">Детальные результаты анализа нашей модели</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 overflow-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words">
{JSON.stringify(analysisResult.technical_analysis, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations */}
            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
              <div className="glass-card p-6 rounded-2xl">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">💡 Рекомендации</h3>
                  <p className="text-gray-600">Конкретные действия для улучшения состояния</p>
                </div>
                <div className="space-y-4">
                  {analysisResult.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(rec.priority)} mt-2 flex-shrink-0`}></div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">{rec.action}</div>
                        <div className="text-sm text-gray-600">{rec.impact}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Приоритет: {rec.priority}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}