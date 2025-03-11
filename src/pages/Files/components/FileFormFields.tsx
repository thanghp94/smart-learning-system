
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FileFormFieldsProps {
  form: any;
}

const FileFormFields: React.FC<FileFormFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="loai_tai_lieu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loại tài liệu</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại tài liệu" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="contract">Hợp đồng</SelectItem>
                <SelectItem value="document">Tài liệu</SelectItem>
                <SelectItem value="image">Hình ảnh</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ten_tai_lieu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên tài liệu</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nhập tên tài liệu" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mo_ta"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Nhập mô tả" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nhập tags (cách nhau bằng dấu phẩy)" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="do_uu_tien"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Độ ưu tiên</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn độ ưu tiên" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="low">Thấp</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="high">Cao</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="doi_tuong_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID đối tượng</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nhập ID đối tượng" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="loai_doi_tuong"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loại đối tượng</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại đối tượng" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="student">Học sinh</SelectItem>
                <SelectItem value="employee">Nhân viên</SelectItem>
                <SelectItem value="class">Lớp học</SelectItem>
                <SelectItem value="facility">Cơ sở</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FileFormFields;
