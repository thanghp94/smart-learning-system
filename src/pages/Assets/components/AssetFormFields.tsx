import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUploadFields from './ImageUploadFields';

interface AssetFormFieldsProps {
  handleImageUpload?: (url: string, field: string) => void;
}

const AssetFormFields = ({ form, handleImageUpload }) => {
  const [assetImages, setAssetImages] = useState({
    hinh_anh: form.getValues('hinh_anh') || '',
    hinh_anh_2: form.getValues('hinh_anh_2') || ''
  });

  const handleImageChange = (field: string, url: string) => {
    setAssetImages(prev => ({
      ...prev,
      [field]: url
    }));
    form.setValue(field, url);
  };

  const handleRemoveImage = (field: string) => {
    setAssetImages(prev => ({
      ...prev,
      [field]: ''
    }));
    form.setValue(field, '');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="ten_csvc">Tên tài sản</Label>
        <Input id="ten_csvc" type="text" {...form.register('ten_csvc')} />
      </div>

      <div>
        <Label htmlFor="loai">Loại</Label>
        <Input id="loai" type="text" {...form.register('loai')} />
      </div>

      <div>
        <Label htmlFor="danh_muc">Danh mục</Label>
        <Input id="danh_muc" type="text" {...form.register('danh_muc')} />
      </div>

      <div>
        <Label htmlFor="so_luong">Số lượng</Label>
        <Input id="so_luong" type="number" {...form.register('so_luong', { valueAsNumber: true })} />
      </div>

      <div>
        <Label htmlFor="don_vi">Đơn vị</Label>
        <Input id="don_vi" type="text" {...form.register('don_vi')} />
      </div>

      <div>
        <Label htmlFor="so_tien_mua">Số tiền mua</Label>
        <Input id="so_tien_mua" type="text" {...form.register('so_tien_mua')} />
      </div>

      <div>
        <Label htmlFor="tinh_trang">Tình trạng</Label>
        <Select onValueChange={form.setValue.bind(null, 'tinh_trang')} defaultValue={form.getValues('tinh_trang')}>
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
        <Input id="trang_thai_so_huu" type="text" {...form.register('trang_thai_so_huu')} />
      </div>

      <div>
        <Label htmlFor="doi_tuong">Đối tượng</Label>
        <Input id="doi_tuong" type="text" {...form.register('doi_tuong')} />
      </div>

      <div>
        <Label htmlFor="doi_tuong_id">Đối tượng ID</Label>
        <Input id="doi_tuong_id" type="text" {...form.register('doi_tuong_id')} />
      </div>

      <div>
        <Label htmlFor="doi_tuong_chi_tiet">Đối tượng chi tiết</Label>
        <Input id="doi_tuong_chi_tiet" type="text" {...form.register('doi_tuong_chi_tiet')} />
      </div>

      <div className="col-span-full">
        <Label htmlFor="mo_ta_1">Mô tả 1</Label>
        <Textarea id="mo_ta_1" {...form.register('mo_ta_1')} />
      </div>

      <div className="col-span-full">
        <Label htmlFor="mo_ta_2">Mô tả 2</Label>
        <Textarea id="mo_ta_2" {...form.register('mo_ta_2')} />
      </div>

      <ImageUploadFields
        assetData={assetImages}
        handleImageChange={handleImageChange}
        handleRemoveImage={handleRemoveImage}
        entityId={form.getValues('id') || 'new'}
        form={form}
        handleImageUpload={handleImageUpload}
      />
    </div>
  );
};

export default AssetFormFields;
