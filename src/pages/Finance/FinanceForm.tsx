
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Finance, Facility } from '@/lib/types';
import EntitySelect from './components/EntitySelect';
import TransactionTypeSelect from './components/TransactionTypeSelect';

const financeFormSchema = z.object({
  ngay: z.date({
    required_error: "Vui lòng chọn ngày",
  }),
  loai_thu_chi: z.string({
    required_error: "Vui lòng chọn loại thu chi",
  }),
  loai_doi_tuong: z.string().optional(),
  doi_tuong_id: z.string().optional().nullable(),
  co_so: z.string().optional().nullable(),
  loai_giao_dich: z.string({
    required_error: "Vui lòng chọn loại giao dịch",
  }),
  dien_giai: z.string().optional(),
  tong_tien: z.coerce.number({
    required_error: "Vui lòng nhập tổng tiền",
    invalid_type_error: "Vui lòng nhập số",
  }).gte(0, {
    message: "Tổng tiền phải lớn hơn hoặc bằng 0",
  }),
  kieu_thanh_toan: z.string().optional(),
  tinh_trang: z.string().default("pending"),
  ghi_chu: z.string().optional(),
});

interface FinanceFormProps {
  initialData?: Partial<Finance>;
  onSubmit: (formData: Partial<Finance>) => Promise<void>;
  onCancel: () => void;
  facilities: Facility[];
}

const FinanceForm: React.FC<FinanceFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  facilities,
}) => {
  const [transactionCategory, setTransactionCategory] = useState<string>(initialData?.loai_thu_chi || 'income');
  const [selectedEntityType, setSelectedEntityType] = useState<string | null>(initialData?.loai_doi_tuong || null);
  const [selectedEntityName, setSelectedEntityName] = useState<string>('');
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>('');

  // Create form
  const form = useForm<z.infer<typeof financeFormSchema>>({
    resolver: zodResolver(financeFormSchema),
    defaultValues: {
      ngay: initialData?.ngay ? new Date(initialData.ngay) : new Date(),
      loai_thu_chi: initialData?.loai_thu_chi || 'income',
      loai_doi_tuong: initialData?.loai_doi_tuong || undefined,
      doi_tuong_id: initialData?.doi_tuong_id || undefined,
      co_so: initialData?.co_so || undefined,
      loai_giao_dich: initialData?.loai_giao_dich || '',
      dien_giai: initialData?.dien_giai || '',
      tong_tien: initialData?.tong_tien || 0,
      kieu_thanh_toan: initialData?.kieu_thanh_toan || 'cash',
      tinh_trang: initialData?.tinh_trang || 'pending',
      ghi_chu: initialData?.ghi_chu || '',
    },
  });

  // Update the description when transaction type, entity type, or entity name changes
  useEffect(() => {
    if (selectedTransactionType && selectedEntityType && selectedEntityName) {
      const action = transactionCategory === 'income' ? 'Thu' : 'Chi';
      const description = `${action} ${selectedTransactionType} ${selectedEntityName}`;
      form.setValue('dien_giai', description);
    }
  }, [transactionCategory, selectedTransactionType, selectedEntityType, selectedEntityName, form]);

  // Handle entity type change
  const handleEntityTypeChange = (value: string) => {
    setSelectedEntityType(value);
    form.setValue('loai_doi_tuong', value);
    // Reset entity name when type changes
    setSelectedEntityName('');
    form.setValue('doi_tuong_id', null);
  };

  // Handle entity selection
  const handleEntityNameChange = (entityId: string, entityName: string) => {
    setSelectedEntityName(entityName);
  };

  // Handle transaction type change
  const handleTransactionTypeChange = (value: string, typeName: string) => {
    setSelectedTransactionType(typeName);
  };

  // Handle form submission
  const handleFormSubmit = async (values: z.infer<typeof financeFormSchema>) => {
    // Format the data for submission
    const formattedData = {
      ...values,
      ngay: format(values.ngay, 'yyyy-MM-dd'),
      // Convert empty strings to null for UUID fields
      co_so: values.co_so === '' ? null : values.co_so,
      doi_tuong_id: values.doi_tuong_id === '' ? null : values.doi_tuong_id,
    };

    await onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="ngay"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ngày</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="loai_thu_chi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại Thu Chi</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setTransactionCategory(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại thu chi" />
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

        <EntitySelect
          form={form}
          selectedEntityType={selectedEntityType}
          onEntityTypeChange={handleEntityTypeChange}
          onEntityNameChange={handleEntityNameChange}
          facilities={facilities}
        />

        <FormField
          control={form.control}
          name="co_so"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cơ sở</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || undefined}
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

        <TransactionTypeSelect
          form={form}
          selectedTransactionCategory={transactionCategory}
          selectedEntityType={selectedEntityType}
          onTransactionTypeChange={handleTransactionTypeChange}
        />

        <FormField
          control={form.control}
          name="dien_giai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diễn Giải</FormLabel>
              <FormControl>
                <Input placeholder="Diễn giải giao dịch" {...field} />
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
              <FormLabel>Tổng Tiền</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Nhập tổng tiền" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="kieu_thanh_toan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kiểu Thanh Toán</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || "cash"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kiểu thanh toán" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cash">Tiền mặt</SelectItem>
                  <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                  <SelectItem value="credit_card">Thẻ tín dụng</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tinh_trang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tình Trạng</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tình trạng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
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
              <FormLabel>Ghi Chú</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập ghi chú (nếu có)"
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
          <Button type="submit">Lưu</Button>
        </div>
      </form>
    </Form>
  );
};

export default FinanceForm;
