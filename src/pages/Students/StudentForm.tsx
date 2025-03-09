
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { facilityService } from "@/lib/supabase";

// Define student statuses since it's missing from constants
const STUDENT_STATUSES = [
  { value: "active", label: "Đang học" },
  { value: "inactive", label: "Đã nghỉ" },
  { value: "pending", label: "Đang chờ" }
];

const studentSchema = z.object({
  ten_hoc_sinh: z.string().min(2, { message: "Tên học sinh phải có ít nhất 2 ký tự" }),
  gioi_tinh: z.string().optional(),
  ngay_sinh: z.date().optional(),
  co_so_ID: z.string().optional(),
  ten_PH: z.string().optional(),
  sdt_ph1: z.string().optional(),
  email_ph1: z.string().optional(),
  dia_chi: z.string().optional(),
  password: z.string().optional(),
  trang_thai: z.string().default("active"),
  ct_hoc: z.string().optional(),
  han_hoc_phi: z.date().optional(),
  ngay_bat_dau_hoc_phi: z.date().optional(),
  ghi_chu: z.string().optional(),
  parentpassword: z.string().optional(),
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

  const defaultValues: Partial<StudentFormValues> = {
    ten_hoc_sinh: initialData?.ten_hoc_sinh || "",
    gioi_tinh: initialData?.gioi_tinh || "",
    ngay_sinh: initialData?.ngay_sinh ? new Date(initialData.ngay_sinh) : undefined,
    co_so_ID: initialData?.co_so_ID || "",
    ten_PH: initialData?.ten_PH || "",
    sdt_ph1: initialData?.sdt_ph1 || "",
    email_ph1: initialData?.email_ph1 || "",
    dia_chi: initialData?.dia_chi || "",
    password: initialData?.password || "",
    trang_thai: initialData?.trang_thai || "active",
    ct_hoc: initialData?.ct_hoc || "",
    han_hoc_phi: initialData?.han_hoc_phi ? new Date(initialData.han_hoc_phi) : undefined,
    ngay_bat_dau_hoc_phi: initialData?.ngay_bat_dau_hoc_phi ? new Date(initialData.ngay_bat_dau_hoc_phi) : undefined,
    ghi_chu: initialData?.ghi_chu || "",
    parentpassword: initialData?.parentpassword || "",
  };

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues
  });

  const handleSubmit = (values: StudentFormValues) => {
    try {
      // Convert form data to match the API expectations
      const submissionData = {
        ...values,
        // Dates will be handled by the service layer
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
              <FormItem className="flex flex-col">
                <FormLabel>Ngày sinh</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: vi })
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
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
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
                    {STUDENT_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
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
        </div>

        <div className="p-4 bg-slate-50 rounded-md">
          <h3 className="text-md font-medium mb-3">Thông tin phụ huynh</h3>
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
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Số điện thoại phụ huynh" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email phụ huynh" {...field} />
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
                    <Input placeholder="Địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-md">
          <h3 className="text-md font-medium mb-3">Thông tin học phí</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="han_hoc_phi"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Hạn đóng học phí</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: vi })
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
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ngay_bat_dau_hoc_phi"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ngày bắt đầu</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: vi })
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
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="ghi_chu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea placeholder="Ghi chú thêm về học sinh" {...field} />
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
