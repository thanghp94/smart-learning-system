
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeachingSession } from "@/lib/types";
import { UseFormReturn } from "react-hook-form";
import { SessionFormData } from "../schemas/sessionSchema";
import { facilityService } from "@/lib/supabase";

interface SessionBasicInfoFieldsProps {
  form: UseFormReturn<SessionFormData>;
  classes: any[];
  teachers: any[];
  isLoading: boolean;
}

const SessionBasicInfoFields: React.FC<SessionBasicInfoFieldsProps> = ({
  form,
  classes,
  teachers,
  isLoading,
}) => {
  const [facilities, setFacilities] = useState<any[]>([]);
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
    if (!selectedFacility) return;
    
    const fetchClassrooms = async () => {
      try {
        const facility = facilities.find(f => f.id === selectedFacility);
        if (facility && facility.phong_hoc) {
          // If phong_hoc is an array, use it directly
          if (Array.isArray(facility.phong_hoc)) {
            setClassrooms(facility.phong_hoc.map((room: string) => ({ id: room, name: room })));
          } 
          // If phong_hoc is a string, try to parse it as JSON
          else if (typeof facility.phong_hoc === 'string') {
            try {
              const rooms = JSON.parse(facility.phong_hoc);
              if (Array.isArray(rooms)) {
                setClassrooms(rooms.map((room: string) => ({ id: room, name: room })));
              }
            } catch (e) {
              console.error("Error parsing classrooms:", e);
              setClassrooms([]);
            }
          }
        } else {
          setClassrooms([]);
        }
      } catch (error) {
        console.error("Error fetching classrooms:", error);
      }
    };

    fetchClassrooms();
  }, [selectedFacility, facilities]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="lop_chi_tiet_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lớp học</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lớp học" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.ten_lop || classItem.ten_lop_full || classItem.id}
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
          name="giao_vien"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giáo viên</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="co_so_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cơ sở</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedFacility(value);
                  // Clear the classroom when changing facility
                  form.setValue("phong_hoc_id", "");
                }}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cơ sở" />
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
          name="phong_hoc_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phòng học</FormLabel>
              <Select
                disabled={isLoading || !selectedFacility || classrooms.length === 0}
                onValueChange={field.onChange}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng học" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classrooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="ngay_hoc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày học</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  disabled={isLoading}
                />
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
                <Input
                  {...field}
                  type="time"
                  disabled={isLoading}
                />
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
                <Input
                  {...field}
                  type="time"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="session_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buổi số</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  disabled={isLoading}
                />
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
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="normal">Bình thường</SelectItem>
                  <SelectItem value="review">Ôn tập</SelectItem>
                  <SelectItem value="test">Kiểm tra</SelectItem>
                  <SelectItem value="special">Đặc biệt</SelectItem>
                </SelectContent>
              </Select>
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
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                defaultValue={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trợ giảng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Không có</SelectItem>
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
      </div>
    </div>
  );
};

export default SessionBasicInfoFields;
