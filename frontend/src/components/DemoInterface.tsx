import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type AnalysisJson = any;

export default function DemoInterface() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisJson | null>(null);

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
      const res = await fetch('/analyze/', {
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
                      Анализировать состояние
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
                Сырые результаты от POST /analyze
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
