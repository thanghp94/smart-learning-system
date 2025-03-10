
import React, { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  imageUrl?: string;
  onUpload: (url: string) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ imageUrl, onUpload, disabled = false }) => {
  const [isUploading, setIsUploading] = useState(false);
  
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
      
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="relative">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Uploaded" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
          <ImagePlus size={24} />
        </div>
      )}
      
      {!disabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageChange}
            disabled={isUploading || disabled}
          />
          <Button variant="secondary" size="sm" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Change'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
