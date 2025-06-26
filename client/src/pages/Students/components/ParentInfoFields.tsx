
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { StudentFormValues } from "../schemas/studentSchema";

interface ParentInfoFieldsProps {
  form: UseFormReturn<StudentFormValues>;
}

const ParentInfoFields: React.FC<ParentInfoFieldsProps> = ({ form }) => {
  return (
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
              <p className="text-xs text-muted-foreground mt-1">
                Lưu vào trường ten_ph trong CSDL
              </p>
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
  );
};

export default ParentInfoFields;
