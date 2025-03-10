
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Class, Facility, Employee } from '@/lib/types';
import { facilityService, employeeService } from '@/lib/supabase';

const classFormSchema = z.object({
  ten_lop_full: z.string().min(1, 'Tên lớp không được để trống'),
  ten_lop: z.string().min(1, 'Tên lớp rút gọn không được để trống'),
  ct_hoc: z.string().optional(),
  co_so: z.string().optional().nullable(),
  gv_chinh: z.string().optional().nullable(),
  ngay_bat_dau: z.date().optional().nullable(),
  tinh_trang: z.string().default('active'),
  ghi_chu: z.string().optional(),
  unit: z.string().optional(),
  unit_id: z.string().optional(),
});

type ClassFormValues = z.infer<typeof classFormSchema>;

interface ClassFormProps {
  initialData?: Partial<Class>;
  onSubmit: (data: Partial<Class>) => Promise<void>;
  onCancel: () => void;
}

const ClassForm: React.FC<ClassFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [teachers, setTeachers] = useState<Employee[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>(initialData?.ct_hoc || '');

  // Form initialization
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      ten_lop_full: initialData?.ten_lop_full || '',
      ten_lop: initialData?.ten_lop || '',
      ct_hoc: initialData?.ct_hoc || '',
      co_so: initialData?.co_so || null,
      gv_chinh: initialData?.gv_chinh || null,
      ngay_bat_dau: initialData?.ngay_bat_dau ? new Date(initialData.ngay_bat_dau) : null,
      tinh_trang: initialData?.tinh_trang || 'active',
      ghi_chu: initialData?.ghi_chu || '',
      unit: initialData?.unit || '',
      unit_id: initialData?.unit_id || '',
    },
  });

  // Load facilities and teachers
  useEffect(() => {
    const loadData = async () => {
      try {
        const facilitiesData = await facilityService.getAll();
        setFacilities(facilitiesData);
      } catch (error) {
        console.error('Error loading facilities:', error);
      }

      try {
        const teachersData = await employeeService.getAll();
        setTeachers(teachersData);
      } catch (error) {
        console.error('Error loading teachers:', error);
      }
    };

    loadData();
  }, []);
  
  // Update selectedProgram state when the form value changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'ct_hoc') {
        setSelectedProgram(value.ct_hoc || '');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = async (values: ClassFormValues) => {
    // Format date for API submission
    const formattedData = {
      ...values,
      ngay_bat_dau: values.ngay_bat_dau ? format(values.ngay_bat_dau, 'yyyy-MM-dd') : null,
    };

    await onSubmit(formattedData);
  };

  // Unit options based on selected program
  const renderUnitOptions = () => {
    if (selectedProgram === 'GrapeSEED') {
      return Array.from({ length: 30 }, (_, i) => (
        <SelectItem key={i + 1} value={`Unit ${i + 1}`}>
          Unit {i + 1}
        </SelectItem>
      ));
    } else if (selectedProgram === 'Tiếng Anh hội nhập') {
      return Array.from({ length: 12 }, (_, i) => (
        <SelectItem key={i + 1} value={`Unit ${i + 1}`}>
          Unit {i + 1}
        </SelectItem>
      ));
    } else if (selectedProgram === 'World Scholar Cup') {
      return ['Alpha', 'Beta', 'Gamma', 'Delta'].map(unit => (
        <SelectItem key={unit} value={unit}>
          {unit}
        </SelectItem>
      ));
    } else if (selectedProgram === 'Chương trình hè') {
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'].map(unit => (
        <SelectItem key={unit} value={unit}>
          {unit}
        </SelectItem>
      ));
    }
    
    return <SelectItem value="None">Không có</SelectItem>;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="ten_lop_full"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên lớp đầy đủ</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên lớp đầy đủ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ten_lop"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên lớp rút gọn</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên lớp rút gọn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ct_hoc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chương trình học</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('unit', ''); // Reset unit when program changes
                  }}
                  defaultValue={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chương trình học" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="GrapeSEED">GrapeSEED</SelectItem>
                    <SelectItem value="Tiếng Anh hội nhập">Tiếng Anh hội nhập</SelectItem>
                    <SelectItem value="World Scholar Cup">World Scholar Cup</SelectItem>
                    <SelectItem value="Chương trình hè">Chương trình hè</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit hiện tại</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ''}
                  disabled={!selectedProgram}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedProgram ? "Chọn Unit" : "Chọn chương trình học trước"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {renderUnitOptions()}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="co_so"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cơ sở</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || ''}
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
          name="gv_chinh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giáo viên chính</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giáo viên" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.ten_nhan_su}
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
          name="ngay_bat_dau"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ngày bắt đầu</FormLabel>
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
                    selected={field.value || undefined}
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
          name="tinh_trang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tình trạng</FormLabel>
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
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="inactive">Tạm dừng</SelectItem>
                  <SelectItem value="completed">Đã kết thúc</SelectItem>
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

export default ClassForm;
