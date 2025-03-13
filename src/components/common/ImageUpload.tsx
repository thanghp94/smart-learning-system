
import React, { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  url?: string;
  value?: string;
  onUpload: (url: string) => void;
  onChange?: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  entityType?: string;
  entityId?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  url, 
  value,
  onUpload,
  onChange,
  onRemove, 
  disabled = false,
  entityType,
  entityId
}) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const imageUrl = url || value;
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setIsUploading(true);
      
      // In a real implementation, this would upload to a server
      // Here we're simulating an upload by creating a local URL
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      
      // Notify parent component
      onUpload(fileUrl);
      if (onChange) onChange(fileUrl);
      
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="relative h-40 w-full border border-dashed rounded-md overflow-hidden">
      {imageUrl ? (
        <div className="relative w-full h-full">
          <img 
            src={imageUrl} 
            alt="Uploaded" 
            className="w-full h-full object-cover"
          />
          
          {!disabled && onRemove && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
              <Button variant="destructive" size="sm" onClick={onRemove}>
                Remove
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
          <div className="text-center">
            <ImagePlus size={24} className="mx-auto mb-2" />
            <p className="text-xs text-gray-500">Upload an image</p>
          </div>
          
          {!disabled && (
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
              disabled={isUploading || disabled}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
