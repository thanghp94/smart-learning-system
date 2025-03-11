
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Admission, ADMISSION_STATUS_MAP, AdmissionStatus } from '@/lib/types/admission';
import { useToast } from '@/hooks/use-toast';
import { admissionService } from '@/lib/supabase/admission-service';
import { employeeService } from '@/lib/supabase/employee-service';

// Định nghĩa schema validation cho form
const formSchema = z.object({
  ten_hoc_sinh: z.string().min(1, { message: 'Tên học sinh không được để trống' }),
  ngay_sinh: z.date().optional(),
  gioi_tinh: z.string().optional(),
  email: z.string().email({ message: 'Email không hợp lệ' }).optional().or(z.literal('')),
  so_dien_thoai: z.string().optional(),
  ten_phu_huynh: z.string().optional(),
  email_phu_huynh: z.string().email({ message: 'Email không hợp lệ' }).optional().or(z.literal('')),
  so_dien_thoai_phu_huynh: z.string().optional(),
  dia_chi: z.string().optional(),
  nguon_gioi_thieu: z.string().optional(),
  zalo: z.string().optional(),
  mieu_ta_hoc_sinh: z.string().optional(),
  ghi_chu: z.string().optional(),
  trang_thai: z.string().min(1, { message: 'Trạng thái không được để trống' }),
  nguoi_phu_trach: z.string().optional(),
});

interface AdmissionFormProps {
  initialData?: Admission;
  onSubmit: (data: Admission) => void;
  onCancel: () => void;
}

const AdmissionForm = ({ initialData, onSubmit, onCancel }: AdmissionFormProps) => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ten_hoc_sinh: initialData?.ten_hoc_sinh || '',
      ngay_sinh: initialData?.ngay_sinh ? new Date(initialData.ngay_sinh) : undefined,
      gioi_tinh: initialData?.gioi_tinh || '',
      email: initialData?.email || '',
      so_dien_thoai: initialData?.so_dien_thoai || '',
      ten_phu_huynh: initialData?.ten_phu_huynh || '',
      email_phu_huynh: initialData?.email_phu_huynh || '',
      so_dien_thoai_phu_huynh: initialData?.so_dien_thoai_phu_huynh || '',
      dia_chi: initialData?.dia_chi || '',
      nguon_gioi_thieu: initialData?.nguon_gioi_thieu || '',
      zalo: initialData?.zalo || '',
      mieu_ta_hoc_sinh: initialData?.mieu_ta_hoc_sinh || '',
      ghi_chu: initialData?.ghi_chu || '',
      trang_thai: initialData?.trang_thai || 'tim_hieu',
      nguoi_phu_trach: initialData?.nguoi_phu_trach || '',
    },
  });

  // Fetch employees for the assignee dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await employeeService.getAll();
      setEmployees(data);
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Format data
      const formattedData: Partial<Admission> = {
        ...values,
        ngay_sinh: values.ngay_sinh ? values.ngay_sinh.toISOString() : undefined,
        trang_thai: values.trang_thai as AdmissionStatus,
      };

      // Submit data
      let result;
      if (initialData?.id) {
        result = await admissionService.updateAdmission(initialData.id, formattedData);
      } else {
        result = await admissionService.createAdmission(formattedData);
      }

      if (result) {
        toast({
          title: initialData ? 'Cập nhật thành công' : 'Thêm mới thành công',
          description: `Học sinh ${values.ten_hoc_sinh} đã được ${initialData ? 'cập nhật' : 'thêm'} vào hệ thống`,
        });
        onSubmit(result);
      } else {
        toast({
          title: 'Có lỗi xảy ra',
          description: 'Không thể lưu thông tin học sinh',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting admission form:', error);
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Không thể lưu thông tin học sinh',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Thông tin học sinh</h3>
            
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
              name="ngay_sinh"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ngày sinh</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="text-left font-normal justify-start"
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: vi })
                          ) : (
                            <span className="text-muted-foreground">Chọn ngày sinh</span>
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
                        locale={vi}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email học sinh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="so_dien_thoai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại học sinh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zalo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zalo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập zalo học sinh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Thông tin phụ huynh và khác</h3>
            
            <FormField
              control={form.control}
              name="ten_phu_huynh"
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
              name="email_phu_huynh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email phụ huynh</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email phụ huynh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="so_dien_thoai_phu_huynh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại phụ huynh</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại phụ huynh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dia_chi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nguon_gioi_thieu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nguồn giới thiệu</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nguồn giới thiệu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Google">Google</SelectItem>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Giới thiệu">Giới thiệu</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="mieu_ta_hoc_sinh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miêu tả về học sinh</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Nhập thông tin mô tả về học sinh" 
                    className="min-h-[100px]" 
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
                <FormLabel>Ghi chú khác</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Nhập ghi chú khác" 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="trang_thai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ADMISSION_STATUS_MAP).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
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
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn người phụ trách" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.ten_nhan_su}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : (initialData ? 'Cập nhật' : 'Thêm mới')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AdmissionForm;
