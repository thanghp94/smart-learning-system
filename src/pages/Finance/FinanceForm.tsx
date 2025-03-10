
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Finance, Facility } from '@/lib/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TransactionTypeSelect from './components/TransactionTypeSelect';
import EntitySelect from './components/EntitySelect';

// Define the schema for the finance form
const financeSchema = z.object({
  loai_thu_chi: z.string().min(1, { message: 'Vui lòng chọn loại giao dịch' }),
  loai_doi_tuong: z.string().optional(),
  loai_giao_dich: z.string().optional(),
  dien_giai: z.string().min(2, { message: 'Diễn giải quá ngắn' }),
  ngay: z.string().min(1, { message: 'Vui lòng chọn ngày' }),
  tong_tien: z.string().min(1, { message: 'Vui lòng nhập số tiền' }),
  co_so: z.string().optional(),
  doi_tuong_id: z.string().optional(),
  thoi_gian_phai_tra: z.string().optional(),
  tinh_trang: z.string().default('pending'),
  ghi_chu: z.string().optional(),
});

type FinanceFormValues = z.infer<typeof financeSchema>;

interface FinanceFormProps {
  initialData?: Partial<Finance>;
  onSubmit: (data: Partial<Finance>) => void;
  onCancel: () => void;
  facilities: Facility[];
}

const FinanceForm: React.FC<FinanceFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  facilities,
}) => {
  const [selectedEntityType, setSelectedEntityType] = useState<string | null>(
    initialData?.loai_doi_tuong || null
  );
  const [selectedTransactionCategory, setSelectedTransactionCategory] = useState<string>(
    initialData?.loai_thu_chi || 'expense'
  );
  const [selectedEntityName, setSelectedEntityName] = useState<string>('');
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>('');

  // Initialize the form with default values
  const form = useForm<FinanceFormValues>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      loai_thu_chi: initialData?.loai_thu_chi || 'expense',
      loai_doi_tuong: initialData?.loai_doi_tuong || '',
      loai_giao_dich: initialData?.loai_giao_dich || '',
      dien_giai: initialData?.dien_giai || '',
      ngay: initialData?.ngay || new Date().toISOString().split('T')[0],
      tong_tien: initialData?.tong_tien?.toString() || '',
      co_so: initialData?.co_so || '',
      doi_tuong_id: initialData?.doi_tuong_id || '',
      thoi_gian_phai_tra: initialData?.thoi_gian_phai_tra
        ? new Date(initialData.thoi_gian_phai_tra).toISOString().split('T')[0]
        : '',
      tinh_trang: initialData?.tinh_trang || 'pending',
      ghi_chu: initialData?.ghi_chu || '',
    },
  });

  // Auto-generate the description based on selected options
  useEffect(() => {
    if (selectedTransactionCategory && selectedTransactionType && selectedEntityName) {
      const transactionAction = selectedTransactionCategory === 'income' ? 'Thu' : 'Chi';
      const generatedDescription = `${transactionAction} ${selectedTransactionType} ${selectedEntityName}`;
      
      // Only set the description if it hasn't been manually modified or is empty
      const currentDescription = form.getValues('dien_giai');
      if (!currentDescription || currentDescription === '') {
        form.setValue('dien_giai', generatedDescription);
      }
    }
  }, [selectedTransactionCategory, selectedTransactionType, selectedEntityName, form]);

  // Handle form submission
  const handleSubmit = (values: FinanceFormValues) => {
    // Convert tong_tien from string to number
    const formattedData = {
      ...values,
      tong_tien: parseFloat(values.tong_tien),
      // Ensure co_so is null if empty string to prevent UUID error
      co_so: values.co_so && values.co_so.trim() !== '' ? values.co_so : null,
      // Ensure doi_tuong_id is null if empty string to prevent UUID error
      doi_tuong_id: values.doi_tuong_id && values.doi_tuong_id.trim() !== '' ? values.doi_tuong_id : null,
      // Set empty date string to null to prevent date format error
      thoi_gian_phai_tra: values.thoi_gian_phai_tra && values.thoi_gian_phai_tra.trim() !== '' 
        ? values.thoi_gian_phai_tra 
        : null
    };
    
    onSubmit(formattedData);
  };

  // Handle entity type change
  const handleEntityTypeChange = (value: string) => {
    setSelectedEntityType(value);
    form.setValue('loai_doi_tuong', value);
    form.setValue('doi_tuong_id', ''); // Reset entity ID when type changes
    setSelectedEntityName(''); // Reset entity name
  };

  // Handle transaction category change
  const handleTransactionCategoryChange = (value: string) => {
    setSelectedTransactionCategory(value);
    form.setValue('loai_thu_chi', value);
    form.setValue('loai_giao_dich', ''); // Reset transaction type when category changes
    setSelectedTransactionType(''); // Reset transaction type name
  };

  // Handle entity name change
  const handleEntityNameChange = (entityId: string, entityName: string) => {
    form.setValue('doi_tuong_id', entityId);
    setSelectedEntityName(entityName);
  };

  // Handle transaction type change
  const handleTransactionTypeChange = (value: string) => {
    form.setValue('loai_giao_dich', value);
    setSelectedTransactionType(value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SECTION 1: Transaction Type and Entity Selection */}
          
          {/* Transaction Type selection */}
          <FormField
            control={form.control}
            name="loai_thu_chi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại giao dịch <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={(value) => handleTransactionCategoryChange(value)} defaultValue={field.value}>
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
          
          {/* Entity Type selection moved above Transaction Type */}
          <EntitySelect 
            form={form} 
            selectedEntityType={selectedEntityType}
            onEntityTypeChange={handleEntityTypeChange}
            onEntityNameChange={handleEntityNameChange}
            facilities={facilities}
          />
          
          {/* Transaction Category (Hạng mục) moved below Entity Type */}
          <TransactionTypeSelect 
            form={form} 
            selectedTransactionCategory={selectedTransactionCategory} 
            selectedEntityType={selectedEntityType}
            onTransactionTypeChange={handleTransactionTypeChange}
          />

          {/* SECTION 2: Transaction Details */}
          <FormField
            control={form.control}
            name="ngay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                <FormLabel>Số tiền <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số tiền" {...field} type="number" step="0.01" />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            name="co_so"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cơ sở</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            name="thoi_gian_phai_tra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời gian phải trả</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ''} />
                </FormControl>
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
              <FormLabel>Diễn giải <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Nhập diễn giải cho giao dịch" {...field} />
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
                <Textarea placeholder="Nhập ghi chú (nếu có)" {...field} className="resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">Lưu</Button>
        </div>
      </form>
    </Form>
  );
};

export default FinanceForm;
