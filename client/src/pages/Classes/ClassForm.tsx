
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Facility, Employee, Class } from "@/lib/types";
import { facilityService, employeeService } from "@/lib/supabase";

interface ClassFormProps {
  initialData?: Partial<Class>;
  onSubmit: (data: Partial<Class>) => void;
  onCancel: () => void;
}

const ClassForm: React.FC<ClassFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [teachers, setTeachers] = useState<Employee[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.ngay_bat_dau
      ? new Date(initialData.ngay_bat_dau)
      : undefined
  );

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Partial<Class>>({
    defaultValues: {
      id: initialData?.id || "",
      ten_lop_full: initialData?.ten_lop_full || "",
      ten_lop: initialData?.ten_lop || "",
      ct_hoc: initialData?.ct_hoc || "",
      co_so: initialData?.co_so || "",
      gv_chinh: initialData?.gv_chinh || "",
      tinh_trang: initialData?.tinh_trang || "active",
      ghi_chu: initialData?.ghi_chu || "",
      unit_id: initialData?.unit_id || "",
    },
  });

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const data = await facilityService.getAll();
        setFacilities(data);
      } catch (error) {
        console.error("Error loading facilities:", error);
      }
    };

    const loadTeachers = async () => {
      try {
        const data = await employeeService.getByRole("Giáo viên");
        setTeachers(data);
      } catch (error) {
        console.error("Error loading teachers:", error);
      }
    };

    loadFacilities();
    loadTeachers();
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    setValue("ngay_bat_dau", date ? format(date, "yyyy-MM-dd") : undefined);
  };

  const handleFormSubmit = (data: Partial<Class>) => {
    onSubmit({
      ...data,
      ngay_bat_dau: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ten_lop_full">Tên lớp đầy đủ *</Label>
          <Input
            id="ten_lop_full"
            {...register("ten_lop_full", { required: true })}
            className={errors.ten_lop_full ? "border-red-500" : ""}
          />
          {errors.ten_lop_full && <p className="text-red-500 text-xs">Vui lòng nhập tên lớp đầy đủ</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ten_lop">Tên lớp viết tắt *</Label>
          <Input
            id="ten_lop"
            {...register("ten_lop", { required: true })}
            className={errors.ten_lop ? "border-red-500" : ""}
          />
          {errors.ten_lop && <p className="text-red-500 text-xs">Vui lòng nhập tên lớp viết tắt</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ct_hoc">Chương trình học</Label>
          <Input
            id="ct_hoc"
            {...register("ct_hoc")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unit_id">Mã Unit</Label>
          <Input
            id="unit_id"
            {...register("unit_id")}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="co_so">Cơ sở</Label>
          <Select
            value={watch("co_so") as string}
            onValueChange={(value) => setValue("co_so", value)}
          >
            <SelectTrigger id="co_so">
              <SelectValue placeholder="Chọn cơ sở" />
            </SelectTrigger>
            <SelectContent>
              {facilities.map((facility) => (
                <SelectItem key={facility.id} value={facility.id}>
                  {facility.ten_co_so}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gv_chinh">Giáo viên chính</Label>
          <Select
            value={watch("gv_chinh") as string}
            onValueChange={(value) => setValue("gv_chinh", value)}
          >
            <SelectTrigger id="gv_chinh">
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
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ngay_bat_dau">Ngày bắt đầu</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tinh_trang">Tình trạng</Label>
          <Select
            value={watch("tinh_trang") as string}
            onValueChange={(value) => setValue("tinh_trang", value)}
          >
            <SelectTrigger id="tinh_trang">
              <SelectValue placeholder="Chọn tình trạng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="closed">Đã đóng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ghi_chu">Ghi chú</Label>
        <Textarea
          id="ghi_chu"
          {...register("ghi_chu")}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">Lưu</Button>
      </div>
    </form>
  );
};

export default ClassForm;
