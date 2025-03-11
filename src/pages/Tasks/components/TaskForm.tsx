
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { employeeService, taskService } from "@/lib/supabase";
import { Employee, Task } from "@/lib/types";
import { format } from "date-fns";

const taskSchema = z.object({
  ten_viec: z.string().min(1, "Vui lòng nhập tên công việc"),
  dien_giai: z.string().optional(),
  ghi_chu: z.string().optional(),
  loai_viec: z.string().optional(),
  doi_tuong: z.string().optional(),
  doi_tuong_id: z.string().optional(),
  nguoi_phu_trach: z.string().min(1, "Vui lòng chọn người phụ trách"),
  ngay_den_han: z.string().optional(),
  cap_do: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialValues?: Partial<Task>;
  onSubmit: () => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Format date field for the form
  const formattedInitialValues = initialValues ? {
    ...initialValues,
    ngay_den_han: initialValues.ngay_den_han 
      ? format(new Date(initialValues.ngay_den_han), 'yyyy-MM-dd')
      : undefined
  } : undefined;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: formattedInitialValues || {
      ten_viec: "",
      dien_giai: "",
      ghi_chu: "",
      loai_viec: "",
      doi_tuong: "",
      doi_tuong_id: "",
      nguoi_phu_trach: "",
      ngay_den_han: "",
      cap_do: "medium",
    },
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const data = await employeeService.getAll();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (values: TaskFormValues) => {
    try {
      setIsLoading(true);
      const taskData: Partial<Task> = {
        ...values,
        // Only process date if it exists
        ...(values.ngay_den_han ? { ngay_den_han: values.ngay_den_han } : {})
      };

      if (initialValues?.id) {
        await taskService.update(initialValues.id, taskData);
      } else {
        await taskService.create(taskData);
      }
      onSubmit();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="ten_viec"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên công việc</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên công việc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dien_giai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diễn giải</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả chi tiết công việc"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="loai_viec"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại việc</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại việc" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Hành chính</SelectItem>
                    <SelectItem value="teaching">Giảng dạy</SelectItem>
                    <SelectItem value="facility">Cơ sở vật chất</SelectItem>
                    <SelectItem value="student">Học sinh</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cap_do"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cấp độ ưu tiên</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cấp độ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
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
            name="nguoi_phu_trach"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Người phụ trách</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn người phụ trách" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.ten_nhan_su}
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
            name="ngay_den_han"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày đến hạn</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ""} />
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
                  placeholder="Ghi chú thêm"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {initialValues?.id ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
