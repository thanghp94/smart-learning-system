
import React from 'react';
import { Employee } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Thông tin liên hệ</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          {isEditing ? (
            <Input
              id="email"
              name="email"
              type="email"
              value={employee.email || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="p-2 border rounded bg-gray-50">{employee.email || '—'}</div>
          )}
        </div>
        
        <div>
          <Label htmlFor="dien_thoai">Số điện thoại</Label>
          {isEditing ? (
            <Input
              id="dien_thoai"
              name="dien_thoai"
              value={employee.dien_thoai || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="p-2 border rounded bg-gray-50">{employee.dien_thoai || '—'}</div>
          )}
        </div>
        
        <div>
          <Label htmlFor="dia_chi">Địa chỉ</Label>
          {isEditing ? (
            <Textarea
              id="dia_chi"
              name="dia_chi"
              value={employee.dia_chi || ''}
              onChange={handleChange}
              rows={3}
            />
          ) : (
            <div className="p-2 border rounded bg-gray-50 min-h-[5rem]">{employee.dia_chi || '—'}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeContactInfo;
