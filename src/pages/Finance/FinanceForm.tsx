
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
import { Facility } from '@/lib/types';

interface FinanceFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  facilities?: Facility[];
}

const FinanceForm = ({ initialData, onSubmit, onCancel, facilities = [] }: FinanceFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      loai_thu_chi: initialData?.loai_thu_chi || 'income',
      dien_giai: initialData?.dien_giai || '',
      ngay: initialData?.ngay || new Date().toISOString().split('T')[0],
      tong_tien: initialData?.tong_tien || '',
      nguoi_thuc_hien: initialData?.nguoi_thuc_hien || '',
      co_so_id: initialData?.co_so_id || '',
      ghi_chu: initialData?.ghi_chu || '',
      tinh_trang: initialData?.tinh_trang || 'pending'
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="loai_thu_chi">Loại thu chi*</Label>
        <Select
          onValueChange={(value) => setValue('loai_thu_chi', value)}
          defaultValue={watch('loai_thu_chi')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Thu</SelectItem>
            <SelectItem value="expense">Chi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dien_giai">Diễn giải*</Label>
        <Input
          id="dien_giai"
          {...register('dien_giai', { required: true })}
          className={errors.dien_giai ? 'border-red-500' : ''}
        />
        {errors.dien_giai && <p className="text-red-500 text-xs mt-1">Vui lòng nhập diễn giải</p>}
      </div>

      <div>
        <Label htmlFor="tong_tien">Số tiền*</Label>
        <Input
          id="tong_tien"
          type="number"
          {...register('tong_tien', { required: true })}
          className={errors.tong_tien ? 'border-red-500' : ''}
        />
        {errors.tong_tien && <p className="text-red-500 text-xs mt-1">Vui lòng nhập số tiền</p>}
      </div>

      <div>
        <Label htmlFor="ngay">Ngày thực hiện</Label>
        <Input
          id="ngay"
          type="date"
          {...register('ngay')}
        />
      </div>

      {facilities.length > 0 && (
        <div>
          <Label htmlFor="co_so_id">Cơ sở</Label>
          <Select
            onValueChange={(value) => setValue('co_so_id', value)}
            defaultValue={watch('co_so_id')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn cơ sở" />
            </SelectTrigger>
            <SelectContent>
              {facilities.map((facility) => (
                <SelectItem key={facility.id} value={facility.id}>
                  {facility.ten_co_so}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="nguoi_thuc_hien">Người thực hiện</Label>
        <Input id="nguoi_thuc_hien" {...register('nguoi_thuc_hien')} />
      </div>

      <div>
        <Label htmlFor="tinh_trang">Trạng thái</Label>
        <Select
          onValueChange={(value) => setValue('tinh_trang', value)}
          defaultValue={watch('tinh_trang')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="ghi_chu">Ghi chú</Label>
        <Textarea id="ghi_chu" {...register('ghi_chu')} rows={3} />
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
        <Button type="submit">Lưu thông tin</Button>
      </div>
    </form>
  );
};

export default FinanceForm;
