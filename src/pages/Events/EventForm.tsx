
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

interface EventFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
}

const EventForm = ({ initialData, onSubmit }: EventFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      ten_su_kien: initialData?.ten_su_kien || '',
      mo_ta: initialData?.mo_ta || '',
      ngay_bat_dau: initialData?.ngay_bat_dau || '',
      ngay_ket_thuc: initialData?.ngay_ket_thuc || '',
      dia_diem: initialData?.dia_diem || '',
      loai_su_kien: initialData?.loai_su_kien || '',
      trang_thai: initialData?.trang_thai || 'upcoming'
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="ten_su_kien">Tên sự kiện*</Label>
        <Input
          id="ten_su_kien"
          {...register('ten_su_kien', { required: true })}
          className={errors.ten_su_kien ? 'border-red-500' : ''}
        />
        {errors.ten_su_kien && <p className="text-red-500 text-xs mt-1">Vui lòng nhập tên sự kiện</p>}
      </div>

      <div>
        <Label htmlFor="mo_ta">Mô tả</Label>
        <Textarea id="mo_ta" {...register('mo_ta')} rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ngay_bat_dau">Ngày bắt đầu*</Label>
          <Input
            id="ngay_bat_dau"
            type="datetime-local"
            {...register('ngay_bat_dau', { required: true })}
            className={errors.ngay_bat_dau ? 'border-red-500' : ''}
          />
          {errors.ngay_bat_dau && <p className="text-red-500 text-xs mt-1">Vui lòng chọn ngày bắt đầu</p>}
        </div>

        <div>
          <Label htmlFor="ngay_ket_thuc">Ngày kết thúc</Label>
          <Input
            id="ngay_ket_thuc"
            type="datetime-local"
            {...register('ngay_ket_thuc')}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="dia_diem">Địa điểm</Label>
        <Input id="dia_diem" {...register('dia_diem')} />
      </div>

      <div>
        <Label htmlFor="loai_su_kien">Loại sự kiện</Label>
        <Select
          onValueChange={(value) => setValue('loai_su_kien', value)}
          defaultValue={watch('loai_su_kien')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại sự kiện" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="meeting">Cuộc họp</SelectItem>
            <SelectItem value="workshop">Hội thảo</SelectItem>
            <SelectItem value="ceremony">Lễ kỷ niệm</SelectItem>
            <SelectItem value="other">Khác</SelectItem>
          </SelectContent>
        </Select>
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
            <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
            <SelectItem value="ongoing">Đang diễn ra</SelectItem>
            <SelectItem value="completed">Đã kết thúc</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        <Button type="submit">Lưu thông tin</Button>
      </div>
    </form>
  );
};

export default EventForm;
