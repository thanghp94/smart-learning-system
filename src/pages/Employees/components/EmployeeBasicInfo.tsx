
import React from 'react';
import { Employee } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormItem } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/DatePicker';
import ImageUpload from '@/components/common/ImageUpload';

interface EmployeeBasicInfoProps {
  employee: Employee | null;
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageUpload: (url: string) => void;
  handleDateChange: (name: string, value: Date | null) => void;
  handleSelectChange?: (name: string, value: string) => void;
}

const EmployeeBasicInfo: React.FC<EmployeeBasicInfoProps> = ({
  employee,
  isEditing,
  handleChange,
  handleImageUpload,
  handleDateChange,
  handleSelectChange,
}) => {
  if (!employee) return null;

  // Create a wrapper for select change to match the provided handleSelectChange or simulate it
  const onSelectChange = (name: string) => (value: string) => {
    if (handleSelectChange) {
      handleSelectChange(name, value);
    } else {
      // Simulate a change event if no handleSelectChange provided
      const event = {
        target: { name, value }
      } as React.ChangeEvent<HTMLSelectElement>;
      handleChange(event);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Thông tin cơ bản</h3>
      <div className="flex flex-col items-center mb-6">
        <ImageUpload
          currentUrl={employee.hinh_anh || '/placeholder.svg'}
          onUpload={handleImageUpload}
          entityType="employee"
          entityId={employee.id}
          className="mb-4"
        />
      </div>

      <div className="space-y-4">
        <FormItem>
          <Label htmlFor="ten_nhan_su">Tên nhân sự</Label>
          <Input
            id="ten_nhan_su"
            name="ten_nhan_su"
            value={employee.ten_nhan_su || ''}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </FormItem>

        <FormItem>
          <Label htmlFor="ten_tieng_anh">Tên tiếng Anh</Label>
          <Input
            id="ten_tieng_anh"
            name="ten_tieng_anh"
            value={employee.ten_tieng_anh || ''}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </FormItem>

        <FormItem>
          <Label htmlFor="gioi_tinh">Giới tính</Label>
          <Select 
            value={employee.gioi_tinh || ''} 
            onValueChange={onSelectChange('gioi_tinh')}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Chọn giới tính</SelectItem>
              <SelectItem value="Nam">Nam</SelectItem>
              <SelectItem value="Nữ">Nữ</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>

        <FormItem>
          <Label htmlFor="ngay_sinh">Ngày sinh</Label>
          <DatePicker
            selected={employee.ngay_sinh instanceof Date ? employee.ngay_sinh : employee.ngay_sinh ? new Date(employee.ngay_sinh) : null}
            onChange={(date) => handleDateChange('ngay_sinh', date)}
            disabled={!isEditing}
            className="w-full"
          />
        </FormItem>

        <FormItem>
          <Label htmlFor="vai_tro">Vai trò</Label>
          <Select 
            value={employee.vai_tro || ''} 
            onValueChange={onSelectChange('vai_tro')}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Chọn vai trò</SelectItem>
              <SelectItem value="Giáo viên">Giáo viên</SelectItem>
              <SelectItem value="Quản lý">Quản lý</SelectItem>
              <SelectItem value="Nhân viên">Nhân viên</SelectItem>
              <SelectItem value="Khác">Khác</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      </div>
    </div>
  );
};

export default EmployeeBasicInfo;
