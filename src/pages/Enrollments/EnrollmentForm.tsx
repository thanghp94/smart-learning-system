
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Enrollment, Student, Class } from '@/lib/types';

interface EnrollmentFormProps {
  initialData?: Partial<Enrollment>;
  onSubmit: (data: Partial<Enrollment>) => void;
  students: Student[];
  classes: Class[];
}

const EnrollmentForm = ({ initialData, onSubmit, students, classes }: EnrollmentFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      hoc_sinh_id: initialData?.hoc_sinh_id || '',
      lop_chi_tiet_id: initialData?.lop_chi_tiet_id || '',
      tinh_trang_diem_danh: initialData?.tinh_trang_diem_danh || 'present',
      ghi_chu: initialData?.ghi_chu || ''
    }
  });

  const processSubmit = (formData: any) => {
    console.log("Form data:", formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="hoc_sinh_id">Học sinh*</Label>
        <Select
          onValueChange={(value) => setValue('hoc_sinh_id', value)}
          defaultValue={watch('hoc_sinh_id')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn học sinh" />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.ten_hoc_sinh}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.hoc_sinh_id && <p className="text-red-500 text-xs mt-1">Vui lòng chọn học sinh</p>}
      </div>

      <div>
        <Label htmlFor="lop_chi_tiet_id">Lớp học*</Label>
        <Select
          onValueChange={(value) => setValue('lop_chi_tiet_id', value)}
          defaultValue={watch('lop_chi_tiet_id')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn lớp học" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((classItem) => (
              <SelectItem key={classItem.id} value={classItem.id}>
                {classItem.ten_lop_full}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.lop_chi_tiet_id && <p className="text-red-500 text-xs mt-1">Vui lòng chọn lớp học</p>}
      </div>

      <div>
        <Label htmlFor="tinh_trang_diem_danh">Trạng thái điểm danh</Label>
        <Select
          onValueChange={(value) => setValue('tinh_trang_diem_danh', value)}
          defaultValue={watch('tinh_trang_diem_danh')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="present">Có mặt</SelectItem>
            <SelectItem value="absent">Vắng mặt</SelectItem>
            <SelectItem value="late">Đi trễ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="ghi_chu">Ghi chú</Label>
        <Textarea id="ghi_chu" {...register('ghi_chu')} />
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        <Button type="submit">Lưu thông tin</Button>
      </div>
    </form>
  );
};

export default EnrollmentForm;
