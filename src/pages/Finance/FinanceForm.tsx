
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Finance, Facility, Student, Employee, Contact } from '@/lib/types';
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
import { studentService, employeeService, contactService } from '@/lib/supabase';

// Define the schema for the finance form
const financeSchema = z.object({
  loai_thu_chi: z.string().min(1, { message: 'Vui lòng chọn loại giao dịch' }),
  dien_giai: z.string().min(2, { message: 'Diễn giải quá ngắn' }),
  ngay: z.string().min(1, { message: 'Vui lòng chọn ngày' }),
  tong_tien: z.string().min(1, { message: 'Vui lòng nhập số tiền' }),
  co_so: z.string().optional(),
  doi_tuong_id: z.string().optional(),
  loai_doi_tuong: z.string().optional(),
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
  const [students, setStudents] = useState<Student[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedEntityType, setSelectedEntityType] = useState<string | null>(
    initialData?.loai_doi_tuong || null
  );

  // Initialize the form with default values
  const form = useForm<FinanceFormValues>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      loai_thu_chi: initialData?.loai_thu_chi || 'expense',
      dien_giai: initialData?.dien_giai || '',
      ngay: initialData?.ngay || new Date().toISOString().split('T')[0],
      tong_tien: initialData?.tong_tien?.toString() || '',
      co_so: initialData?.co_so || '',
      doi_tuong_id: initialData?.doi_tuong_id || '',
      loai_doi_tuong: initialData?.loai_doi_tuong || '',
      thoi_gian_phai_tra: initialData?.thoi_gian_phai_tra
        ? new Date(initialData.thoi_gian_phai_tra).toISOString().split('T')[0]
        : '',
      tinh_trang: initialData?.tinh_trang || 'pending',
      ghi_chu: initialData?.ghi_chu || '',
    },
  });

  // Load related entities when the form loads or entity type changes
  useEffect(() => {
    const loadEntities = async () => {
      if (selectedEntityType === 'student' || !selectedEntityType) {
        try {
          const data = await studentService.getAll();
          setStudents(data);
        } catch (error) {
          console.error('Error loading students:', error);
        }
      }
      
      if (selectedEntityType === 'employee' || !selectedEntityType) {
        try {
          const data = await employeeService.getAll();
          setEmployees(data);
        } catch (error) {
          console.error('Error loading employees:', error);
        }
      }
      
      if (selectedEntityType === 'contact' || !selectedEntityType) {
        try {
          const data = await contactService.getAll();
          setContacts(data);
        } catch (error) {
          console.error('Error loading contacts:', error);
        }
      }
    };

    loadEntities();
  }, [selectedEntityType]);

  // Handle form submission
  const handleSubmit = (values: FinanceFormValues) => {
    // Convert tong_tien from string to number
    const formattedData = {
      ...values,
      tong_tien: parseFloat(values.tong_tien),
    };
    
    onSubmit(formattedData);
  };

  // Handle entity type change
  const handleEntityTypeChange = (value: string) => {
    setSelectedEntityType(value);
    form.setValue('loai_doi_tuong', value);
    form.setValue('doi_tuong_id', ''); // Reset entity ID when type changes
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="loai_thu_chi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại giao dịch <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="loai_doi_tuong"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại đối tượng</FormLabel>
                <Select onValueChange={(value) => handleEntityTypeChange(value)} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại đối tượng" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student">Học sinh</SelectItem>
                    <SelectItem value="employee">Nhân viên</SelectItem>
                    <SelectItem value="contact">Liên hệ</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedEntityType && (
            <FormField
              control={form.control}
              name="doi_tuong_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đối tượng</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đối tượng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedEntityType === 'student' &&
                        students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.ten_hoc_sinh}
                          </SelectItem>
                        ))}
                      
                      {selectedEntityType === 'employee' &&
                        employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.ten_nhan_su}
                          </SelectItem>
                        ))}
                      
                      {selectedEntityType === 'contact' &&
                        contacts.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.ten_lien_he}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
