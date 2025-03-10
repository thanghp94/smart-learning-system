
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { imageService } from '@/lib/supabase/image-service';
import { useToast } from '@/hooks/use-toast';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { storageService } from '@/lib/supabase/storage-service';

interface ImageUploadFormProps {
  entityType: string;
  entityId: string;
  onSuccess?: () => void;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({
  entityType,
  entityId,
  onSuccess
}) => {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    if (!data.image || !data.image[0]) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn hình ảnh để tải lên',
        variant: 'destructive'
      });
      return;
    }

    try {
      setUploading(true);
      const file = data.image[0];
      
      // Upload image to storage
      const uploadResult = await storageService.uploadFile(
        'images',
        `${entityType}/${entityId}/${Date.now()}_${file.name}`,
        file
      );
      
      // Check if uploadResult is a string or object with error property
      if (typeof uploadResult === 'object' && 'error' in uploadResult && uploadResult.error) {
        throw uploadResult.error;
      }
      
      // Get path from the result safely
      const path = typeof uploadResult === 'object' && 'path' in uploadResult 
        ? uploadResult.path 
        : uploadResult.toString();
      
      // Create image record in database
      const imageData = await imageService.create({
        caption: data.caption || '',
        doi_tuong: entityType,
        doi_tuong_id: entityId,
        ten_anh: file.name,
        image: path
      });
      
      toast({
        title: 'Thành công',
        description: 'Hình ảnh đã được tải lên',
      });
      
      reset();
      setImagePreview(null);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải lên hình ảnh',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image">Chọn hình ảnh</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          {...register('image', { required: true })}
          onChange={handleImageChange}
          className={errors.image ? 'border-red-500' : ''}
        />
        {errors.image && <p className="text-red-500 text-xs">Vui lòng chọn hình ảnh</p>}
      </div>

      {imagePreview && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Xem trước</p>
          <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="caption">Chú thích (không bắt buộc)</Label>
        <Textarea
          id="caption"
          placeholder="Nhập chú thích cho hình ảnh..."
          {...register('caption')}
        />
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        <Button type="submit" disabled={uploading}>
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tải lên...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Tải lên
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ImageUploadForm;
