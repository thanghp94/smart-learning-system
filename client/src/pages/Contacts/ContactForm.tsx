import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Contact } from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Define the contact schema
const contactSchema = z.object({
  ten_lien_he: z.string().min(2, { message: "Tên liên hệ phải có ít nhất 2 ký tự" }),
  phan_loai: z.string().min(1, { message: "Phân loại là bắt buộc" }),
  mieu_ta: z.string().optional(),
  ngay_sinh: z.string().optional(),
  email: z.string().email({ message: "Email không hợp lệ" }).optional().or(z.literal('')),
  sdt: z.string().optional(),
  khu_vuc_dang_o: z.string().optional(),
  link_cv: z.string().optional(),
  trang_thai: z.string().default("active"),
  ghi_chu: z.string().optional(),
  doi_tuong_id: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  initialData?: Partial<Contact>;
  onSubmit: (data: ContactFormValues) => void;
  onCancel: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ initialData, onSubmit, onCancel }) => {
  // Process date values for form initialization
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      ten_lien_he: initialData?.ten_lien_he || "",
      phan_loai: initialData?.phan_loai || "",
      mieu_ta: initialData?.mieu_ta || "",
      ngay_sinh: initialData?.ngay_sinh ? new Date(initialData.ngay_sinh).toISOString().split('T')[0] : "",
      email: initialData?.email || "",
      sdt: initialData?.sdt || "",
      khu_vuc_dang_o: initialData?.khu_vuc_dang_o || "",
      link_cv: initialData?.link_cv || "",
      trang_thai: initialData?.trang_thai || "active",
      ghi_chu: initialData?.ghi_chu || "",
      doi_tuong_id: initialData?.doi_tuong_id || "",
    },
  });

  // ... keep existing code (form JSX)
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ... keep existing code (form fields) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ten_lien_he"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên liên hệ <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên liên hệ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phan_loai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phân loại <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phân loại" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="khách hàng">Khách hàng</SelectItem>
                    <SelectItem value="đối tác">Đối tác</SelectItem>
                    <SelectItem value="nhà cung cấp">Nhà cung cấp</SelectItem>
                    <SelectItem value="ứng viên">Ứng viên</SelectItem>
                    <SelectItem value="khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Input placeholder="Nhập email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sdt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại" {...field} />
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
            name="khu_vuc_dang_o"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Khu vực đang ở</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập khu vực đang ở" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="link_cv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link CV</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập link CV" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
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
          name="mieu_ta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Miêu tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập thông tin miêu tả" {...field} />
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
                <Textarea placeholder="Nhập ghi chú" {...field} />
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

export default ContactForm;
