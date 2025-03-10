
import React from 'react';
import { Image } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface ImageDetailViewProps {
  image: Image;
}

const ImageDetailView: React.FC<ImageDetailViewProps> = ({ image }) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          {image.image ? (
            <div className="relative rounded-md overflow-hidden">
              <img 
                src={image.image} 
                alt={image.caption || image.ten_anh}
                className="w-full object-contain max-h-[500px]"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-64 bg-muted rounded-md">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">{image.ten_anh}</h2>
            {image.caption && (
              <p className="text-muted-foreground">{image.caption}</p>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Entity Type:</span>
              <p>{image.doi_tuong}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-muted-foreground">Entity ID:</span>
              <p>{image.doi_tuong_id}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-muted-foreground">Created At:</span>
              <p>{formatDate(image.tg_tao || image.created_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetailView;
