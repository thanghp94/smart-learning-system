
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { AssetFormData } from '../schemas/assetSchema';
import ImageUpload from '@/components/common/ImageUpload';

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
        value,
        type: 'text'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(syntheticEvent);
  };

  return (
    <div className="space-y-4">
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

      <FormField
        control={form.control}
        name="hinh_anh"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hình ảnh 1</FormLabel>
            <FormControl>
              <ImageUpload 
                value={field.value || ''} 
                onChange={(url) => handleImageUpload(url, 'hinh_anh')} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hinh_anh_2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hình ảnh 2</FormLabel>
            <FormControl>
              <ImageUpload 
                value={field.value || ''} 
                onChange={(url) => handleImageUpload(url, 'hinh_anh_2')} 
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
              <Textarea {...field} onChange={handleChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AssetFormFields;
