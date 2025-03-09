import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Class, Employee } from "@/lib/types";
import { sessionSchema } from "../schemas/sessionSchema";

interface SessionBasicInfoFieldsProps {
  form: UseFormReturn<z.infer<typeof sessionSchema>>;
  classes: Class[];
  teachers: Employee[];
  isLoading: boolean;
}

const SessionBasicInfoFields = ({ form, classes, teachers, isLoading }: SessionBasicInfoFieldsProps) => {
  console.log("SessionBasicInfoFields - classes:", classes);
  console.log("SessionBasicInfoFields - teachers:", teachers);
  
  // Helper function to get class display name
  const getClassDisplayName = (cls: Class) => {
    if (cls.Ten_lop_full) return cls.Ten_lop_full;
    if (cls.ten_lop_full) return cls.ten_lop_full;
    if (cls.ten_lop) return cls.ten_lop;
    return `Lớp ${cls.id}`;
  };
  
  return (
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
                  {classes && classes.length > 0 ? (
                    classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {getClassDisplayName(cls)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-classes" disabled>
                      Không có lớp học nào
                    </SelectItem>
                  )}
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
                  {teachers && teachers.length > 0 ? (
                    teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.ten_nhan_su}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-teachers" disabled>
                      Không có giáo viên nào
                    </SelectItem>
                  )}
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
        name="loai_bai_hoc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Loại bài học <span className="text-red-500">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại bài học" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Bài mới">Bài mới</SelectItem>
                <SelectItem value="Ôn tập">Ôn tập</SelectItem>
                <SelectItem value="Kiểm tra">Kiểm tra</SelectItem>
                <SelectItem value="Test">Test</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SessionBasicInfoFields;
