
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Facility } from '@/lib/types';

// Create a schema for form validation
const financeSchema = z.object({
  loai_thu_chi: z.string({
    required_error: "Vui lòng chọn loại thu chi",
  }),
  dien_giai: z.string().min(1, { message: "Vui lòng nhập diễn giải" }),
  tong_tien: z.string().min(1, { message: "Vui lòng nhập số tiền" }),
  ngay: z.string().optional(),
  co_so_id: z.string().optional(),
  nguoi_thuc_hien: z.string().optional(),
  tinh_trang: z.string().default("pending"),
  ghi_chu: z.string().optional(),
});

type FinanceFormValues = z.infer<typeof financeSchema>;

interface FinanceFormProps {
  initialData?: Partial<FinanceFormValues>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  facilities?: Facility[];
}

const FinanceForm = ({ initialData, onSubmit, onCancel, facilities = [] }: FinanceFormProps) => {
  const form = useForm<FinanceFormValues>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      loai_thu_chi: initialData?.loai_thu_chi || 'income',
      dien_giai: initialData?.dien_giai || '',
      ngay: initialData?.ngay || new Date().toISOString().split('T')[0],
      tong_tien: initialData?.tong_tien || '',
      nguoi_thuc_hien: initialData?.nguoi_thuc_hien || '',
      co_so_id: initialData?.co_so_id || '',
      ghi_chu: initialData?.ghi_chu || '',
      tinh_trang: initialData?.tinh_trang || 'pending'
    }
  });

  const handleFormSubmit = (values: FinanceFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="loai_thu_chi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại thu chi*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="income">Thu</SelectItem>
                  <SelectItem value="expense">Chi</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dien_giai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diễn giải*</FormLabel>
              <FormControl>
                <Input placeholder="Nhập diễn giải" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tong_tien"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tiền*</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Nhập số tiền" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ngay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày thực hiện</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {facilities.length > 0 && (
          <FormField
            control={form.control}
            name="co_so_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cơ sở</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cơ sở" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {facilities.map((facility) => (
                      <SelectItem key={facility.id} value={facility.id}>
                        {facility.ten_co_so}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="nguoi_thuc_hien"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Người thực hiện</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên người thực hiện" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tinh_trang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
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
                <Textarea placeholder="Nhập ghi chú" {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
          <Button type="submit">Lưu thông tin</Button>
        </div>
      </form>
    </Form>
  );
};

export default FinanceForm;
