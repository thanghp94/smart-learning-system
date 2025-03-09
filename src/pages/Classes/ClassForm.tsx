
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Class } from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { facilityService, employeeService } from "@/lib/supabase";

const classSchema = z.object({
  ten_lop_full: z.string().min(2, { message: "Tên lớp đầy đủ phải có ít nhất 2 ký tự" }),
  ten_lop: z.string().min(1, { message: "Tên lớp phải có ít nhất 1 ký tự" }),
  ct_hoc: z.string().optional(),
  co_so: z.string().optional().nullable(),
  gv_chinh: z.string().optional().nullable(),
  ngay_bat_dau: z.string().optional(),
  tinh_trang: z.string().default("active"),
  ghi_chu: z.string().optional(),
  unit_id: z.string().optional(),
});

type ClassFormValues = z.infer<typeof classSchema>;

interface ClassFormProps {
  initialData?: Partial<Class>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ClassForm: React.FC<ClassFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(false);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        setIsLoadingFacilities(true);
        const data = await facilityService.getAll();
        setFacilities(data);
      } catch (error) {
        console.error("Error loading facilities:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách cơ sở",
          variant: "destructive",
        });
      } finally {
        setIsLoadingFacilities(false);
      }
    };

    const loadTeachers = async () => {
      try {
        setIsLoadingTeachers(true);
        const data = await employeeService.getAll();
        setTeachers(data);
      } catch (error) {
        console.error("Error loading teachers:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách giáo viên",
          variant: "destructive",
        });
      } finally {
        setIsLoadingTeachers(false);
      }
    };

    loadFacilities();
    loadTeachers();
  }, [toast]);

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      ten_lop_full: initialData?.ten_lop_full || "",
      ten_lop: initialData?.ten_lop || "",
      ct_hoc: initialData?.ct_hoc || "",
      co_so: initialData?.co_so as string || "",
      gv_chinh: initialData?.gv_chinh as string || "",
      ngay_bat_dau: initialData?.ngay_bat_dau 
        ? new Date(initialData.ngay_bat_dau).toISOString().split("T")[0] 
        : "",
      tinh_trang: initialData?.tinh_trang || "active",
      ghi_chu: initialData?.ghi_chu || "",
      unit_id: initialData?.unit_id || "",
    },
  });

  const handleSubmit = (values: ClassFormValues) => {
    try {
      // Convert form data to match the API expectations
      const submissionData = {
        ten_lop_full: values.ten_lop_full,
        ten_lop: values.ten_lop,
        ct_hoc: values.ct_hoc || '',
        co_so: values.co_so || null,
        gv_chinh: values.gv_chinh || null,
        ngay_bat_dau: values.ngay_bat_dau ? new Date(values.ngay_bat_dau).toISOString() : null,
        tinh_trang: values.tinh_trang,
        ghi_chu: values.ghi_chu || '',
        unit_id: values.unit_id || ''
      };
      
      console.log("Form data to submit:", submissionData);
      onSubmit(submissionData);
    } catch (error) {
      console.error("Error submitting class form:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu thông tin lớp học",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ten_lop_full"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên lớp đầy đủ <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên đầy đủ của lớp" {...field} />
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
                <FormLabel>Tên lớp <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên viết tắt của lớp" {...field} />
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
                  <Input placeholder="Chương trình học" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit ID</FormLabel>
                <FormControl>
                  <Input placeholder="Unit ID" {...field} />
                </FormControl>
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
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoadingFacilities || facilities.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingFacilities ? "Đang tải..." : "Chọn cơ sở"} />
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
                  defaultValue={field.value}
                  disabled={isLoadingTeachers || teachers.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingTeachers ? "Đang tải..." : "Chọn giáo viên"} />
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
              <FormItem>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                    <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                  </SelectContent>
                </Select>
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
                <Textarea placeholder="Ghi chú thêm về lớp học" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">Lưu</Button>
        </div>
      </form>
    </Form>
  );
};

export default ClassForm;
