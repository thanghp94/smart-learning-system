
import React, { useState } from 'react';
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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Facility, Employee, Student } from '@/lib/types';

const eventSchema = z.object({
  loai_su_kien: z.string().min(1, { message: "Vui lòng chọn loại sự kiện" }),
  doi_tuong_loai: z.string().min(1, { message: "Vui lòng chọn loại đối tượng" }),
  doi_tuong_id: z.string().optional(),
  ten_su_kien: z.string().min(1, { message: "Vui lòng nhập tên sự kiện" }),
  mieu_ta: z.string().optional(),
  ngay_bat_dau: z.string().min(1, { message: "Vui lòng chọn ngày bắt đầu" }),
  ngay_ket_thuc: z.string().optional(),
  dia_diem: z.string().optional(),
  trang_thai: z.string().default("upcoming")
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  facilities?: Facility[];
  employees?: Employee[];
  students?: Student[];
}

const EventForm = ({ initialData, onSubmit, onCancel, facilities = [], employees = [], students = [] }: EventFormProps) => {
  const [selectedEntityType, setSelectedEntityType] = useState(initialData?.doi_tuong_loai || 'company');
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      loai_su_kien: initialData?.loai_su_kien || '',
      doi_tuong_loai: initialData?.doi_tuong_loai || 'company',
      doi_tuong_id: initialData?.doi_tuong_id || '',
      ten_su_kien: initialData?.ten_su_kien || '',
      mieu_ta: initialData?.mieu_ta || '',
      ngay_bat_dau: initialData?.ngay_bat_dau || '',
      ngay_ket_thuc: initialData?.ngay_ket_thuc || '',
      dia_diem: initialData?.dia_diem || '',
      trang_thai: initialData?.trang_thai || 'upcoming'
    }
  });

  console.log("Rendering EventForm component");
  
  const handleEntityTypeChange = (value: string) => {
    setSelectedEntityType(value);
    setValue('doi_tuong_loai', value);
    setValue('doi_tuong_id', ''); // Reset the entity ID when changing type
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="loai_su_kien">Loại sự kiện*</Label>
        <Select
          onValueChange={(value) => setValue('loai_su_kien', value)}
          defaultValue={watch('loai_su_kien')}
        >
          <SelectTrigger className={errors.loai_su_kien ? 'border-red-500' : ''}>
            <SelectValue placeholder="Chọn loại sự kiện" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="meeting">Cuộc họp</SelectItem>
            <SelectItem value="workshop">Hội thảo</SelectItem>
            <SelectItem value="ceremony">Lễ kỷ niệm</SelectItem>
            <SelectItem value="training">Đào tạo</SelectItem>
            <SelectItem value="social">Hoạt động xã hội</SelectItem>
            <SelectItem value="other">Khác</SelectItem>
          </SelectContent>
        </Select>
        {errors.loai_su_kien && <p className="text-red-500 text-xs mt-1">{errors.loai_su_kien.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="doi_tuong_loai">Đối tượng liên quan*</Label>
        <Select
          onValueChange={handleEntityTypeChange}
          defaultValue={selectedEntityType}
        >
          <SelectTrigger className={errors.doi_tuong_loai ? 'border-red-500' : ''}>
            <SelectValue placeholder="Chọn đối tượng liên quan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="company">Toàn công ty</SelectItem>
            <SelectItem value="facility">Cơ sở</SelectItem>
            <SelectItem value="employee">Nhân viên</SelectItem>
            <SelectItem value="student">Học sinh</SelectItem>
            <SelectItem value="candidate">Ứng viên</SelectItem>
            <SelectItem value="other">Khác</SelectItem>
          </SelectContent>
        </Select>
        {errors.doi_tuong_loai && <p className="text-red-500 text-xs mt-1">{errors.doi_tuong_loai.message}</p>}
      </div>
      
      {selectedEntityType === 'facility' && facilities.length > 0 && (
        <div>
          <Label htmlFor="doi_tuong_id">Chọn cơ sở</Label>
          <Select
            onValueChange={(value) => setValue('doi_tuong_id', value)}
            defaultValue={watch('doi_tuong_id')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn cơ sở" />
            </SelectTrigger>
            <SelectContent>
              {facilities.map(facility => (
                <SelectItem key={facility.id} value={facility.id}>
                  {facility.ten_co_so}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {selectedEntityType === 'employee' && employees.length > 0 && (
        <div>
          <Label htmlFor="doi_tuong_id">Chọn nhân viên</Label>
          <Select
            onValueChange={(value) => setValue('doi_tuong_id', value)}
            defaultValue={watch('doi_tuong_id')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn nhân viên" />
            </SelectTrigger>
            <SelectContent>
              {employees.map(employee => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.ho_va_ten}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {selectedEntityType === 'student' && students.length > 0 && (
        <div>
          <Label htmlFor="doi_tuong_id">Chọn học sinh</Label>
          <Select
            onValueChange={(value) => setValue('doi_tuong_id', value)}
            defaultValue={watch('doi_tuong_id')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn học sinh" />
            </SelectTrigger>
            <SelectContent>
              {students.map(student => (
                <SelectItem key={student.id} value={student.id}>
                  {student.ten_hoc_sinh}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="ten_su_kien">Tên sự kiện*</Label>
        <Input
          id="ten_su_kien"
          {...register('ten_su_kien', { required: true })}
          className={errors.ten_su_kien ? 'border-red-500' : ''}
        />
        {errors.ten_su_kien && <p className="text-red-500 text-xs mt-1">{errors.ten_su_kien.message}</p>}
      </div>

      <div>
        <Label htmlFor="mieu_ta">Mô tả</Label>
        <Textarea id="mieu_ta" {...register('mieu_ta')} rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ngay_bat_dau">Ngày bắt đầu*</Label>
          <Input
            id="ngay_bat_dau"
            type="datetime-local"
            {...register('ngay_bat_dau', { required: true })}
            className={errors.ngay_bat_dau ? 'border-red-500' : ''}
          />
          {errors.ngay_bat_dau && <p className="text-red-500 text-xs mt-1">{errors.ngay_bat_dau.message}</p>}
        </div>

        <div>
          <Label htmlFor="ngay_ket_thuc">Ngày kết thúc</Label>
          <Input
            id="ngay_ket_thuc"
            type="datetime-local"
            {...register('ngay_ket_thuc')}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="dia_diem">Địa điểm</Label>
        <Input id="dia_diem" {...register('dia_diem')} />
      </div>

      <div>
        <Label htmlFor="trang_thai">Trạng thái</Label>
        <Select
          onValueChange={(value) => setValue('trang_thai', value)}
          defaultValue={watch('trang_thai')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
            <SelectItem value="ongoing">Đang diễn ra</SelectItem>
            <SelectItem value="completed">Đã kết thúc</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
        <Button type="submit">Lưu thông tin</Button>
      </div>
    </form>
  );
};

export default EventForm;
