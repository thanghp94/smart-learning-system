
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface FileInfo {
  file: File;
  name: string;
  size: number;
  type: string;
  extension: string;
}

interface FileUploaderProps {
  onFileSelected: (fileInfo: FileInfo) => void;
  accept?: string;
  label?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelected,
  accept = "*",
  label = "Upload File"
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setIsUploading(true);
      
      const file = e.target.files[0];
      const extension = file.name.split('.').pop() || '';
      
      const fileInfo: FileInfo = {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        extension
      };
      
      onFileSelected(fileInfo);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className="relative w-full h-10"
        disabled={isUploading}
      >
        <Upload className="h-4 w-4 mr-2" />
        {label}
        <input
          type="file"
          accept={accept}
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </Button>
    </div>
  );
};

export default FileUploader;
