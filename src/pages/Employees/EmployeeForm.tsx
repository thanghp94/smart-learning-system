
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
import { Employee } from "@/lib/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const employeeSchema = z.object({
  ten_nhan_su: z.string().min(1, "Vui lòng nhập tên nhân viên"),
  bo_phan: z.string().min(1, "Vui lòng nhập bộ phận"),
  chuc_danh: z.string().min(1, "Vui lòng nhập chức danh"),
  dien_thoai: z.string().min(1, "Vui lòng nhập số điện thoại"),
  email: z.string().email("Vui lòng nhập email hợp lệ"),
  co_so_id: z.string().optional(),
  tinh_trang_lao_dong: z.enum(["active", "inactive"]).default("active"),
  ngay_sinh: z.string().optional(),
  dia_chi: z.string().optional(),
  ma_so_thue: z.string().optional(),
  ghi_chu: z.string().optional(),
});

interface EmployeeFormProps {
  initialData?: Partial<Employee>;
  onSubmit: (data: Partial<Employee>) => void;
  isEdit?: boolean;
}

const EmployeeForm = ({ initialData, onSubmit, isEdit = false }: EmployeeFormProps) => {
  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData || {
      ten_nhan_su: "",
      bo_phan: "",
      chuc_danh: "",
      dien_thoai: "",
      email: "",
      tinh_trang_lao_dong: "active",
    },
  });

  const handleSubmit = (data: z.infer<typeof employeeSchema>) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ten_nhan_su"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên nhân viên</FormLabel>
                <FormControl>
                  <Input placeholder="Nguyễn Văn A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bo_phan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bộ phận</FormLabel>
                <FormControl>
                  <Input placeholder="Phòng Giáo vụ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="chuc_danh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chức danh</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chức danh" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Giáo viên">Giáo viên</SelectItem>
                      <SelectItem value="Quản lý">Quản lý</SelectItem>
                      <SelectItem value="Giáo vụ">Giáo vụ</SelectItem>
                      <SelectItem value="Kế toán">Kế toán</SelectItem>
                      <SelectItem value="Nhân viên">Nhân viên</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dien_thoai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="0901234567" {...field} />
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
                  <Input placeholder="example@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tinh_trang_lao_dong"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Đang làm việc</SelectItem>
                      <SelectItem value="inactive">Đã nghỉ việc</SelectItem>
                    </SelectContent>
                  </Select>
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
            name="dia_chi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input placeholder="123 Đường ABC, Quận XYZ" {...field} />
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

export default EmployeeForm;
