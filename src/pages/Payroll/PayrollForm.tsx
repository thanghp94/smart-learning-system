
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Employee, Facility, Payroll } from "@/lib/types";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Fixing the type error by allowing numbers in the schema but coercing them to string
const payrollSchema = z.object({
  nhan_su_id: z.string().min(1, { message: "Vui lòng chọn nhân viên" }),
  nam: z.string().min(1, { message: "Vui lòng nhập năm" }),
  thang: z.string().min(1, { message: "Vui lòng chọn tháng" }),
  ngay: z.string().optional(),
  co_so_id: z.string().optional(),
  luong: z.coerce.number().min(0, { message: "Lương không thể âm" }).default(0),
  tong_luong_tru_BH: z.coerce.number().optional(),
  pc_tnhiem: z.coerce.number().optional(),
  pc_an_o: z.coerce.number().optional(),
  pc_dthoai: z.coerce.number().optional(),
  pc_xang_xe: z.coerce.number().optional(),
  tong_thu_nhap: z.coerce.number().optional(),
  cong_chuan: z.coerce.number().optional(),
  cong_thuc_lam: z.coerce.number().optional(),
  trang_thai: z.string().default("pending"),
});

type PayrollFormValues = z.infer<typeof payrollSchema>;

interface PayrollFormProps {
  initialData?: Partial<Payroll>;
  employees?: Employee[];
  facilities?: Facility[];
  onSubmit: (data: PayrollFormValues) => void;
  onCancel: () => void;
}

const PayrollForm: React.FC<PayrollFormProps> = ({ 
  initialData, 
  employees = [], 
  facilities = [], 
  onSubmit, 
  onCancel 
}) => {
  const form = useForm<PayrollFormValues>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      nhan_su_id: initialData?.nhan_su_id || "",
      nam: initialData?.nam || new Date().getFullYear().toString(),
      thang: initialData?.thang || (new Date().getMonth() + 1).toString(),
      ngay: initialData?.ngay || "",
      co_so_id: initialData?.co_so_id || "",
      luong: initialData?.luong || 0,
      tong_luong_tru_BH: initialData?.tong_luong_tru_BH || 0,
      pc_tnhiem: initialData?.pc_tnhiem || 0,
      pc_an_o: initialData?.pc_an_o || 0,
      pc_dthoai: initialData?.pc_dthoai || 0,
      pc_xang_xe: initialData?.pc_xang_xe || 0,
      tong_thu_nhap: initialData?.tong_thu_nhap || 0,
      cong_chuan: initialData?.cong_chuan || 22,
      cong_thuc_lam: initialData?.cong_thuc_lam || 22,
      trang_thai: initialData?.trang_thai || "pending",
    },
  });

  // Get all form values to calculate total income when salary, allowances change
  const watchSalary = form.watch("luong");
  const watchPC1 = form.watch("pc_tnhiem") || 0;
  const watchPC2 = form.watch("pc_an_o") || 0;
  const watchPC3 = form.watch("pc_dthoai") || 0;
  const watchPC4 = form.watch("pc_xang_xe") || 0;

  // Calculate total income when any salary component changes
  React.useEffect(() => {
    const totalIncome = watchSalary + watchPC1 + watchPC2 + watchPC3 + watchPC4;
    form.setValue("tong_thu_nhap", totalIncome);
  }, [watchSalary, watchPC1, watchPC2, watchPC3, watchPC4, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nhan_su_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhân viên <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhân viên" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.length > 0 ? (
                      employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.ten_nhan_su}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="">Không có nhân viên</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="co_so_id"
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
                    {facilities.length > 0 ? (
                      facilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.ten_co_so}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="">Không có cơ sở</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tháng <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tháng" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Tháng {i + 1}
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
            name="nam"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Năm <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn năm" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - 2 + i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="luong"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lương cơ bản</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tong_thu_nhap"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tổng thu nhập</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pc_tnhiem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phụ cấp trách nhiệm</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pc_an_o"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phụ cấp ăn ở</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pc_dthoai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phụ cấp điện thoại</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pc_xang_xe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phụ cấp xăng xe</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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
                    <SelectItem value="pending">Chờ duyệt</SelectItem>
                    <SelectItem value="approved">Đã duyệt</SelectItem>
                    <SelectItem value="paid">Đã thanh toán</SelectItem>
                    <SelectItem value="rejected">Từ chối</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

export default PayrollForm;
