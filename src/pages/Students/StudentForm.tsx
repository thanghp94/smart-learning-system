
import React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { facilityService } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const studentSchema = z.object({
  ten_hoc_sinh: z.string().min(1, { message: "Vui lòng nhập tên học sinh" }),
  gioi_tinh: z.string().optional(),
  ngay_sinh: z.string().optional(),
  co_so_ID: z.string().optional(),
  ten_PH: z.string().optional(),
  sdt_ph1: z.string().optional(),
  email_ph1: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  dia_chi: z.string().optional(),
  ct_hoc: z.string().optional(),
  trang_thai: z.string().default("active"),
  mo_ta_hs: z.string().optional(),
  userid: z.string().optional(),
  password: z.string().optional(),
  parentid: z.string().optional(),
  parentpassword: z.string().optional(),
  han_hoc_phi: z.string().optional(),
  ngay_bat_dau_hoc_phi: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
  initialData?: Partial<StudentFormData>;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { toast } = useToast();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(false);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData || {
      ten_hoc_sinh: "",
      gioi_tinh: "",
      ngay_sinh: "",
      co_so_ID: "",
      ten_PH: "",
      sdt_ph1: "",
      email_ph1: "",
      dia_chi: "",
      ct_hoc: "",
      trang_thai: "active",
      mo_ta_hs: "",
      userid: "",
      password: "",
      parentid: "",
      parentpassword: "",
      han_hoc_phi: "",
      ngay_bat_dau_hoc_phi: "",
    },
  });

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

  const handleSubmit = (data: StudentFormData) => {
    // Process dates if they exist
    const processedData = {
      ...data,
      ngay_sinh: data.ngay_sinh ? new Date(data.ngay_sinh) : undefined,
      han_hoc_phi: data.han_hoc_phi ? new Date(data.han_hoc_phi) : undefined,
      ngay_bat_dau_hoc_phi: data.ngay_bat_dau_hoc_phi ? new Date(data.ngay_bat_dau_hoc_phi) : undefined,
    };
    
    onSubmit(processedData);
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
                  </SelectContent>
                </Select>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Input placeholder="Nhập email" type="email" {...field} />
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ct_hoc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chương trình học</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập chương trình học" {...field} />
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
                <FormLabel>Trạng thái</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Đang học</SelectItem>
                    <SelectItem value="inactive">Đã nghỉ</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                  </SelectContent>
                </Select>
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
        </div>

        <FormField
          control={form.control}
          name="mo_ta_hs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả học sinh</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập thông tin bổ sung về học sinh"
                  className="resize-none h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">Lưu</Button>
        </div>
      </form>
    </Form>
  );
};

export default StudentForm;
