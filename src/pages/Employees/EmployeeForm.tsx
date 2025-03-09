
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Employee } from '@/lib/types';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface EmployeeFormProps {
  initialData?: Partial<Employee>;
  onSubmit: (data: Partial<Employee>) => void;
}

const EmployeeForm = ({ initialData, onSubmit }: EmployeeFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      ten_nhan_su: initialData?.ten_nhan_su || '',
      bo_phan: initialData?.bo_phan || '',
      chuc_danh: initialData?.chuc_danh || '',
      dien_thoai: initialData?.dien_thoai || '',
      email: initialData?.email || '',
      co_so_id: initialData?.co_so_id?.length ? initialData.co_so_id[0] : '',
      tinh_trang_lao_dong: initialData?.tinh_trang_lao_dong || 'active',
      ngay_sinh: initialData?.ngay_sinh || null, // Changed from empty string to null
      dia_chi: initialData?.dia_chi || '',
      gioi_tinh: initialData?.gioi_tinh || '',
      ghi_chu: initialData?.ghi_chu || ''
    }
  });

  const processSubmit = (formData: any) => {
    // Process the date field - if empty, set to null to avoid SQL date parsing errors
    const processedData = {
      ...formData,
      ngay_sinh: formData.ngay_sinh || null,
      co_so_id: formData.co_so_id ? [formData.co_so_id] : []
    };
    
    console.log("Submitting employee data:", processedData);
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="ten_nhan_su">Tên nhân viên*</Label>
        <Input
          id="ten_nhan_su"
          {...register('ten_nhan_su', { required: true })}
          className={errors.ten_nhan_su ? 'border-red-500' : ''}
        />
        {errors.ten_nhan_su && <p className="text-red-500 text-xs mt-1">Vui lòng nhập tên nhân viên</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bo_phan">Bộ phận</Label>
          <Select
            onValueChange={(value) => setValue('bo_phan', value)}
            defaultValue={watch('bo_phan')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn bộ phận" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Giáo viên">Giáo viên</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Kế toán">Kế toán</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="chuc_danh">Chức danh</Label>
          <Select
            onValueChange={(value) => setValue('chuc_danh', value)}
            defaultValue={watch('chuc_danh')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn chức danh" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Giám đốc">Giám đốc</SelectItem>
              <SelectItem value="GV">Giáo viên</SelectItem>
              <SelectItem value="TG">Trợ giảng</SelectItem>
              <SelectItem value="Nhân viên">Nhân viên</SelectItem>
              <SelectItem value="Quản lý">Quản lý</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dien_thoai">Số điện thoại</Label>
          <Input id="dien_thoai" {...register('dien_thoai')} />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email không hợp lệ'
              }
            })}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="co_so_id">Cơ sở</Label>
          <Select
            onValueChange={(value) => setValue('co_so_id', value)}
            defaultValue={watch('co_so_id')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn cơ sở" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facility1">Cơ sở Hà Nội</SelectItem>
              <SelectItem value="facility2">Cơ sở Hồ Chí Minh</SelectItem>
              <SelectItem value="facility3">Cơ sở Đà Nẵng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tinh_trang_lao_dong">Trạng thái</Label>
          <Select
            onValueChange={(value) => setValue('tinh_trang_lao_dong', value)}
            defaultValue={watch('tinh_trang_lao_dong')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Đang làm việc</SelectItem>
              <SelectItem value="inactive">Đã nghỉ việc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ngay_sinh">Ngày sinh</Label>
          <Input
            id="ngay_sinh"
            type="date"
            {...register('ngay_sinh')}
          />
        </div>

        <div>
          <Label htmlFor="gioi_tinh">Giới tính</Label>
          <Select
            onValueChange={(value) => setValue('gioi_tinh', value)}
            defaultValue={watch('gioi_tinh')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nam">Nam</SelectItem>
              <SelectItem value="Nữ">Nữ</SelectItem>
              <SelectItem value="Khác">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="dia_chi">Địa chỉ</Label>
        <Input id="dia_chi" {...register('dia_chi')} />
      </div>

      <div>
        <Label htmlFor="ghi_chu">Ghi chú</Label>
        <Textarea id="ghi_chu" {...register('ghi_chu')} rows={3} />
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        <Button type="submit">Lưu thông tin</Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
