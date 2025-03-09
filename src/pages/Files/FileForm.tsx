
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fileSchema } from './schemas/fileSchema';
import { File } from '@/lib/types';

interface FileFormProps {
  initialData?: Partial<File>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const FileForm = ({ initialData, onSubmit, onCancel }: FileFormProps) => {
  // Process date values from initialData
  const defaultValues = {
    ten_tai_lieu: initialData?.ten_tai_lieu || '',
    doi_tuong_lien_quan: initialData?.doi_tuong_lien_quan || '',
    nhom_tai_lieu: initialData?.nhom_tai_lieu || '',
    ngay_cap: initialData?.ngay_cap ? new Date(initialData.ngay_cap) : undefined,
    han_tai_lieu: initialData?.han_tai_lieu ? new Date(initialData.han_tai_lieu) : undefined,
    ghi_chu: initialData?.ghi_chu || '',
    trang_thai: initialData?.trang_thai || 'active',
  };

  const form = useForm({
    resolver: zodResolver(fileSchema),
    defaultValues
  });

  const handleFormSubmit = (values: any) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="ten_tai_lieu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên tài liệu*</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên tài liệu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="doi_tuong_lien_quan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đối tượng liên quan*</FormLabel>
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
                  <SelectItem value="nhan_vien">Nhân viên</SelectItem>
                  <SelectItem value="hoc_sinh">Học sinh</SelectItem>
                  <SelectItem value="co_so">Cơ sở</SelectItem>
                  <SelectItem value="CSVC">Tài sản</SelectItem>
                  <SelectItem value="lien_he">Liên hệ</SelectItem>
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
              <FormControl>
                <Input placeholder="Nhập nhóm tài liệu" {...field} />
              </FormControl>
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
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ghi_chu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập ghi chú" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="trang_thai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="archived">Đã lưu trữ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
          <Button type="submit">Lưu thông tin</Button>
        </div>
      </form>
    </Form>
  );
};

export default FileForm;
