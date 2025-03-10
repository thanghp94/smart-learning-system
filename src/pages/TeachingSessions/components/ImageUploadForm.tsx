
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { imageService } from '@/lib/supabase';
import { Spinner } from '@/components/ui/spinner';

interface ImageUploadFormProps {
  sessionId: string;
  onUploadComplete: (imageId: string, path: string) => void;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ 
  sessionId, 
  onUploadComplete 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Upload the image
      const uploadResult = await imageService.upload(formData);
      
      if (uploadResult) {
        // Create an entry in the images table
        const imageData = {
          doi_tuong: 'teaching_session',
          doi_tuong_id: sessionId,
          ten_anh: 'Session image',
          entity_type: 'teaching_session',
          entity_id: sessionId,
          file_name: uploadResult.path,
          url: uploadResult.publicUrl,
          mime_type: selectedFile.type,
          size: selectedFile.size,
          description: 'Session image'
        };
        
        const savedImage = await imageService.create(imageData);
        
        toast({
          title: "Upload thành công",
          description: "Hình ảnh đã được tải lên",
        });
        
        // Reset state
        setSelectedFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        // Notify parent component
        onUploadComplete(savedImage.id, uploadResult.publicUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Lỗi tải lên",
        description: "Đã xảy ra lỗi khi tải hình ảnh. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tải lên hình ảnh</CardTitle>
      </CardHeader>
      <CardContent>
        {imagePreview ? (
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-auto rounded-md max-h-[200px] object-contain bg-gray-100"
            />
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute top-2 right-2 h-8 w-8 bg-white hover:bg-red-50"
              onClick={clearSelection}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div 
            className="border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Chọn hoặc kéo thả hình ảnh vào đây</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF (tối đa 5MB)</p>
          </div>
        )}
        <Input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          variant="ghost" 
          onClick={clearSelection}
          disabled={!selectedFile || isUploading}
        >
          Hủy
        </Button>
        <Button 
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? (
            <>
              <Spinner className="mr-2" size="sm" /> Đang tải...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" /> Tải lên
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageUploadForm;
