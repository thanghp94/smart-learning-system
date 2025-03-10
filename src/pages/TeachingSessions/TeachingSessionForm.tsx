
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ClockIcon } from 'lucide-react';
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
import { TimePicker } from '@/components/ui/time-picker';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { TeachingSession, Class, Employee, Session } from '@/lib/types';
import { classService, employeeService, sessionService } from '@/lib/supabase';

const teachingSessionFormSchema = z.object({
  lop_chi_tiet_id: z.string({
    required_error: "Vui lòng chọn lớp học",
  }),
  session_id: z.string({
    required_error: "Vui lòng chọn bài học",
  }),
  session_buoi_hoc_id: z.string().optional().nullable(),
  loai_bai_hoc: z.string().optional(),
  phong_hoc_id: z.string().optional(),
  ngay_hoc: z.date({
    required_error: "Vui lòng chọn ngày học",
  }),
  thoi_gian_bat_dau: z.string({
    required_error: "Vui lòng chọn thời gian bắt đầu",
  }),
  thoi_gian_ket_thuc: z.string({
    required_error: "Vui lòng chọn thời gian kết thúc",
  }),
  giao_vien: z.string({
    required_error: "Vui lòng chọn giáo viên",
  }),
  tro_giang: z.string().optional().nullable(),
  nhan_xet_1: z.string().optional(),
  nhan_xet_2: z.string().optional(),
  nhan_xet_3: z.string().optional(),
  nhan_xet_4: z.string().optional(),
  nhan_xet_5: z.string().optional(),
  nhan_xet_6: z.string().optional(),
  nhan_xet_chung: z.string().optional(),
  ghi_chu: z.string().optional(),
});

type TeachingSessionFormValues = z.infer<typeof teachingSessionFormSchema>;

interface TeachingSessionFormProps {
  initialData?: Partial<TeachingSession>;
  onSubmit: (data: Partial<TeachingSession>) => Promise<void>;
  onCancel: () => void;
}

const TeachingSessionForm: React.FC<TeachingSessionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [teachers, setTeachers] = useState<Employee[]>([]);
  const [assistants, setAssistants] = useState<Employee[]>([]);

  const form = useForm<TeachingSessionFormValues>({
    resolver: zodResolver(teachingSessionFormSchema),
    defaultValues: {
      lop_chi_tiet_id: initialData?.lop_chi_tiet_id || '',
      session_id: initialData?.session_id || '',
      session_buoi_hoc_id: initialData?.session_buoi_hoc_id || null,
      loai_bai_hoc: initialData?.loai_bai_hoc || '',
      phong_hoc_id: initialData?.phong_hoc_id || '',
      ngay_hoc: initialData?.ngay_hoc ? new Date(initialData.ngay_hoc) : new Date(),
      thoi_gian_bat_dau: initialData?.thoi_gian_bat_dau || '08:00',
      thoi_gian_ket_thuc: initialData?.thoi_gian_ket_thuc || '09:30',
      giao_vien: initialData?.giao_vien || '',
      tro_giang: initialData?.tro_giang || null,
      nhan_xet_1: initialData?.nhan_xet_1 || '',
      nhan_xet_2: initialData?.nhan_xet_2 || '',
      nhan_xet_3: initialData?.nhan_xet_3 || '',
      nhan_xet_4: initialData?.nhan_xet_4 || '',
      nhan_xet_5: initialData?.nhan_xet_5 || '',
      nhan_xet_6: initialData?.nhan_xet_6 || '',
      nhan_xet_chung: initialData?.nhan_xet_chung || '',
      ghi_chu: initialData?.ghi_chu || '',
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const classesData = await classService.getAll();
        setClasses(classesData);
      } catch (error) {
        console.error('Error loading classes:', error);
      }

      try {
        const sessionsData = await sessionService.getAll();
        setSessions(sessionsData);
      } catch (error) {
        console.error('Error loading sessions:', error);
      }

      try {
        const employeesData = await employeeService.getAll();
        const teachersData = employeesData.filter(e => e.chuc_danh === 'Giáo viên' || e.chuc_danh === 'Teacher');
        const assistantsData = employeesData.filter(e => e.chuc_danh === 'Trợ giảng' || e.chuc_danh === 'Teaching Assistant');
        
        setTeachers(teachersData.length > 0 ? teachersData : employeesData);
        setAssistants(assistantsData.length > 0 ? assistantsData : employeesData);
      } catch (error) {
        console.error('Error loading employees:', error);
      }
    };

    loadData();
  }, []);

  // Find the session based on buoi_hoc_so when the user selects it
  const handleSessionBuoiHocChange = (buoiHocSo: string) => {
    const selectedSession = sessions.find(s => s.buoi_hoc_so === buoiHocSo);
    if (selectedSession) {
      form.setValue('session_buoi_hoc_id', selectedSession.id);
    }
  };

  const handleSubmit = async (values: TeachingSessionFormValues) => {
    const formattedData = {
      ...values,
      ngay_hoc: format(values.ngay_hoc, 'yyyy-MM-dd'),
    };

    await onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="lop_chi_tiet_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lớp học</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="session_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bài học</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn bài học" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sessions.map((session) => (
                      <SelectItem key={session.id} value={session.id}>
                        Buổi {session.buoi_hoc_so}: {session.noi_dung_bai_hoc.substring(0, 30)}...
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
            name="loai_bai_hoc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại bài học</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại bài học" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="regular">Bài học thường</SelectItem>
                    <SelectItem value="review">Bài ôn tập</SelectItem>
                    <SelectItem value="test">Bài kiểm tra</SelectItem>
                    <SelectItem value="special">Bài học đặc biệt</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="session_buoi_hoc_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buổi học số</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleSessionBuoiHocChange(value);
                }}
                defaultValue={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn buổi học số" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      Buổi {session.buoi_hoc_so}
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
          name="phong_hoc_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phòng học</FormLabel>
              <FormControl>
                <Input placeholder="Nhập phòng học" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="ngay_hoc"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày học</FormLabel>
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
            name="thoi_gian_bat_dau"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Thời gian bắt đầu</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input placeholder="HH:MM" {...field} type="time" />
                  </FormControl>
                  <ClockIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thoi_gian_ket_thuc"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Thời gian kết thúc</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input placeholder="HH:MM" {...field} type="time" />
                  </FormControl>
                  <ClockIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="giao_vien"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giáo viên</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
            name="tro_giang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trợ giảng</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trợ giảng (nếu có)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Không có</SelectItem>
                    {assistants.map((assistant) => (
                      <SelectItem key={assistant.id} value={assistant.id}>
                        {assistant.ten_nhan_su}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border p-4 rounded-md">
          <h3 className="font-medium mb-2">Đánh giá buổi học</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nhan_xet_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu chí 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập đánh giá" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nhan_xet_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu chí 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập đánh giá" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nhan_xet_3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu chí 3</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập đánh giá" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nhan_xet_4"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu chí 4</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập đánh giá" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nhan_xet_5"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu chí 5</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập đánh giá" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nhan_xet_6"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu chí 6</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập đánh giá" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="nhan_xet_chung"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Nhận xét chung</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập nhận xét chung"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

export default TeachingSessionForm;
