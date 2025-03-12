
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { AssetFormData } from '../schemas/assetSchema';

interface AssetFormBasicProps {
  form: UseFormReturn<AssetFormData>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AssetFormBasic: React.FC<AssetFormBasicProps> = ({ 
  form, 
  handleChange, 
  handleNumberChange 
}) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="ten_csvc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên tài sản</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Nhập tên tài sản" 
                onChange={handleChange}
              />
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
            <FormLabel>Loại tài sản</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Nhập loại tài sản" 
                onChange={handleChange}
              />
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
              <Input 
                {...field} 
                placeholder="Nhập danh mục" 
                onChange={handleChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="so_luong"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số lượng</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0"
                  {...field} 
                  onChange={handleNumberChange}
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
                <Input 
                  {...field} 
                  placeholder="Nhập đơn vị" 
                  onChange={handleChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AssetFormBasic;
