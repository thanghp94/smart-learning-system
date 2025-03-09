
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/DatePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { StudentFormValues } from "../schemas/studentSchema";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<StudentFormValues>;
  facilities: any[];
  isLoadingFacilities: boolean;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ 
  form, 
  facilities, 
  isLoadingFacilities 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="ten_hoc_sinh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên học sinh</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên học sinh" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gioi_tinh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giới tính</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value || ''}
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
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="co_so_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cơ sở</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isLoadingFacilities}
              >
                <FormControl>
                  <SelectTrigger>
                    {isLoadingFacilities ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Đang tải...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Chọn cơ sở" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {facilities.map((facility) => (
                    <SelectItem 
                      key={facility.id} 
                      value={facility.id}
                    >
                      {facility.ten_co_so}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Cơ sở học tập của học sinh
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default PersonalInfoFields;
