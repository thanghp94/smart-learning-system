
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BasicEntitySelector from '@/pages/Finance/components/BasicEntitySelector';

interface AdditionalInfoFieldsProps {
  form: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AdditionalInfoFields: React.FC<AdditionalInfoFieldsProps> = ({
  form,
  handleChange,
}) => {
  return (
    <div className="space-y-4">
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
            <FormLabel>Màu sắc</FormLabel>
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

      <div className="space-y-4 border p-4 rounded-md">
        <h4 className="text-sm font-medium">Thông tin đối tượng</h4>
        
        <FormField
          control={form.control}
          name="doi_tuong"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại đối tượng</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại đối tượng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="hoc_sinh">Học sinh</SelectItem>
                  <SelectItem value="nhan_vien">Nhân viên</SelectItem>
                  <SelectItem value="co_so">Cơ sở</SelectItem>
                  <SelectItem value="khac">Khác</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('doi_tuong') && form.watch('doi_tuong') !== 'khac' && (
          <FormField
            control={form.control}
            name="doi_tuong_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đối tượng</FormLabel>
                <BasicEntitySelector 
                  form={form} 
                  entityType={form.watch('doi_tuong')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="doi_tuong_chi_tiet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chi tiết đối tượng</FormLabel>
              <FormControl>
                <Input {...field} onChange={handleChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AdditionalInfoFields;
