
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ImageUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  entityType: string;
  entityId: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentUrl,
  onUpload,
  entityType,
  entityId,
  className,
}) => {
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', entityType);
    formData.append('entityId', entityId);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onUpload(data.url);
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className={className}>
      <div className="relative w-32 h-32 mb-2">
        <img
          src={currentUrl || '/placeholder.svg'}
          alt="Uploaded"
          className="w-full h-full object-cover rounded-full border border-gray-200"
        />
      </div>
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
      <label htmlFor="image-upload">
        <Button asChild variant="outline" size="sm">
          <span>
            <Upload className="h-4 w-4 mr-2" />
            Tải ảnh lên
          </span>
        </Button>
      </label>
    </div>
  );
};

export default ImageUpload;
