
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, X } from 'lucide-react';
import { imageService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadFormProps {
  sessionId: string;
  onUploadComplete: (imageUrl: string) => void;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({
  sessionId,
  onUploadComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    
    // Clean up preview URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleUpload = async () => {
    if (!file || !sessionId) return;
    
    setIsUploading(true);
    try {
      const uploadResult = await imageService.upload(file, {
        entity_type: 'teaching_session',
        entity_id: sessionId,
        caption: caption || file.name
      });
      
      if (uploadResult && typeof uploadResult === 'object') {
        if (uploadResult.error) {
          throw new Error(uploadResult.error);
        }
        
        let imageUrl = '';
        if (uploadResult && uploadResult.path) {
          imageUrl = uploadResult.path;
        }
        
        toast({
          title: "Thành công",
          description: "Đã tải lên hình ảnh buổi học",
        });
        
        onUploadComplete(imageUrl);
        
        // Reset form
        setFile(null);
        setCaption('');
        setPreviewUrl(null);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải lên hình ảnh. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePreview = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors" onClick={() => document.getElementById('file-upload')?.click()}>
            {previewUrl ? (
              <div className="relative">
                <img src={previewUrl} alt="Preview" className="max-h-40 rounded" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePreview();
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Nhấn để chọn hình ảnh</p>
              </div>
            )}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          
          <div>
            <Input
              placeholder="Caption (tùy chọn)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? 'Đang tải lên...' : 'Tải lên'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploadForm;
