
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { AssetFormData } from '../schemas/assetSchema';

interface AssetFormDetailsProps {
  form: UseFormReturn<AssetFormData>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AssetFormDetails: React.FC<AssetFormDetailsProps> = ({ form, handleChange }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="tinh_trang"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tình trạng</FormLabel>
            <Select 
              defaultValue={field.value} 
              onValueChange={(value) => form.setValue('tinh_trang', value)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tình trạng" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">Còn sử dụng</SelectItem>
                <SelectItem value="inactive">Ngưng sử dụng</SelectItem>
                <SelectItem value="repair">Đang sửa chữa</SelectItem>
                <SelectItem value="broken">Hỏng</SelectItem>
              </SelectContent>
            </Select>
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
            <Select 
              defaultValue={field.value} 
              onValueChange={(value) => form.setValue('trang_thai_so_huu', value)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái sở hữu" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="owned">Sở hữu</SelectItem>
                <SelectItem value="rented">Thuê</SelectItem>
                <SelectItem value="borrowed">Mượn</SelectItem>
              </SelectContent>
            </Select>
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
              <Input 
                {...field} 
                placeholder="Nhập khu vực" 
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

export default AssetFormDetails;
