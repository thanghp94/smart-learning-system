
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Student } from "@/lib/types";
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
import { facilityService } from "@/lib/supabase";

const studentSchema = z.object({
  ten_hoc_sinh: z.string().min(2, { message: "Tên học sinh phải có ít nhất 2 ký tự" }),
  gioi_tinh: z.string().optional(),
  ngay_sinh: z.string().optional(),
  co_so_ID: z.string().optional(),
  ten_PH: z.string().optional(),
  sdt_ph1: z.string().optional(),
  email_ph1: z.string().email({ message: "Email không hợp lệ" }).optional().or(z.literal("")),
  dia_chi: z.string().optional(),
  ct_hoc: z.string().optional(),
  trang_thai: z.string().default("active"),
  mo_ta_hs: z.string().optional(),
  han_hoc_phi: z.string().optional(),
  ngay_bat_dau_hoc_phi: z.string().optional(),
  userID: z.string().optional(),
  Password: z.string().optional(),
  ParentID: z.string().optional(),
  ParentPassword: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  initialData?: Partial<Student>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(false);

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

    loadFacilities();
  }, [toast]);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      ten_hoc_sinh: initialData?.ten_hoc_sinh || "",
      gioi_tinh: initialData?.gioi_tinh || "",
      ngay_sinh: initialData?.ngay_sinh 
        ? new Date(initialData.ngay_sinh).toISOString().split("T")[0] 
        : "",
      co_so_ID: initialData?.co_so_ID || "",
      ten_PH: initialData?.ten_PH || "",
      sdt_ph1: initialData?.sdt_ph1 || "",
      email_ph1: initialData?.email_ph1 || "",
      dia_chi: initialData?.dia_chi || "",
      ct_hoc: initialData?.ct_hoc || "",
      trang_thai: initialData?.trang_thai || "active",
      mo_ta_hs: initialData?.mo_ta_hs || "",
      han_hoc_phi: initialData?.han_hoc_phi 
        ? new Date(initialData.han_hoc_phi).toISOString().split("T")[0] 
        : "",
      ngay_bat_dau_hoc_phi: initialData?.ngay_bat_dau_hoc_phi
        ? new Date(initialData.ngay_bat_dau_hoc_phi).toISOString().split("T")[0]
        : "",
      userID: initialData?.userID || "",
      Password: initialData?.Password || "",
      ParentID: initialData?.ParentID || "",
      ParentPassword: initialData?.ParentPassword || "",
    },
  });

  const handleSubmit = (values: StudentFormValues) => {
    try {
      // Format date values as ISO strings for the backend
      const submissionData = {
        ...values,
        ngay_sinh: values.ngay_sinh || undefined,
        han_hoc_phi: values.han_hoc_phi || undefined,
        ngay_bat_dau_hoc_phi: values.ngay_bat_dau_hoc_phi || undefined
      };
      
      console.log("Form data to submit:", submissionData);
      onSubmit(submissionData);
    } catch (error) {
      console.error("Error submitting student form:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu thông tin học sinh",
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
            name="gioi_tinh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giới tính</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ngay_sinh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày sinh</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="co_so_ID"
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
            name="ten_PH"
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
            name="sdt_ph1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại phụ huynh</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email_ph1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email phụ huynh</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập email phụ huynh" type="email" {...field} />
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
            name="han_hoc_phi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hạn học phí</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ngay_bat_dau_hoc_phi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu học phí</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trang_thai"
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
                    <SelectItem value="active">Đang học</SelectItem>
                    <SelectItem value="inactive">Ngừng học</SelectItem>
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
          name="dia_chi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập địa chỉ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mo_ta_hs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả học sinh</FormLabel>
              <FormControl>
                <Textarea placeholder="Mô tả thêm về học sinh" {...field} />
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

export default StudentForm;
