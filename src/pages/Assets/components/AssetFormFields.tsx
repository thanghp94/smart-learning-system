
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AssetFormData } from '../schemas/assetSchema';
import BasicInfoFields from './BasicInfoFields';
import StatusFields from './StatusFields';
import ImageUploadFields from './ImageUploadFields';
import AdditionalInfoFields from './AdditionalInfoFields';

interface AssetFormFieldsProps {
  form: UseFormReturn<AssetFormData>;
  assetData: AssetFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageUpload: (url: string, field: keyof AssetFormData) => void;
}

const AssetFormFields: React.FC<AssetFormFieldsProps> = ({
  form,
  assetData,
  handleChange,
  handleImageUpload
}) => {
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Create a properly typed event object for handleChange
    const syntheticEvent = {
      target: {
        name,
        value: value === '' ? '' : Number(value),
        type: 'number'
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(syntheticEvent);
  };

  return (
    <div className="space-y-4">
      <BasicInfoFields 
        form={form} 
        handleChange={handleChange} 
        handleNumberChange={handleNumberChange} 
      />
      
      <StatusFields 
        form={form} 
        handleChange={handleChange} 
      />
      
      <AdditionalInfoFields 
        form={form} 
        handleChange={handleChange} 
      />
      
      <ImageUploadFields 
        form={form} 
        handleImageUpload={handleImageUpload} 
      />
    </div>
  );
};

export default AssetFormFields;
