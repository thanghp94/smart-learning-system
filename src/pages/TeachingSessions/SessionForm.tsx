
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TeachingSession, Class, Employee } from "@/lib/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { classService, employeeService } from "@/lib/supabase";
import { Textarea } from "@/components/ui/textarea";

const sessionSchema = z.object({
  lop_chi_tiet_id: z.string().min(1, "Vui lòng chọn lớp"),
  giao_vien: z.string().min(1, "Vui lòng chọn giáo viên"),
  ngay_hoc: z.string().min(1, "Vui lòng chọn ngày học"),
  thoi_gian_bat_dau: z.string().min(1, "Vui lòng nhập thời gian bắt đầu"),
  thoi_gian_ket_thuc: z.string().min(1, "Vui lòng nhập thời gian kết thúc"),
  session_id: z.string().min(1, "Vui lòng nhập số buổi học"),
  Loai_bai_hoc: z.string().optional(),
  noi_dung: z.string().optional(),
  nhan_xet_1: z.string().optional(),
  nhan_xet_2: z.string().optional(),
  nhan_xet_3: z.string().optional(),
  nhan_xet_4: z.string().optional(),
  nhan_xet_5: z.string().optional(),
  nhan_xet_6: z.string().optional(),
  trung_binh: z.number().optional(),
});

interface SessionFormProps {
  initialData?: Partial<TeachingSession>;
  onSubmit: (data: Partial<TeachingSession>) => void;
  isEdit?: boolean;
}

const SessionForm = ({ initialData, onSubmit, isEdit = false }: SessionFormProps) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: initialData || {
      lop_chi_tiet_id: "",
      giao_vien: "",
      ngay_hoc: new Date().toISOString().substring(0, 10),
      thoi_gian_bat_dau: "08:00",
      thoi_gian_ket_thuc: "09:30",
      session_id: "1",
      Loai_bai_hoc: "Học mới",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [classesData, teachersData] = await Promise.all([
          classService.getAll(),
          employeeService.getByRole("Giáo viên") // Assuming this gets teachers
        ]);
        
        setClasses(classesData);
        setTeachers(teachersData);
      } catch (error) {
        console.error("Error fetching form data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (data: z.infer<typeof sessionSchema>) => {
    // Calculate average score if evaluation scores are provided
    if (data.nhan_xet_1 || data.nhan_xet_2 || data.nhan_xet_3 || 
        data.nhan_xet_4 || data.nhan_xet_5 || data.nhan_xet_6) {
      
      const scores = [
        Number(data.nhan_xet_1 || 0),
        Number(data.nhan_xet_2 || 0),
        Number(data.nhan_xet_3 || 0),
        Number(data.nhan_xet_4 || 0),
        Number(data.nhan_xet_5 || 0),
        Number(data.nhan_xet_6 || 0)
      ].filter(score => score > 0);
      
      if (scores.length > 0) {
        const sum = scores.reduce((acc, score) => acc + score, 0);
        data.trung_binh = sum / scores.length;
      }
    }
    
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="lop_chi_tiet_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lớp học</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lớp học" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.Ten_lop_full || `Lớp ${cls.id}`}
                        </SelectItem>
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
            name="giao_vien"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giáo viên</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giáo viên" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.ten_nhan_su}
                        </SelectItem>
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
            name="ngay_hoc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày học</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="session_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buổi học số</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="thoi_gian_bat_dau"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời gian bắt đầu</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="thoi_gian_ket_thuc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời gian kết thúc</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="Loai_bai_hoc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại bài học</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại bài học" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Học mới">Học mới</SelectItem>
                      <SelectItem value="Ôn tập">Ôn tập</SelectItem>
                      <SelectItem value="Kiểm tra">Kiểm tra</SelectItem>
                      <SelectItem value="Thực hành">Thực hành</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="noi_dung"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung buổi học</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Mô tả nội dung buổi học" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="nhan_xet_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đánh giá 1 (1-10)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="10" step="0.5" {...field} />
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
                <FormLabel>Đánh giá 2 (1-10)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="10" step="0.5" {...field} />
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
                <FormLabel>Đánh giá 3 (1-10)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="10" step="0.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>Hủy</Button>
          <Button type="submit">{isEdit ? "Cập nhật" : "Thêm mới"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default SessionForm;
