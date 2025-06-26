
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
import { Textarea } from '@/components/ui/textarea';

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

  const handleFacilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    handleMultiSelectChange('co_so_id', selectedValues);
  };

  const formatDateValue = (date: Date | string | undefined) => {
    if (!date) return "";
    try {
      return typeof date === 'string' ? format(new Date(date), 'dd/MM/yyyy') : format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return String(date);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Thông tin công việc</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="bo_phan">Bộ phận</Label>
          {isEditing ? (
            <Input
              id="bo_phan"
              name="bo_phan"
              value={employee.bo_phan || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="p-2 border rounded bg-gray-50">{employee.bo_phan || '—'}</div>
          )}
        </div>
        
        <div>
          <Label htmlFor="chuc_danh">Chức danh</Label>
          {isEditing ? (
            <Input
              id="chuc_danh"
              name="chuc_danh"
              value={employee.chuc_danh || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="p-2 border rounded bg-gray-50">{employee.chuc_danh || '—'}</div>
          )}
        </div>
        
        <div>
          <Label htmlFor="co_so_id">Cơ sở</Label>
          {isEditing ? (
            <select
              id="co_so_id"
              name="co_so_id"
              multiple
              value={Array.isArray(employee.co_so_id) ? employee.co_so_id : employee.co_so_id ? [employee.co_so_id] : []}
              onChange={handleFacilityChange}
              className="w-full p-2 border rounded h-24"
            >
              {facilities.map((facility) => (
                <option key={facility.id} value={facility.id}>
                  {facility.ten_co_so}
                </option>
              ))}
            </select>
          ) : (
            <div className="p-2 border rounded bg-gray-50">
              {Array.isArray(employee.co_so_id) && employee.co_so_id.length > 0
                ? facilities
                    .filter(f => employee.co_so_id?.includes(f.id))
                    .map(f => f.ten_co_so)
                    .join(', ')
                : typeof employee.co_so_id === 'string' && employee.co_so_id
                  ? facilities.find(f => f.id === employee.co_so_id)?.ten_co_so || employee.co_so_id
                  : '—'}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="tinh_trang_lao_dong">Tình trạng</Label>
          {isEditing ? (
            <select
              id="tinh_trang_lao_dong"
              name="tinh_trang_lao_dong"
              value={employee.tinh_trang_lao_dong || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Chọn tình trạng</option>
              <option value="Đang làm việc">Đang làm việc</option>
              <option value="Đã nghỉ việc">Đã nghỉ việc</option>
              <option value="Tạm nghỉ">Tạm nghỉ</option>
            </select>
          ) : (
            <div className="p-2 border rounded bg-gray-50">{employee.tinh_trang_lao_dong || '—'}</div>
          )}
        </div>
        
        <div>
          <Label htmlFor="luong_co_ban">Lương cơ bản</Label>
          {isEditing ? (
            <Input
              id="luong_co_ban"
              name="luong_co_ban"
              type="number"
              value={employee.luong_co_ban || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="p-2 border rounded bg-gray-50">
              {employee.luong_co_ban 
                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(employee.luong_co_ban)) 
                : '—'}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="ngay_vao_lam">Ngày vào làm</Label>
          {isEditing ? (
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !employee.ngay_vao_lam && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {employee.ngay_vao_lam ? formatDateValue(employee.ngay_vao_lam) : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      employee.ngay_vao_lam instanceof Date 
                        ? employee.ngay_vao_lam 
                        : employee.ngay_vao_lam 
                          ? new Date(employee.ngay_vao_lam) 
                          : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        handleMultiSelectChange("ngay_vao_lam", [date.toISOString()]);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="p-2 border rounded bg-gray-50">
              {employee.ngay_vao_lam ? formatDateValue(employee.ngay_vao_lam) : '—'}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="ghi_chu">Ghi chú</Label>
          {isEditing ? (
            <Textarea
              id="ghi_chu"
              name="ghi_chu"
              value={employee.ghi_chu || ''}
              onChange={handleChange}
              rows={3}
            />
          ) : (
            <div className="p-2 border rounded bg-gray-50 min-h-[5rem]">{employee.ghi_chu || '—'}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeWorkInfo;
