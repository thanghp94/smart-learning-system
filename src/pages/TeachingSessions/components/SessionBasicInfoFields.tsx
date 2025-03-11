
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Class, Employee, Facility } from "@/lib/types";
import { sessionSchema } from "../schemas/sessionSchema";
import { facilityService } from "@/lib/supabase";

interface SessionBasicInfoFieldsProps {
  form: UseFormReturn<z.infer<typeof sessionSchema>>;
  classes: Class[];
  teachers: Employee[];
  isLoading: boolean;
}

const SessionBasicInfoFields = ({ form, classes, teachers, isLoading }: SessionBasicInfoFieldsProps) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string>("");
  
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await facilityService.getAll();
        setFacilities(data);
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    };
    
    fetchFacilities();
  }, []);
  
  useEffect(() => {
    const fetchClassrooms = async () => {
      if (selectedFacility) {
        try {
          // This is a simplified example. In a real app, you would fetch classrooms by facility
          const mockClassrooms = [
            { id: "classroom1", ten_phong: "Phòng 101" },
            { id: "classroom2", ten_phong: "Phòng 102" },
            { id: "classroom3", ten_phong: "Phòng 103" },
            { id: "classroom4", ten_phong: "Phòng 104" },
          ];
          setClassrooms(mockClassrooms);
        } catch (error) {
          console.error("Error fetching classrooms:", error);
          setClassrooms([]);
        }
      } else {
        setClassrooms([]);
      }
    };
    
    fetchClassrooms();
  }, [selectedFacility]);
  
  // Helper function to get class display name
  const getClassDisplayName = (cls: Class) => {
    if (cls.Ten_lop_full) return cls.Ten_lop_full;
    if (cls.ten_lop_full) return cls.ten_lop_full;
    if (cls.ten_lop) return cls.ten_lop;
    return `Lớp ${cls.id}`;
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Thông tin cơ bản</h3>
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
          name="co_so_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cơ sở</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedFacility(value);
                  }} 
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cơ sở" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities && facilities.length > 0 ? (
                      facilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.ten_co_so}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-facilities" disabled>
                        Không có cơ sở nào
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
          name="phong_hoc_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phòng học</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoading || !selectedFacility}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng học" />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms && classrooms.length > 0 ? (
                      classrooms.map((classroom) => (
                        <SelectItem key={classroom.id} value={classroom.id}>
                          {classroom.ten_phong}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-classrooms" disabled>
                        {selectedFacility ? "Không có phòng học nào" : "Hãy chọn cơ sở trước"}
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
          name="tro_giang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trợ giảng</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trợ giảng" />
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
                        Không có trợ giảng nào
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
    </div>
  );
};

export default SessionBasicInfoFields;
