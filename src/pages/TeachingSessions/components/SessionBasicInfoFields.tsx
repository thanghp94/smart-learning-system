
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
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.Ten_lop_full || `Lớp ${cls.id}`}
                    </SelectItem>
                  ))}
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
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.ten_nhan_su}
                    </SelectItem>
                  ))}
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
        name="Loai_bai_hoc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loại bài học</FormLabel>
            <FormControl>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại bài học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Học mới">Học mới</SelectItem>
                  <SelectItem value="Ôn tập">Ôn tập</SelectItem>
                  <SelectItem value="Kiểm tra">Kiểm tra</SelectItem>
                  <SelectItem value="Thực hành">Thực hành</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SessionBasicInfoFields;
