
import React, { useState, useEffect } from 'react';
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
import { financeService, employeeService, facilityService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Employee, Facility } from '@/lib/types';
import BasicEntitySelector from './components/BasicEntitySelector';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import AmountCalculator from './components/AmountCalculator';
import TransactionTypeSelect from './components/TransactionTypeSelect';

// Finance form schema
const financeSchema = z.object({
  ngay: z.date(),
  loai_thu_chi: z.string(),
  loai_giao_dich: z.string().optional(),
  loai_doi_tuong: z.string().optional(),
  doi_tuong_id: z.string().optional(),
  co_so: z.string().optional(),
  dien_giai: z.string(),
  ten_phi: z.string().optional(),
  so_luong: z.number().optional(),
  don_vi: z.number().optional(),
  gia_tien: z.number().optional(),
  tong_tien: z.number(),
  kieu_thanh_toan: z.string().optional(),
  bang_chu: z.string().optional(),
  ghi_chu: z.string().optional(),
  nguoi_tao: z.string(),
});

interface FinanceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  entityType?: string;
  entityId?: string;
  initialData?: any;
}

const FinanceForm: React.FC<FinanceFormProps> = ({
  onSubmit,
  onCancel,
  entityType,
  entityId,
  initialData,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Setup form
  const form = useForm<z.infer<typeof financeSchema>>({
    resolver: zodResolver(financeSchema),
    defaultValues: initialData || {
      ngay: new Date(),
      loai_thu_chi: '',
      loai_giao_dich: '',
      loai_doi_tuong: entityType || '',
      doi_tuong_id: entityId || '',
      co_so: '',
      dien_giai: '',
      ten_phi: '',
      so_luong: 1,
      don_vi: 1,
      gia_tien: 0,
      tong_tien: 0,
      kieu_thanh_toan: 'cash',
      bang_chu: '',
      ghi_chu: '',
      nguoi_tao: '',
    },
  });

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empData, facData] = await Promise.all([
          employeeService.getAll(),
          facilityService.getAll(),
        ]);
        
        setEmployees(empData);
        setFacilities(facData);
      } catch (error) {
        console.error('Error fetching form data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu',
          variant: 'destructive',
        });
      }
    };

    fetchData();
  }, [toast]);

  // Watch values for calculations
  const watchThuChi = form.watch('loai_thu_chi');
  const watchAmount = form.watch('so_luong');
  const watchUnit = form.watch('don_vi');
  const watchPrice = form.watch('gia_tien');

  // Update total amount when quantity, unit or price changes
  useEffect(() => {
    const amount = watchAmount || 0;
    const unit = watchUnit || 0;
    const price = watchPrice || 0;
    const total = amount * unit * price;
    
    form.setValue('tong_tien', total);
  }, [watchAmount, watchUnit, watchPrice, form]);

  const handleSubmit = async (values: z.infer<typeof financeSchema>) => {
    setIsSubmitting(true);
    try {
      // Prepare data to save
      const financeData = {
        ...values,
        ngay: values.ngay.toISOString().split('T')[0],
      };
      
      // Use the unified onSubmit handler from props
      onSubmit(financeData);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xử lý biểu mẫu: ' + (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ngay"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày</FormLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loai_thu_chi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại thu/chi</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="thu">Thu</SelectItem>
                    <SelectItem value="chi">Chi</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {watchThuChi && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TransactionTypeSelect 
              form={form} 
              transactionCategory={watchThuChi} 
            />

            <BasicEntitySelector 
              form={form} 
              entityType={entityType}
              entityId={entityId}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="co_so"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cơ sở</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ''}
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

        <FormField
          control={form.control}
          name="dien_giai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diễn giải</FormLabel>
              <FormControl>
                <Input placeholder="Nhập diễn giải" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AmountCalculator form={form} />

        <PaymentMethodSelector form={form} />

        <FormField
          control={form.control}
          name="nguoi_tao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Người tạo</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn người tạo" />
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
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FinanceForm;
