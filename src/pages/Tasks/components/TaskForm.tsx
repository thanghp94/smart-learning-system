
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/DatePicker';
import { taskService, employeeService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Employee } from '@/lib/types';

const taskSchema = z.object({
  ten_viec: z.string().min(1, { message: 'Tên công việc là bắt buộc' }),
  loai_viec: z.string().optional(),
  doi_tuong: z.string().optional(),
  dien_giai: z.string().optional(),
  nguoi_phu_trach: z.string().optional(),
  ngay_den_han: z.date().optional(),
  cap_do: z.string().optional(),
  doi_tuong_id: z.string().optional(),
  ghi_chu: z.string().optional(),
});

interface TaskFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: any;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getAll();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách nhân viên',
          variant: 'destructive',
        });
      }
    };

    fetchEmployees();
  }, [toast]);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData || {
      ten_viec: '',
      loai_viec: '',
      doi_tuong: '',
      dien_giai: '',
      nguoi_phu_trach: '',
      ngay_den_han: undefined,
      cap_do: 'medium',
      doi_tuong_id: '',
      ghi_chu: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof taskSchema>) => {
    try {
      if (initialData?.id) {
        await taskService.update(initialData.id, values);
        toast({
          title: 'Thành công',
          description: 'Cập nhật công việc thành công',
        });
      } else {
        await taskService.create(values);
        toast({
          title: 'Thành công',
          description: 'Thêm công việc mới thành công',
        });
      }
      onSubmit();
    } catch (error) {
      console.error('Error submitting task:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu công việc',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="ten_viec"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên công việc</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên công việc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="loai_viec"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại công việc</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại công việc" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tuyen_sinh">Tuyển sinh</SelectItem>
                    <SelectItem value="giang_day">Giảng dạy</SelectItem>
                    <SelectItem value="hanh_chinh">Hành chính</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="khac">Khác</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nguoi_phu_trach"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Người phụ trách</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn người phụ trách" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.ten_nhan_su}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cap_do"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cấp độ</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cấp độ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="urgent">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ngay_den_han"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày đến hạn</FormLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dien_giai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diễn giải</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập diễn giải"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
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
                <Textarea
                  placeholder="Nhập ghi chú"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">
            {initialData ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
