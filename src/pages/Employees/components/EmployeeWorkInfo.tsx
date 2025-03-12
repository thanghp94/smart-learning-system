
import React from 'react';
import { Employee } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormItem } from '@/components/ui/form';
import { Select } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/MultiSelect';

interface EmployeeWorkInfoProps {
  employee: Employee | null;
  facilities: any[];
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleMultiSelectChange: (name: string, value: string[]) => void;
}

const EmployeeWorkInfo: React.FC<EmployeeWorkInfoProps> = ({
  employee,
  facilities,
  isEditing,
  handleChange,
  handleMultiSelectChange,
}) => {
  if (!employee) return null;

  // Convert facility IDs to array if it's a string
  const facilityIds = Array.isArray(employee.co_so_id) 
    ? employee.co_so_id 
    : employee.co_so_id 
      ? [employee.co_so_id] 
      : [];

  // Create options for multi-select
  const facilityOptions = facilities.map(facility => ({
    value: facility.id,
    label: facility.ten_co_so
  }));

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Thông tin công việc</h3>
      <div className="space-y-4">
        <FormItem>
          <Label htmlFor="bo_phan">Bộ phận</Label>
          <Input
            id="bo_phan"
            name="bo_phan"
            value={employee.bo_phan || ''}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </FormItem>
        
        <FormItem>
          <Label htmlFor="chuc_danh">Chức danh</Label>
          <Input
            id="chuc_danh"
            name="chuc_danh"
            value={employee.chuc_danh || ''}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </FormItem>
        
        <FormItem>
          <Label htmlFor="tinh_trang_lao_dong">Tình trạng lao động</Label>
          <Select
            id="tinh_trang_lao_dong"
            name="tinh_trang_lao_dong"
            value={employee.tinh_trang_lao_dong || 'active'}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="active">Đang làm việc</option>
            <option value="inactive">Đã nghỉ việc</option>
            <option value="leave">Nghỉ phép</option>
          </Select>
        </FormItem>
        
        <FormItem>
          <Label htmlFor="co_so_id">Cơ sở làm việc</Label>
          <MultiSelect
            options={facilityOptions}
            selected={facilityIds}
            onChange={(values) => handleMultiSelectChange('co_so_id', values)}
            disabled={!isEditing}
          />
        </FormItem>
      </div>
    </div>
  );
};

export default EmployeeWorkInfo;
