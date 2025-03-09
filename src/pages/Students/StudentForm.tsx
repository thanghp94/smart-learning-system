
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/DatePicker';
import { GENDERS, STUDENT_STATUSES } from '@/lib/constants';

const studentFormSchema = z.object({
  ten_hoc_sinh: z.string().min(1, 'Tên học sinh là bắt buộc'),
  gioi_tinh: z.string().optional(),
  ngay_sinh: z.date().optional().nullable(),
  co_so_ID: z.string().optional(),
  ten_PH: z.string().optional(),
  sdt_ph1: z.string().optional(),
  email_ph1: z.string().email('Email không hợp lệ').optional().nullable(),
  dia_chi: z.string().optional(),
  ct_hoc: z.string().optional(),
  trang_thai: z.string().default('active'),
  han_hoc_phi: z.date().optional().nullable(),
  ngay_bat_dau_hoc_phi: z.date().optional().nullable(),
  mo_ta_hs: z.string().optional(),
  hinh_anh_hoc_sinh: z.string().optional(),
  userid: z.string().optional(),
  password: z.string().optional(),
  parentid: z.string().optional(),
  parentpassword: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface StudentFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialValues?: any;
  isLoading?: boolean;
}

const StudentForm = ({ onSubmit, onCancel, initialValues, isLoading }: StudentFormProps) => {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: initialValues || {
      ten_hoc_sinh: '',
      gioi_tinh: 'male',
      ngay_sinh: null,
      co_so_ID: '',
      ten_PH: '',
      sdt_ph1: '',
      email_ph1: '',
      dia_chi: '',
      ct_hoc: '',
      trang_thai: 'active',
      han_hoc_phi: null,
      ngay_bat_dau_hoc_phi: null,
      mo_ta_hs: '',
      userid: '',
      password: '',
      parentid: '',
      parentpassword: '',
    },
  });

  const handleSubmit = (values: StudentFormValues) => {
    // The studentService will handle the date conversion
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ten_hoc_sinh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên học sinh <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên học sinh" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gioi_tinh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giới tính</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(GENDERS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ngay_sinh"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày sinh</FormLabel>
                <DatePicker 
                  date={field.value || undefined} 
                  setDate={field.onChange}
                  className="w-full"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="co_so_ID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cơ sở</FormLabel>
                <FormControl>
                  <Input placeholder="Chọn cơ sở" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ten_PH"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên phụ huynh</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên phụ huynh" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sdt_ph1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại phụ huynh</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email_ph1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email phụ huynh</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập email" {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ct_hoc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chương trình học</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập chương trình học" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trang_thai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(STUDENT_STATUSES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="han_hoc_phi"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Hạn học phí</FormLabel>
                <DatePicker 
                  date={field.value || undefined} 
                  setDate={field.onChange}
                  className="w-full"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ngay_bat_dau_hoc_phi"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày bắt đầu học phí</FormLabel>
                <DatePicker 
                  date={field.value || undefined} 
                  setDate={field.onChange}
                  className="w-full"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dia_chi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập địa chỉ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mo_ta_hs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập mô tả" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Lưu'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StudentForm;
