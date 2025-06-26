
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { AssetFormData } from '../schemas/assetSchema';

interface BasicInfoFieldsProps {
  form: UseFormReturn<AssetFormData>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  form,
  handleChange,
  handleNumberChange
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="ten_csvc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên cơ sở vật chất</FormLabel>
            <FormControl>
              <Input {...field} onChange={handleChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="loai"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loại</FormLabel>
            <FormControl>
              <Input {...field} onChange={handleChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="danh_muc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Danh mục</FormLabel>
            <FormControl>
              <Input {...field} onChange={handleChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="so_luong"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Số lượng</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={handleNumberChange}
                value={field.value || ''} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="don_vi"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Đơn vị</FormLabel>
            <FormControl>
              <Input {...field} onChange={handleChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BasicInfoFields;
