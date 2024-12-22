import React, { useState, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

const App = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setPreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setDescription(data.description);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setDescription('Error analyzing image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Animated circles
  const AnimatedBackground = () => (
    <div className="fixed inset-0 -z-10 w-full">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br">
      <AnimatedBackground />
      <div className="w-full max-w-6xl p-4 md:p-6">
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl transition-all duration-300">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Image Content Analyzer
            </CardTitle>
            <p className="text-center text-gray-600">Freight Tiger Problem 2: Upload an image to analyze its content using AI</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-8">
              {/* Left side: Upload and Preview */}
              <div className="flex-1 space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <label 
                    className="w-full"
                    onDragEnter={() => setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files[0];
                      if (file && file.type.startsWith('image/')) {
                        const event = { target: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>;
                        handleFileSelect(event);
                      }
                    }}
                  >
                    <div className={`
                      border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                      transition-all duration-300 ease-in-out
                      ${isDragging 
                        ? 'border-purple-500 bg-purple-50 scale-105' 
                        : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                      }
                    `}>
                      <Upload className={`mx-auto h-12 w-12 transition-colors duration-300 ${isDragging ? 'text-purple-500' : 'text-gray-400'}`} />
                      <p className="mt-4 text-sm text-gray-600 font-medium">
                        Drop your image here, or click to browse
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        Supports PNG, JPG up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>

                {preview && (
                  <div className="mt-4 animate-fadeIn">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md">
                      <img
                        src={preview}
                        alt="Preview"
                        className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={analyzeImage}
                  disabled={!selectedFile || isLoading}
                  className={`w-full transition-all duration-300 ${
                    !selectedFile ? 'opacity-50' : 'hover:scale-105'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Analyze Image
                    </>
                  )}
                </Button>
              </div>

              {/* Right side: Analysis Results */}
              <div className="flex-1 border-l pl-8">
                <div className="h-full flex items-center justify-center">
                  {description ? (
                    <div className="w-full animate-fadeIn">
                      <h3 className="font-semibold mb-4 text-xl text-purple-700">
                        Analysis Result:
                      </h3>
                      <div className="p-6 bg-white/50 rounded-lg shadow-sm border border-purple-100">
                        <p className="text-gray-700 leading-relaxed">{description}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 animate-pulse">
                      <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p className="text-sm">Analysis results will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

export default App;