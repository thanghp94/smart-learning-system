
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

interface FinanceFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
}

const FinanceForm = ({ initialData, onSubmit }: FinanceFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      loai_thu_chi: initialData?.loai_thu_chi || 'thu',
      mo_ta: initialData?.mo_ta || '',
      so_tien: initialData?.so_tien || '',
      ngay_thuc_hien: initialData?.ngay_thuc_hien || '',
      nguoi_thuc_hien: initialData?.nguoi_thuc_hien || '',
      ghi_chu: initialData?.ghi_chu || ''
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
            <SelectItem value="thu">Thu</SelectItem>
            <SelectItem value="chi">Chi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="mo_ta">Mô tả*</Label>
        <Input
          id="mo_ta"
          {...register('mo_ta', { required: true })}
          className={errors.mo_ta ? 'border-red-500' : ''}
        />
        {errors.mo_ta && <p className="text-red-500 text-xs mt-1">Vui lòng nhập mô tả</p>}
      </div>

      <div>
        <Label htmlFor="so_tien">Số tiền*</Label>
        <Input
          id="so_tien"
          type="number"
          {...register('so_tien', { required: true })}
          className={errors.so_tien ? 'border-red-500' : ''}
        />
        {errors.so_tien && <p className="text-red-500 text-xs mt-1">Vui lòng nhập số tiền</p>}
      </div>

      <div>
        <Label htmlFor="ngay_thuc_hien">Ngày thực hiện</Label>
        <Input
          id="ngay_thuc_hien"
          type="date"
          {...register('ngay_thuc_hien')}
        />
      </div>

      <div>
        <Label htmlFor="nguoi_thuc_hien">Người thực hiện</Label>
        <Input id="nguoi_thuc_hien" {...register('nguoi_thuc_hien')} />
      </div>

      <div>
        <Label htmlFor="ghi_chu">Ghi chú</Label>
        <Textarea id="ghi_chu" {...register('ghi_chu')} rows={3} />
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        <Button type="submit">Lưu thông tin</Button>
      </div>
    </form>
  );
};

export default FinanceForm;
