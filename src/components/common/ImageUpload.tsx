
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ImageUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  entityType: string;
  entityId: string;
  className?: string;
  onRemove?: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentUrl,
  onUpload,
  entityType,
  entityId,
  className,
  onRemove,
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
        {onRemove && (
          <button 
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
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
