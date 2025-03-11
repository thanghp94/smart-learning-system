
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from 'react-hook-form';

interface FileFormFieldsProps {
  form: UseFormReturn<any>;
}

const FileFormFields: React.FC<FileFormFieldsProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="loai_doi_tuong"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Loại đối tượng</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại đối tượng" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="student">Học sinh</SelectItem>
              <SelectItem value="employee">Nhân viên</SelectItem>
              <SelectItem value="class">Lớp học</SelectItem>
              <SelectItem value="contact">Liên hệ</SelectItem>
              <SelectItem value="other">Khác</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FileFormFields;
