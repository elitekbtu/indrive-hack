import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalysisResult {
  is_damaged?: boolean;
  damage_source?: string;
  damage_local?: unknown;
  rust_scratch?: unknown;
  damage_parts_local?: unknown;
  dirty?: unknown;
  error?: string;
  details?: string;
}

interface EndpointOption {
  value: string;
  label: string;
  description: string;
}

export default function DemoInterface() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('analyze');

  const endpointOptions: EndpointOption[] = [
    {
      value: 'analyze',
      label: 'Comprehensive Analysis',
      description: 'Full analysis with damage detection, parts localization, and type classification'
    },
    {
      value: 'analyze-comprehensive',
      label: 'LLM-Powered Analysis',
      description: 'Advanced analysis with AI-generated reports for drivers, passengers, and business'
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
      setAnalysisResult(data);
    } catch (e) {
      setAnalysisResult({ error: 'Request failed', details: String(e) });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Examples removed; analyze works only with uploaded files

  const resetDemo = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  // Status helpers removed; raw JSON is displayed instead

  return (
    <section id="demo-section" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Наше решение</span>{' '}
            <span className="text-white">в действии</span>
          </h2>
          <p className="text-xl text-indrive-green-200 max-w-3xl mx-auto">
            Загрузите фотографию автомобиля и получите мгновенный анализ его состояния
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
                      className="w-full"
                      size="lg"
                    >
                      {endpointOptions.find(opt => opt.value === selectedEndpoint)?.label || 'Анализировать состояние'}
                    </Button>
                  )}
                  
                  {isAnalyzing && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-indrive-green-300">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>AI анализирует состояние... Пожалуйста, подождите</span>
                      </div>
                    </div>
                  )}
                  
                  {analysisResult && (
                    <Button 
                      onClick={resetDemo} 
                      variant="outline" 
                      className="w-full"
                      size="lg"
                    >
                      Сбросить
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Результаты анализа</CardTitle>
              <CardDescription>
                Результаты от POST /{selectedEndpoint}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!analysisResult ? (
                <div className="text-center py-12 text-indrive-green-400">
                  <p>Загрузите изображение и нажмите «Анализировать состояние»</p>
                </div>
              ) : (
                <div className="p-4 rounded-lg border border-indrive-green-700 bg-indrive-black-800/50 overflow-auto">
                  <pre className="text-sm text-indrive-green-200 whitespace-pre-wrap break-words">
{JSON.stringify(analysisResult, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
      </div>
    </section>
  );
}
