
import React, { useState } from 'react';
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
import ImageUpload from '@/components/common/ImageUpload';

interface AssetFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AssetForm = ({ initialData, onSubmit, onCancel }: AssetFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      ten_csvc: initialData?.ten_csvc || '',
      loai: initialData?.loai || '',
      danh_muc: initialData?.danh_muc || '',
      so_luong: initialData?.so_luong || 0,
      don_vi: initialData?.don_vi || '',
      so_tien_mua: initialData?.so_tien_mua || '',
      tinh_trang: initialData?.tinh_trang || 'good',
      trang_thai_so_huu: initialData?.trang_thai_so_huu || '',
      mo_ta_1: initialData?.mo_ta_1 || '',
      ghi_chu: initialData?.ghi_chu || '',
      // Additional fields
      thuong_hieu: initialData?.thuong_hieu || '',
      mau: initialData?.mau || '',
      size: initialData?.size || '',
      khu_vuc: initialData?.khu_vuc || '',
      chat_lieu: initialData?.chat_lieu || '',
      cau_hinh: initialData?.cau_hinh || '',
      so_seri: initialData?.so_seri || '',
      ngay_mua: initialData?.ngay_mua || '',
      noi_mua: initialData?.noi_mua || '',
      hinh_anh: initialData?.hinh_anh || '',
      hinh_anh_2: initialData?.hinh_anh_2 || ''
    }
  });

  // Watch image values
  const image1 = watch('hinh_anh');
  const image2 = watch('hinh_anh_2');

  // Handle image uploads
  const handleImageUpload = (field: string) => (url: string) => {
    setValue(field, url);
  };

  const handleImageRemove = (field: string) => () => {
    setValue(field, '');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ten_csvc">Tên tài sản*</Label>
          <Input
            id="ten_csvc"
            {...register('ten_csvc', { required: true })}
            className={errors.ten_csvc ? 'border-red-500' : ''}
          />
          {errors.ten_csvc && <p className="text-red-500 text-xs mt-1">Vui lòng nhập tên tài sản</p>}
        </div>

        <div>
          <Label htmlFor="loai">Loại</Label>
          <Input
            id="loai"
            {...register('loai')}
          />
        </div>

        <div>
          <Label htmlFor="danh_muc">Danh mục</Label>
          <Input
            id="danh_muc"
            {...register('danh_muc')}
          />
        </div>

        <div>
          <Label htmlFor="thuong_hieu">Thương hiệu</Label>
          <Input
            id="thuong_hieu"
            {...register('thuong_hieu')}
          />
        </div>

        <div>
          <Label htmlFor="mau">Màu sắc</Label>
          <Input
            id="mau"
            {...register('mau')}
          />
        </div>

        <div>
          <Label htmlFor="size">Kích thước</Label>
          <Input
            id="size"
            {...register('size')}
          />
        </div>

        <div>
          <Label htmlFor="chat_lieu">Chất liệu</Label>
          <Input
            id="chat_lieu"
            {...register('chat_lieu')}
          />
        </div>

        <div>
          <Label htmlFor="cau_hinh">Cấu hình</Label>
          <Input
            id="cau_hinh"
            {...register('cau_hinh')}
          />
        </div>

        <div>
          <Label htmlFor="so_luong">Số lượng</Label>
          <Input
            id="so_luong"
            type="number"
            {...register('so_luong', { valueAsNumber: true })}
          />
        </div>

        <div>
          <Label htmlFor="don_vi">Đơn vị</Label>
          <Input
            id="don_vi"
            {...register('don_vi')}
          />
        </div>

        <div>
          <Label htmlFor="so_tien_mua">Giá trị</Label>
          <Input
            id="so_tien_mua"
            {...register('so_tien_mua')}
          />
        </div>

        <div>
          <Label htmlFor="noi_mua">Nơi mua</Label>
          <Input
            id="noi_mua"
            {...register('noi_mua')}
          />
        </div>

        <div>
          <Label htmlFor="ngay_mua">Ngày mua</Label>
          <Input
            id="ngay_mua"
            type="date"
            {...register('ngay_mua')}
          />
        </div>

        <div>
          <Label htmlFor="so_seri">Số Seri</Label>
          <Input
            id="so_seri"
            {...register('so_seri')}
          />
        </div>

        <div>
          <Label htmlFor="khu_vuc">Khu vực</Label>
          <Input
            id="khu_vuc"
            {...register('khu_vuc')}
          />
        </div>

        <div>
          <Label htmlFor="tinh_trang">Tình trạng</Label>
          <Select
            onValueChange={(value) => setValue('tinh_trang', value)}
            defaultValue={watch('tinh_trang')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn tình trạng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="good">Tốt</SelectItem>
              <SelectItem value="damaged">Hư hỏng</SelectItem>
              <SelectItem value="maintenance">Bảo trì</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="trang_thai_so_huu">Trạng thái sở hữu</Label>
          <Input
            id="trang_thai_so_huu"
            {...register('trang_thai_so_huu')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hinh_anh" className="mb-2 block">Hình ảnh 1</Label>
          <input type="hidden" {...register('hinh_anh')} />
          <ImageUpload
            value={image1}
            onChange={handleImageUpload('hinh_anh')}
            onRemove={handleImageRemove('hinh_anh')}
          />
        </div>
        
        <div>
          <Label htmlFor="hinh_anh_2" className="mb-2 block">Hình ảnh 2</Label>
          <input type="hidden" {...register('hinh_anh_2')} />
          <ImageUpload
            value={image2}
            onChange={handleImageUpload('hinh_anh_2')}
            onRemove={handleImageRemove('hinh_anh_2')}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="mo_ta_1">Mô tả</Label>
        <Textarea id="mo_ta_1" {...register('mo_ta_1')} rows={3} />
      </div>

      <div>
        <Label htmlFor="ghi_chu">Ghi chú</Label>
        <Textarea id="ghi_chu" {...register('ghi_chu')} rows={2} />
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
        <Button type="submit">Lưu thông tin</Button>
      </div>
    </form>
  );
};

export default AssetForm;
