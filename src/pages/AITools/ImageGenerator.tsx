
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase/client';
import { Wand2, Upload, Image as ImageIcon, Sparkles, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { imageService } from '@/lib/supabase/image-service';
import PageHeader from '@/components/common/PageHeader';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('cute');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const styles = [
    { id: 'cute', name: 'Cute', description: 'Cute cartoon style with vibrant colors' },
    { id: 'pixar', name: 'Pixar', description: '3D animation style similar to Pixar movies' },
    { id: 'anime', name: 'Anime', description: 'Japanese anime style with detailed characters' },
    { id: 'realistic', name: 'Realistic', description: 'Photorealistic rendering with details' },
    { id: 'watercolor', name: 'Watercolor', description: 'Soft watercolor painting effect' },
    { id: 'sketch', name: 'Sketch', description: 'Hand-drawn pencil sketch look' },
    { id: 'cyberpunk', name: 'Cyberpunk', description: 'Futuristic cyberpunk aesthetic with neon colors' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    if (!prompt) {
      toast({
        title: "Vui lòng nhập mô tả",
        description: "Hãy nhập mô tả hình ảnh bạn muốn tạo.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    setGeneratedImage(null);
    
    try {
      // This would be replaced with actual call to Supabase Edge Function
      // that will call an AI image generation API
      toast({
        title: "Đang tạo hình ảnh",
        description: "Vui lòng đợi trong giây lát...",
      });
      
      const enhancedPrompt = `${prompt}, in ${getStyleDescription(style)} style`;
      console.log("Generating with prompt:", enhancedPrompt);
      
      // Simulate API call
      setTimeout(() => {
        // For demo purposes we're using a placeholder image
        // In production, this would be the URL returned from the AI service
        const placeholderImage = `/placeholder.svg`;
        setGeneratedImage(placeholderImage);
        
        toast({
          title: "Tạo hình ảnh thành công",
          description: "Hình ảnh của bạn đã được tạo.",
        });
        setIsGenerating(false);
      }, 3000);
      
      // Actual API call would look something like this:
      /*
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: enhancedPrompt, style }
      });
      
      if (error) throw error;
      setGeneratedImage(data.imageUrl);
      */
      
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo hình ảnh. Vui lòng thử lại sau.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const transformImage = async () => {
    if (!uploadedImage) {
      toast({
        title: "Vui lòng tải lên một hình ảnh",
        description: "Hãy chọn một hình ảnh để biến đổi.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setGeneratedImage(null);
    
    try {
      toast({
        title: "Đang xử lý hình ảnh",
        description: "Vui lòng đợi trong giây lát...",
      });
      
      // In a real implementation, we would:
      // 1. Upload the image to Supabase Storage
      // 2. Call an Edge Function to process the image
      // 3. Return the processed image URL
      
      // Simulate API call
      setTimeout(() => {
        // For demo purposes we're using a placeholder image
        const placeholderImage = `/placeholder.svg`;
        setGeneratedImage(placeholderImage);
        
        toast({
          title: "Biến đổi hình ảnh thành công",
          description: `Hình ảnh đã được chuyển đổi sang phong cách ${getStyleName(style)}.`,
        });
        setIsUploading(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error transforming image:", error);
      toast({
        title: "Lỗi",
        description: "Không thể biến đổi hình ảnh. Vui lòng thử lại sau.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  const saveGeneratedImage = async () => {
    if (!generatedImage) return;
    
    toast({
      title: "Lưu hình ảnh",
      description: "Đang lưu hình ảnh vào thư viện...",
    });
    
    // In a real implementation, we would save the image to Supabase Storage
    // and create a record in the images table
    
    toast({
      title: "Lưu thành công",
      description: "Hình ảnh đã được lưu vào thư viện.",
    });
  };

  const getStyleName = (styleId: string) => {
    return styles.find(s => s.id === styleId)?.name || styleId;
  };
  
  const getStyleDescription = (styleId: string) => {
    const style = styles.find(s => s.id === styleId);
    if (!style) return styleId;
    return style.id;
  };

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        heading="Tạo Hình Ảnh AI"
        subheading="Tạo hình ảnh từ mô tả văn bản hoặc biến đổi hình ảnh hiện có"
      />
      
      <Tabs defaultValue="text-to-image" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="text-to-image">Tạo từ văn bản</TabsTrigger>
          <TabsTrigger value="image-to-image">Biến đổi hình ảnh</TabsTrigger>
          <TabsTrigger value="chat">Trò chuyện AI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text-to-image">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Mô tả hình ảnh</CardTitle>
                <CardDescription>Nhập mô tả chi tiết về hình ảnh bạn muốn tạo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Mô tả</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Ví dụ: Một chú mèo đang chơi đàn guitar trên bãi biển..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="style">Phong cách</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phong cách" />
                    </SelectTrigger>
                    <SelectContent>
                      {styles.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.name} - {style.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={generateImage} 
                  disabled={isGenerating || !prompt} 
                  className="w-full"
                >
                  {isGenerating ? 'Đang tạo...' : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Tạo hình ảnh
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Kết quả</CardTitle>
                <CardDescription>Hình ảnh được tạo ra sẽ hiển thị ở đây</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                {isGenerating ? (
                  <div className="h-[300px] w-full flex flex-col items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                    <p className="text-muted-foreground">Đang tạo hình ảnh...</p>
                  </div>
                ) : generatedImage ? (
                  <div className="space-y-4 w-full">
                    <div className="border rounded-lg overflow-hidden">
                      <img 
                        src={generatedImage} 
                        alt="Generated" 
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.open(generatedImage, '_blank')}
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Xem đầy đủ
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={saveGeneratedImage}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Lưu vào thư viện
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] w-full flex flex-col items-center justify-center border border-dashed rounded-lg">
                    <ImageIcon className="h-16 w-16 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Hình ảnh sẽ hiển thị ở đây</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="image-to-image">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tải lên hình ảnh</CardTitle>
                <CardDescription>Tải lên hình ảnh bạn muốn biến đổi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Label htmlFor="image-upload">Hình ảnh</Label>
                  
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col items-center justify-center border border-dashed rounded-lg p-4 h-[200px]">
                      {previewUrl ? (
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="max-h-full max-w-full object-contain" 
                        />
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Kéo và thả hình ảnh hoặc click để tải lên</p>
                        </>
                      )}
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Chọn hình ảnh
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transform-style">Phong cách biến đổi</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phong cách" />
                    </SelectTrigger>
                    <SelectContent>
                      {styles.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.name} - {style.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={transformImage} 
                  disabled={isUploading || !uploadedImage} 
                  className="w-full"
                >
                  {isUploading ? 'Đang xử lý...' : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Biến đổi hình ảnh
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Kết quả</CardTitle>
                <CardDescription>Hình ảnh sau khi biến đổi sẽ hiển thị ở đây</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                {isUploading ? (
                  <div className="h-[300px] w-full flex flex-col items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                    <p className="text-muted-foreground">Đang biến đổi hình ảnh...</p>
                  </div>
                ) : generatedImage ? (
                  <div className="space-y-4 w-full">
                    <div className="border rounded-lg overflow-hidden">
                      <img 
                        src={generatedImage} 
                        alt="Transformed" 
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.open(generatedImage, '_blank')}
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Xem đầy đủ
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={saveGeneratedImage}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Lưu vào thư viện
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] w-full flex flex-col items-center justify-center border border-dashed rounded-lg">
                    <ImageIcon className="h-16 w-16 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Hình ảnh sẽ hiển thị ở đây</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Trò chuyện với AI</CardTitle>
              <CardDescription>Sử dụng AI để trò chuyện và tạo nội dung</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 h-[400px] mb-4 overflow-y-auto flex flex-col">
                <div className="bg-secondary p-3 rounded-lg self-start max-w-[80%] mb-4">
                  <p className="text-sm">Xin chào! Tôi là trợ lý AI. Bạn cần tôi giúp gì hôm nay?</p>
                </div>
                <div className="bg-primary text-primary-foreground p-3 rounded-lg self-end max-w-[80%]">
                  <p className="text-sm">Tính năng chatGPT đang được phát triển. Vui lòng quay lại sau!</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Input placeholder="Nhập tin nhắn..." disabled />
                <Button disabled>Gửi</Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Tính năng này đang được phát triển và sẽ sớm được cập nhật.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Separator />
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Hình ảnh được tạo bởi AI có thể được sử dụng cho mục đích giáo dục và cá nhân.</p>
        <p>Vui lòng sử dụng có trách nhiệm và tuân thủ các quy định về bản quyền.</p>
      </div>
    </div>
  );
};

export default ImageGenerator;
