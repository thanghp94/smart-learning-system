
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { AssetFormData } from '../schemas/assetSchema';
import ImageUpload from '@/components/common/ImageUpload';

interface ImageUploadFieldsProps {
  form: UseFormReturn<AssetFormData>;
  handleImageUpload: (url: string, field: keyof AssetFormData) => void;
}

const ImageUploadFields: React.FC<ImageUploadFieldsProps> = ({
  form,
  handleImageUpload
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="hinh_anh"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hình ảnh 1</FormLabel>
            <FormControl>
              <ImageUpload 
                value={field.value || ''} 
                onChange={(url) => handleImageUpload(url, 'hinh_anh')} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hinh_anh_2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hình ảnh 2</FormLabel>
            <FormControl>
              <ImageUpload 
                value={field.value || ''} 
                onChange={(url) => handleImageUpload(url, 'hinh_anh_2')} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ImageUploadFields;
