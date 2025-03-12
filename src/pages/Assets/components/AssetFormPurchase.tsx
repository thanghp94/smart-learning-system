
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { AssetFormData } from '../schemas/assetSchema';

interface AssetFormPurchaseProps {
  form: UseFormReturn<AssetFormData>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AssetFormPurchase: React.FC<AssetFormPurchaseProps> = ({ form, handleChange }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="so_tien_mua"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Số tiền mua</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Nhập số tiền mua" 
                onChange={handleChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="thuong_hieu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Thương hiệu</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Nhập thương hiệu" 
                onChange={handleChange}
              />
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
            <FormLabel>Màu sắc</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Nhập màu sắc" 
                onChange={handleChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mo_ta_1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Nhập mô tả" 
                rows={3}
                onChange={handleChange}
              />
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
              <Textarea 
                {...field} 
                placeholder="Nhập ghi chú" 
                rows={3}
                onChange={handleChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AssetFormPurchase;
