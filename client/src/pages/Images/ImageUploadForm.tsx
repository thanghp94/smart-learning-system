
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Image, X, Upload } from 'lucide-react';
import { Image as ImageType } from '@/lib/types';
import { imageService } from "@/lib/database";

interface ImageUploadFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  entityType?: string;
  entityId?: string;
}

const entityTypeOptions = [
  { label: 'Student', value: 'student' },
  { label: 'Class', value: 'class' },
  { label: 'Employee', value: 'employee' },
  { label: 'Event', value: 'event' },
  { label: 'Facility', value: 'facility' },
];

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ 
  onSuccess, 
  onCancel,
  entityType: initialEntityType,
  entityId: initialEntityId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ImageType>({
    defaultValues: {
      doi_tuong: initialEntityType || '',
      doi_tuong_id: initialEntityId || '',
      ten_anh: '',
      caption: ''
    }
  });
  
  const watchedEntityType = watch('doi_tuong');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    
    if (!file) {
      setSelectedFile(null);
      setImagePreview(null);
      return;
    }
    
    // Basic validation
    if (!file.type.includes('image')) {
      toast({
        title: 'Invalid File',
        description: 'Please select an image file (jpeg, png, etc.)',
        variant: 'destructive'
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: 'File Too Large',
        description: 'Please select an image less than 5MB',
        variant: 'destructive'
      });
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Set the file name as the image name if empty
    if (!watch('ten_anh')) {
      setValue('ten_anh', file.name.split('.')[0]);
    }
  };
  
  const clearSelectedFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };
  
  const onSubmit = async (data: ImageType) => {
    if (!selectedFile) {
      toast({
        title: 'No Image Selected',
        description: 'Please select an image to upload',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert file to base64 for saving
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      
      reader.onload = async () => {
        try {
          const base64Image = reader.result as string;
          
          // Prepare the image data for saving
          const imageData: Partial<ImageType> = {
            ...data,
            image: base64Image,
            tg_tao: new Date().toISOString()
          };
          
          // Save to database
          await imageService.create(imageData);
          
          toast({
            title: 'Success',
            description: 'Image uploaded successfully'
          });
          
          if (onSuccess) {
            onSuccess();
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: 'Upload Failed',
            description: 'There was an error uploading your image. Please try again.',
            variant: 'destructive'
          });
        } finally {
          setIsSubmitting(false);
        }
      };
      
      reader.onerror = () => {
        toast({
          title: 'Error',
          description: 'Failed to process the image',
          variant: 'destructive'
        });
        setIsSubmitting(false);
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading your image',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Image className="h-5 w-5 mr-2" />
          Upload New Image
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="entity-type">Entity Type</Label>
              <Select 
                onValueChange={(value) => setValue('doi_tuong', value)} 
                defaultValue={watchedEntityType}
              >
                <SelectTrigger id="entity-type">
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  {entityTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entity-id">Entity ID</Label>
              <Input
                id="entity-id"
                placeholder="Enter entity ID"
                {...register('doi_tuong_id', { required: 'Entity ID is required' })}
              />
              {errors.doi_tuong_id && (
                <p className="text-sm text-red-500">{errors.doi_tuong_id.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image-name">Image Name</Label>
            <Input
              id="image-name"
              placeholder="Enter a name for this image"
              {...register('ten_anh', { required: 'Image name is required' })}
            />
            {errors.ten_anh && (
              <p className="text-sm text-red-500">{errors.ten_anh.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="caption">Caption (Optional)</Label>
            <Textarea
              id="caption"
              placeholder="Enter a caption or description for this image"
              rows={3}
              {...register('caption')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Image</Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                {imagePreview ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-60 max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={clearSelectedFile}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG or GIF (Max: 5MB)
                    </p>
                  </div>
                )}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || !selectedFile}
            >
              {isSubmitting ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ImageUploadForm;
