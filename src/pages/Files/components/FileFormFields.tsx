
import React from 'react';
import { FormField, FormItem, FormLabel, Select, FormControl, 
  SelectTrigger, SelectValue, SelectContent, SelectItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/DatePicker';
import ImageUpload from '@/components/common/ImageUpload';

interface FileFormFieldsProps {
  form: any;
}

const FileFormFields: React.FC<FileFormFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="doi_tuong_lien_quan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Đối tượng liên quan</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đối tượng liên quan" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="tai_lieu">Tài liệu</SelectItem>
                <SelectItem value="nhan_vien">Nhân viên</SelectItem>
                <SelectItem value="hoc_sinh">Học sinh</SelectItem>
                <SelectItem value="co_so">Cơ sở</SelectItem>
                <SelectItem value="csvc">CSVC</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nhom_tai_lieu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nhóm tài liệu</FormLabel>
            <Input
              {...field}
              placeholder="Nhập nhóm tài liệu"
            />
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
            <Input
              {...field}
              placeholder="Nhập tên tài liệu"
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dien_giai"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Diễn giải</FormLabel>
            <Textarea
              {...field}
              placeholder="Nhập diễn giải"
              className="resize-none"
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="ngay_cap"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ngày cấp</FormLabel>
              <DatePicker
                date={field.value ? new Date(field.value) : undefined}
                setDate={(date) => field.onChange(date)}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="han_tai_lieu"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Hạn tài liệu</FormLabel>
              <DatePicker
                date={field.value ? new Date(field.value) : undefined}
                setDate={(date) => field.onChange(date)}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="trang_thai"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trạng thái</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value || "active"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="file1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>File tài liệu</FormLabel>
            <ImageUpload
              value={field.value ? [field.value] : []}
              onChange={(url) => field.onChange(url)}
              onRemove={() => field.onChange("")}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ghi_chu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ghi chú</FormLabel>
            <Textarea
              {...field}
              placeholder="Nhập ghi chú"
              className="resize-none"
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FileFormFields;
