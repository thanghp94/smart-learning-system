
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
  isLoading?: boolean;
}

const EnrollmentForm = ({ 
  initialData, 
  onSubmit, 
  students, 
  classes, 
  isLoading = false 
}: EnrollmentFormProps) => {
  const form = useForm<Partial<Enrollment>>({
    defaultValues: {
      hoc_sinh_id: initialData?.hoc_sinh_id || '',
      lop_chi_tiet_id: initialData?.lop_chi_tiet_id || '',
      tinh_trang_diem_danh: initialData?.tinh_trang_diem_danh || 'present',
      ghi_chu: initialData?.ghi_chu || ''
    }
  });

  const handleSubmit = (data: Partial<Enrollment>) => {
    console.log("Form data:", data);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="hoc_sinh_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Học sinh*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn học sinh" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.ten_hoc_sinh}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lop_chi_tiet_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lớp học*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lớp học" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.ten_lop_full}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tinh_trang_diem_danh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái điểm danh</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="present">Có mặt</SelectItem>
                  <SelectItem value="absent">Vắng mặt</SelectItem>
                  <SelectItem value="late">Đi trễ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ghi_chu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang lưu..." : "Lưu thông tin"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EnrollmentForm;
