import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Asset } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import AssetFormBasic from './components/AssetFormBasic';
import AssetFormDetails from './components/AssetFormDetails';
import AssetFormPurchase from './components/AssetFormPurchase';
import ImageUploadFields from './components/ImageUploadFields';

interface AssetFormProps {
  initialData?: Partial<Asset>;
  onSubmit: (data: AssetFormData) => void;
  onCancel: () => void;
}

const AssetForm: React.FC<AssetFormProps> = ({ initialData = {}, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [assetImages, setAssetImages] = useState({
    hinh_anh: initialData?.hinh_anh || '',
    hinh_anh_2: initialData?.hinh_anh_2 || ''
  });

  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      ten_csvc: initialData?.ten_CSVC || '',
      loai: initialData?.loai || '',
      danh_muc: initialData?.danh_muc || '',
      so_luong: initialData?.so_luong || 1,
      don_vi: initialData?.don_vi || '',
      so_tien_mua: initialData?.so_tien_mua || '',
      tinh_trang: initialData?.tinh_trang || 'active',
      trang_thai_so_huu: initialData?.trang_thai_so_huu || '',
      mo_ta_1: initialData?.mo_ta_1 || '',
      thuong_hieu: initialData?.thuong_hieu || '',
      mau: initialData?.mau || '',
      khu_vuc: initialData?.khu_vuc || '',
      hinh_anh: initialData?.hinh_anh || '',
      hinh_anh_2: initialData?.hinh_anh_2 || '',
      ghi_chu: initialData?.ghi_chu || '',
    },
  });

  const handleFormSubmit = (data: AssetFormData) => {
    console.log("Submitting asset form with data:", data);
    onSubmit(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    form.setValue(name as any, value);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    form.setValue(name as any, value === '' ? 0 : Number(value));
  };

  const handleImageUpload = async (url: string, field: keyof AssetFormData) => {
    form.setValue(field, url);
  };

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
              <AssetFormBasic 
                form={form} 
                handleChange={handleChange} 
                handleNumberChange={handleNumberChange} 
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Trạng thái</h3>
              <AssetFormDetails 
                form={form} 
                handleChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin bổ sung</h3>
              <AssetFormPurchase 
                form={form} 
                handleChange={handleChange} 
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Hình ảnh</h3>
              <ImageUploadFields
                assetData={assetImages}
                handleImageChange={handleImageChange}
                handleRemoveImage={handleRemoveImage}
                entityId={initialData?.id || 'new'}
                form={form}
                handleImageUpload={handleImageUpload}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">Lưu thông tin</Button>
        </div>
      </form>
    </Form>
  );
};

export default AssetForm;
