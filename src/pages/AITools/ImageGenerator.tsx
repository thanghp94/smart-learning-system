
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ImageIcon, Upload, Wand2, Download, RotateCw, ImagePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/common/PageHeader';

// Sample style options
const styleOptions = [
  { value: 'realistic', label: 'Chân thực' },
  { value: 'cartoon', label: 'Hoạt hình' },
  { value: 'anime', label: 'Anime' },
  { value: 'pixar', label: 'Pixar' },
  { value: 'watercolor', label: 'Màu nước' },
  { value: 'oil_painting', label: 'Sơn dầu' },
  { value: 'digital_art', label: 'Digital Art' },
  { value: '3d_render', label: '3D Render' },
  { value: 'pixel_art', label: 'Pixel Art' },
  { value: 'comic_book', label: 'Truyện tranh' },
];

// Placeholder images
const placeholderResults = [
  'https://images.unsplash.com/photo-1639691375901-1f5ed3e380a3?q=80&w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1665991947192-a63451f34c90?q=80&w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1682685797743-3a7b6b8d93e5?q=80&w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1673208979491-d7bc10e58da7?q=80&w=500&auto=format&fit=crop',
];

const ImageGenerator = () => {
  const [activeTab, setActiveTab] = useState('text-to-image');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [guidance, setGuidance] = useState([7]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (activeTab === 'text-to-image' && !prompt) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mô tả để tạo hình ảnh",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === 'image-to-image' && !uploadedImage) {
      toast({
        title: "Lỗi",
        description: "Vui lòng tải lên một hình ảnh",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call an API endpoint
      // For this demo, we'll simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use placeholder images instead of real generation
      setGeneratedImages(placeholderResults);
      
      toast({
        title: "Thành công",
        description: "Đã tạo hình ảnh thành công",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo hình ảnh. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-image-${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Tải xuống thành công",
      description: "Hình ảnh đã được tải xuống"
    });
  };

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Tạo Hình Ảnh AI"
        description="Sử dụng AI để tạo hình ảnh từ mô tả hoặc biến đổi hình ảnh có sẵn"
      />
      
      <Tabs defaultValue="text-to-image" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text-to-image">Văn bản sang Hình ảnh</TabsTrigger>
          <TabsTrigger value="image-to-image">Biến đổi Hình ảnh</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text-to-image" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nhập mô tả</CardTitle>
              <CardDescription>
                Mô tả chi tiết hình ảnh bạn muốn tạo. Càng chi tiết càng tốt.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Mô tả hình ảnh</Label>
                <Textarea
                  id="prompt"
                  placeholder="Ví dụ: Một con mèo đang ngồi trên ghế, phong cách hoạt hình Pixar, màu sắc tươi sáng, độ phân giải cao"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="negative-prompt">Mô tả loại trừ (tùy chọn)</Label>
                <Textarea
                  id="negative-prompt"
                  placeholder="Các yếu tố bạn không muốn xuất hiện trong hình ảnh"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="style">Phong cách</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="style">
                      <SelectValue placeholder="Chọn phong cách" />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="guidance">Độ sáng tạo: {guidance[0]}</Label>
                  </div>
                  <Slider
                    id="guidance"
                    min={1}
                    max={15}
                    step={0.1}
                    value={guidance}
                    onValueChange={setGuidance}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Chính xác</span>
                    <span>Sáng tạo</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !prompt} 
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Tạo hình ảnh
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="image-to-image" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Biến đổi hình ảnh</CardTitle>
              <CardDescription>
                Tải lên hình ảnh và điều chỉnh phong cách để tạo biến thể mới
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label htmlFor="image-upload">Tải lên hình ảnh</Label>
                  <div 
                    className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-auto max-h-[200px] object-contain rounded-md"
                      />
                    ) : (
                      <>
                        <ImagePlus className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Nhấp để chọn hoặc kéo thả hình ảnh</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF (tối đa 5MB)</p>
                      </>
                    )}
                  </div>
                  <Input 
                    id="image-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image-prompt">Hướng dẫn thêm (tùy chọn)</Label>
                    <Textarea
                      id="image-prompt"
                      placeholder="Thêm mô tả để định hướng biến đổi hình ảnh"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image-style">Phong cách chuyển đổi</Label>
                    <Select defaultValue="cartoon">
                      <SelectTrigger id="image-style">
                        <SelectValue placeholder="Chọn phong cách" />
                      </SelectTrigger>
                      <SelectContent>
                        {styleOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !uploadedImage} 
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Đang biến đổi...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Biến đổi hình ảnh
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {generatedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kết quả tạo hình ảnh</CardTitle>
            <CardDescription>
              Chọn hình ảnh để xem chi tiết hoặc tải xuống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {generatedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image} 
                    alt={`Generated image ${index + 1}`} 
                    className="w-full h-auto rounded-md object-cover aspect-square"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => handleDownload(image)}
                      className="mr-2"
                    >
                      <Download className="h-4 w-4 mr-1" /> Tải xuống
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageGenerator;
