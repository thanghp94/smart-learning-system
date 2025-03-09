
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FileFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
}

const FileForm = ({ initialData, onSubmit }: FileFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      ten_file: initialData?.ten_file || '',
      loai_file: initialData?.loai_file || '',
      mo_ta: initialData?.mo_ta || '',
      duong_dan: initialData?.duong_dan || '',
      trang_thai: initialData?.trang_thai || 'active'
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="ten_file">Tên file*</Label>
        <Input
          id="ten_file"
          {...register('ten_file', { required: true })}
          className={errors.ten_file ? 'border-red-500' : ''}
        />
        {errors.ten_file && <p className="text-red-500 text-xs mt-1">Vui lòng nhập tên file</p>}
      </div>

      <div>
        <Label htmlFor="loai_file">Loại file</Label>
        <Select
          onValueChange={(value) => setValue('loai_file', value)}
          defaultValue={watch('loai_file')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại file" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="document">Tài liệu</SelectItem>
            <SelectItem value="image">Hình ảnh</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="other">Khác</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="mo_ta">Mô tả</Label>
        <Textarea id="mo_ta" {...register('mo_ta')} rows={3} />
      </div>

      <div>
        <Label htmlFor="duong_dan">Đường dẫn</Label>
        <Input id="duong_dan" {...register('duong_dan')} />
      </div>

      <div>
        <Label htmlFor="trang_thai">Trạng thái</Label>
        <Select
          onValueChange={(value) => setValue('trang_thai', value)}
          defaultValue={watch('trang_thai')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Đang sử dụng</SelectItem>
            <SelectItem value="archived">Đã lưu trữ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        <Button type="submit">Lưu thông tin</Button>
      </div>
    </form>
  );
};

export default FileForm;
