
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Asset } from '@/lib/types';
import { assetSchema, AssetFormData } from './schemas/assetSchema';
import AssetFormFields from './components/AssetFormFields';

interface AssetFormProps {
  initialData?: Partial<Asset>;
  onSubmit: (data: AssetFormData) => void;
  onCancel: () => void;
}

const AssetForm = ({ initialData, onSubmit, onCancel }: AssetFormProps) => {
  const [assetData, setAssetData] = useState<AssetFormData>({
    ten_csvc: initialData?.ten_CSVC || '',
    loai: initialData?.loai || '',
    danh_muc: initialData?.danh_muc || '',
    so_luong: initialData?.so_luong || 0,
    don_vi: initialData?.don_vi || '',
    so_tien_mua: initialData?.so_tien_mua || '',
    tinh_trang: initialData?.tinh_trang || '',
    trang_thai_so_huu: initialData?.trang_thai_so_huu || '',
    mo_ta_1: initialData?.mo_ta_1 || '',
    thuong_hieu: initialData?.thuong_hieu || '',
    mau: initialData?.mau || '',
    khu_vuc: initialData?.khu_vuc || '',
    hinh_anh: initialData?.hinh_anh || '',
    hinh_anh_2: initialData?.hinh_anh_2 || '',
    ghi_chu: initialData?.ghi_chu || '',
  });

  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      ten_csvc: initialData?.ten_CSVC || '',
      loai: initialData?.loai || '',
      danh_muc: initialData?.danh_muc || '',
      so_luong: initialData?.so_luong || 0,
      don_vi: initialData?.don_vi || '',
      so_tien_mua: initialData?.so_tien_mua || '',
      tinh_trang: initialData?.tinh_trang || '',
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

  useEffect(() => {
    // Update form values when initialData changes (for editing)
    if (initialData) {
      setAssetData({
        ten_csvc: initialData.ten_CSVC || '',
        loai: initialData.loai || '',
        danh_muc: initialData.danh_muc || '',
        so_luong: initialData.so_luong || 0,
        don_vi: initialData.don_vi || '',
        so_tien_mua: initialData.so_tien_mua || '',
        tinh_trang: initialData.tinh_trang || '',
        trang_thai_so_huu: initialData.trang_thai_so_huu || '',
        mo_ta_1: initialData.mo_ta_1 || '',
        thuong_hieu: initialData.thuong_hieu || '',
        mau: initialData.mau || '',
        khu_vuc: initialData.khu_vuc || '',
        hinh_anh: initialData.hinh_anh || '',
        hinh_anh_2: initialData.hinh_anh_2 || '',
        ghi_chu: initialData.ghi_chu || '',
      });
    }
  }, [initialData]);

  const handleFormSubmit = (data: AssetFormData) => {
    onSubmit(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssetData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (url: string, field: keyof AssetFormData) => {
    setAssetData((prev) => ({ ...prev, [field]: url }));
    form.setValue(field, url);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <AssetFormFields
          form={form}
          assetData={assetData}
          handleChange={handleChange}
          handleImageUpload={handleImageUpload}
        />

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
