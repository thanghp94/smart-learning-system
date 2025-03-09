
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { StudentFormValues } from "../schemas/studentSchema";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; 

interface AdditionalInfoFieldsProps {
  form: UseFormReturn<StudentFormValues>;
}

const AdditionalInfoFields: React.FC<AdditionalInfoFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="ghi_chu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả học sinh</FormLabel>
            <FormControl>
              <Textarea placeholder="Mô tả thêm về học sinh" {...field} />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground mt-1">
              Thông tin này sẽ được lưu vào trường mo_ta_hs trong cơ sở dữ liệu
            </p>
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu học sinh</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Mật khẩu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="parentpassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu phụ huynh</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Mật khẩu phụ huynh" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default AdditionalInfoFields;
