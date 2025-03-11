
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { AssetFormData } from '../schemas/assetSchema';

interface AdditionalInfoFieldsProps {
  form: UseFormReturn<AssetFormData>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AdditionalInfoFields: React.FC<AdditionalInfoFieldsProps> = ({
  form,
  handleChange
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="thuong_hieu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Thương hiệu</FormLabel>
            <FormControl>
              <Input {...field} onChange={handleChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mau"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Màu</FormLabel>
            <FormControl>
              <Input {...field} onChange={handleChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="khu_vuc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Khu vực</FormLabel>
            <FormControl>
              <Input {...field} onChange={handleChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ghi_chu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ghi chú</FormLabel>
            <FormControl>
              <Textarea {...field} onChange={handleChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AdditionalInfoFields;
