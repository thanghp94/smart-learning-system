
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Class, Employee } from "@/lib/types";
import { SessionFormData } from "../schemas/sessionSchema";
import { DatePicker } from "@/components/ui/DatePicker";

interface SessionBasicInfoFieldsProps {
  form: UseFormReturn<SessionFormData>;
  classes: Class[];
  teachers: Employee[];
  isLoading: boolean;
}

const SessionBasicInfoFields = ({ form, classes, teachers, isLoading }: SessionBasicInfoFieldsProps) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <h2 className="text-lg font-medium mb-4">Thông tin cơ bản</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Select class */}
        <FormField
          control={form.control}
          name="lop_chi_tiet_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lớp</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lớp" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.ten_lop_full || cls.Ten_lop_full}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select teacher */}
        <FormField
          control={form.control}
          name="giao_vien"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giáo viên</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giáo viên" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.ten_nhan_su}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select assistant teacher */}
        <FormField
          control={form.control}
          name="tro_giang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trợ giảng</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                value={field.value || ""}
                defaultValue={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trợ giảng (không bắt buộc)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Không có trợ giảng</SelectItem>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.ten_nhan_su}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select class room */}
        <FormField
          control={form.control}
          name="phong_hoc_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phòng học</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nhập phòng học" value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Input session number */}
        <FormField
          control={form.control}
          name="session_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buổi học số</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nhập số buổi học" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select lesson type */}
        <FormField
          control={form.control}
          name="loai_bai_hoc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại bài học</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
                defaultValue={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại bài học" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Học mới">Học mới</SelectItem>
                  <SelectItem value="Ôn tập">Ôn tập</SelectItem>
                  <SelectItem value="Kiểm tra">Kiểm tra</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select date */}
        <FormField
          control={form.control}
          name="ngay_hoc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày học</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Input start time */}
        <FormField
          control={form.control}
          name="thoi_gian_bat_dau"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời gian bắt đầu</FormLabel>
              <FormControl>
                <Input {...field} type="time" placeholder="HH:MM" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Input end time */}
        <FormField
          control={form.control}
          name="thoi_gian_ket_thuc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời gian kết thúc</FormLabel>
              <FormControl>
                <Input {...field} type="time" placeholder="HH:MM" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default SessionBasicInfoFields;
