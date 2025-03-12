import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import ImageUpload from '@/components/common/ImageUpload';

interface ImageUploadFieldsProps {
  assetData: any;
  handleImageChange: (field: string, url: string) => void;
  handleRemoveImage: (field: string) => void;
  entityId: string;
  form?: UseFormReturn<any>;
  handleImageUpload: (url: string, field: string) => void;
}

const ImageUploadFields: React.FC<ImageUploadFieldsProps> = ({
  assetData,
  handleImageChange,
  handleRemoveImage,
  entityId,
  form,
  handleImageUpload,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label>Hình ảnh chính</Label>
        <div className="mt-2">
          <ImageUpload
            currentUrl={assetData.hinh_anh || ''}
            onUpload={(url) => handleImageChange('hinh_anh', url)}
            entityType="asset"
            entityId={entityId}
            onRemove={() => handleRemoveImage('hinh_anh')}
          />
        </div>
      </div>

      <div>
        <Label>Hình ảnh bổ sung</Label>
        <div className="mt-2">
          <ImageUpload
            currentUrl={assetData.hinh_anh_2 || ''}
            onUpload={(url) => handleImageChange('hinh_anh_2', url)}
            entityType="asset"
            entityId={entityId}
            onRemove={() => handleRemoveImage('hinh_anh_2')}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUploadFields;
