
import React from 'react';
import { Employee } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface EmployeeContactInfoProps {
  employee: Employee | null;
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const EmployeeContactInfo: React.FC<EmployeeContactInfoProps> = ({
  employee,
  isEditing,
  handleChange,
}) => {
  if (!employee) return null;

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Thông tin liên hệ</h3>
      <div className="space-y-4">
        <FormItem>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={employee.email || ''}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </FormItem>
        
        <FormItem>
          <Label htmlFor="dien_thoai">Điện thoại</Label>
          <Input
            id="dien_thoai"
            name="dien_thoai"
            value={employee.dien_thoai || ''}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </FormItem>
        
        <FormItem>
          <Label htmlFor="dia_chi">Địa chỉ</Label>
          <Textarea
            id="dia_chi"
            name="dia_chi"
            value={employee.dia_chi || ''}
            onChange={handleChange}
            disabled={!isEditing}
            rows={3}
          />
        </FormItem>
      </div>
    </div>
  );
};

export default EmployeeContactInfo;
