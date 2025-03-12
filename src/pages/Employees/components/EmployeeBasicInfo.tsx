
import React from 'react';
import { Employee } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
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
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
      
      <div className="flex flex-col items-center mb-4">
        {isEditing ? (
          <ImageUpload
            url={employee.hinh_anh}
            onUpload={handleImageUpload}
            entityType="employee"
            entityId={employee.id}
          />
        ) : (
          <div className="relative w-32 h-32 mb-2">
            <img
              src={employee.hinh_anh || '/placeholder.svg'}
              alt={employee.ten_nhan_su}
              className="w-full h-full object-cover rounded-full border border-gray-200"
            />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="ten_nhan_su">Họ và tên</Label>
          {isEditing ? (
            <Input
              id="ten_nhan_su"
              name="ten_nhan_su"
              value={employee.ten_nhan_su || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="p-2 border rounded bg-gray-50">{employee.ten_nhan_su}</div>
          )}
        </div>
        
        <div>
          <Label htmlFor="ten_tieng_anh">Tên tiếng Anh</Label>
          {isEditing ? (
            <Input
              id="ten_tieng_anh"
              name="ten_tieng_anh"
              value={employee.ten_tieng_anh || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="p-2 border rounded bg-gray-50">{employee.ten_tieng_anh || '—'}</div>
          )}
        </div>
        
        <div>
          <Label htmlFor="ngay_sinh">Ngày sinh</Label>
          {isEditing ? (
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !employee.ngay_sinh && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {employee.ngay_sinh ? (
                      employee.ngay_sinh instanceof Date 
                        ? format(employee.ngay_sinh, "dd/MM/yyyy")
                        : format(new Date(employee.ngay_sinh), "dd/MM/yyyy")
                    ) : (
                      "Chọn ngày"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      employee.ngay_sinh instanceof Date 
                        ? employee.ngay_sinh 
                        : employee.ngay_sinh 
                          ? new Date(employee.ngay_sinh) 
                          : undefined
                    }
                    onSelect={(date) => handleDateChange("ngay_sinh", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="p-2 border rounded bg-gray-50">
              {employee.ngay_sinh 
                ? (employee.ngay_sinh instanceof Date 
                  ? format(employee.ngay_sinh, "dd/MM/yyyy") 
                  : format(new Date(employee.ngay_sinh), "dd/MM/yyyy"))
                : '—'}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="gioi_tinh">Giới tính</Label>
          {isEditing ? (
            <select
              id="gioi_tinh"
              name="gioi_tinh"
              value={employee.gioi_tinh || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          ) : (
            <div className="p-2 border rounded bg-gray-50">{employee.gioi_tinh || '—'}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeBasicInfo;
