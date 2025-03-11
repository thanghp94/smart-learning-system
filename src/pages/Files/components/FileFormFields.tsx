
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { FileFormValues } from '../schemas/fileSchema';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface EntityOption {
  id: string;
  name: string;
}

interface FileFormFieldsProps {
  form: UseFormReturn<FileFormValues>;
  entityType: string;
  setEntityType: (value: string) => void;
  entityOptions: EntityOption[];
  handleEntitySelect: (entityId: string) => void;
}

const FileFormFields: React.FC<FileFormFieldsProps> = ({
  form,
  entityType,
  setEntityType,
  entityOptions,
  handleEntitySelect
}) => {
  return (
    <>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="doi_tuong_lien_quan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đối tượng liên quan*</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setEntityType(value);
                }} 
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
                  <SelectItem value="csvc">CSVC</SelectItem>
                  <SelectItem value="lien_he">Liên hệ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {entityType && (
          <FormItem>
            <FormLabel>Chọn {entityType === 'nhan_vien' ? 'nhân viên' : 
                          entityType === 'hoc_sinh' ? 'học sinh' : 
                          entityType === 'co_so' ? 'cơ sở' : 
                          entityType === 'csvc' ? 'CSVC' : 'liên hệ'}</FormLabel>
            <Select onValueChange={handleEntitySelect}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={`Chọn ${entityType === 'nhan_vien' ? 'nhân viên' : 
                                          entityType === 'hoc_sinh' ? 'học sinh' : 
                                          entityType === 'co_so' ? 'cơ sở' : 
                                          entityType === 'csvc' ? 'CSVC' : 'liên hệ'}`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {entityOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      </div>

      <FormField
        control={form.control}
        name="nhom_tai_lieu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nhóm tài liệu</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhóm tài liệu" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="hop_dong">Hợp đồng</SelectItem>
                <SelectItem value="bang_cap">Bằng cấp</SelectItem>
                <SelectItem value="chung_chi">Chứng chỉ</SelectItem>
                <SelectItem value="hoa_don">Hóa đơn</SelectItem>
                <SelectItem value="khac">Khác</SelectItem>
              </SelectContent>
            </Select>
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
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "dd/MM/yyyy")
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
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? date.toISOString() : null)}
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
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "dd/MM/yyyy")
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
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? date.toISOString() : null)}
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
        name="trang_thai"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trạng thái</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
              </SelectContent>
            </Select>
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
            <FormControl>
              <Textarea
                placeholder="Nhập ghi chú"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default FileFormFields;
