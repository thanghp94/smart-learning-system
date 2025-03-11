
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { AssetFormData } from '../schemas/assetSchema';

interface StatusFieldsProps {
  form: UseFormReturn<AssetFormData>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const StatusFields: React.FC<StatusFieldsProps> = ({
  form,
  handleChange
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="so_tien_mua"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Số tiền mua</FormLabel>
            <FormControl>
              <Input {...field} onChange={handleChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tinh_trang"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tình trạng</FormLabel>
            <FormControl>
              <Input {...field} onChange={handleChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="trang_thai_so_huu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trạng thái sở hữu</FormLabel>
            <FormControl>
              <Input {...field} onChange={handleChange} />
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
              <Textarea {...field} onChange={handleChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default StatusFields;
