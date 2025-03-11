
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Image as ImageIcon, Download, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập yêu cầu để tạo hình ảnh',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tạo hình ảnh');
      }
      
      const data = await response.json();
      setGeneratedImages(prev => [...(data.imageUrls || []), ...prev]);
      
      toast({
        title: 'Thành công',
        description: 'Đã tạo hình ảnh thành công',
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể tạo hình ảnh',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-6 w-6" />
            Tạo hình ảnh với AI
          </CardTitle>
          <CardDescription>
            Sử dụng OpenAI để tạo hình ảnh từ mô tả bằng văn bản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium mb-1">
                Mô tả hình ảnh bạn muốn tạo
              </label>
              <Textarea
                id="prompt"
                placeholder="Ví dụ: Một phòng học hiện đại với nhiều học sinh đang học tập..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            
            <Button type="submit" disabled={isGenerating || !prompt.trim()}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo hình ảnh...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Tạo hình ảnh
                </>
              )}
            </Button>
          </form>
          
          {generatedImages.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Hình ảnh đã tạo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedImages.map((imageUrl, index) => (
                  <div key={index} className="relative group border rounded-md overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={`Generated image ${index + 1}`} 
                      className="w-full h-auto object-contain"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => handleDownload(imageUrl)}
                        className="mr-2"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Tải xuống
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setGeneratedImages([])}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Xóa tất cả
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageGenerator;
