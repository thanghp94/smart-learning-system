
import React from 'react';
import { Employee } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormItem } from '@/components/ui/form';
import { Select } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/DatePicker';
import ImageUpload from '@/components/common/ImageUpload';

interface EmployeeBasicInfoProps {
  employee: Employee | null;
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageUpload: (url: string) => void;
  handleDateChange: (name: string, value: Date | null) => void;
}

const EmployeeBasicInfo: React.FC<EmployeeBasicInfoProps> = ({
  employee,
  isEditing,
  handleChange,
  handleImageUpload,
  handleDateChange,
}) => {
  if (!employee) return null;

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
            id="gioi_tinh"
            name="gioi_tinh"
            value={employee.gioi_tinh || ''}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </Select>
        </FormItem>

        <FormItem>
          <Label htmlFor="ngay_sinh">Ngày sinh</Label>
          <DatePicker
            id="ngay_sinh"
            selected={employee.ngay_sinh instanceof Date ? employee.ngay_sinh : employee.ngay_sinh ? new Date(employee.ngay_sinh) : null}
            onChange={(date) => handleDateChange('ngay_sinh', date)}
            disabled={!isEditing}
            className="w-full"
          />
        </FormItem>

        <FormItem>
          <Label htmlFor="vai_tro">Vai trò</Label>
          <Select
            id="vai_tro"
            name="vai_tro"
            value={employee.vai_tro || ''}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="">Chọn vai trò</option>
            <option value="Giáo viên">Giáo viên</option>
            <option value="Quản lý">Quản lý</option>
            <option value="Nhân viên">Nhân viên</option>
            <option value="Khác">Khác</option>
          </Select>
        </FormItem>
      </div>
    </div>
  );
};

export default EmployeeBasicInfo;
