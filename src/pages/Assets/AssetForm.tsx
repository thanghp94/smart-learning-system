import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
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
import { Asset } from '@/lib/types';
import { assetSchema } from './schemas/assetSchema';
import ImageUpload from '@/components/common/ImageUpload';

interface AssetFormData {
  ten_csvc: string;
  loai?: string;
  danh_muc?: string;
  so_luong: number;
  don_vi: string;
  so_tien_mua?: string;
  tinh_trang?: string;
  trang_thai_so_huu?: string;
  mo_ta_1?: string;
  thuong_hieu?: string;
  mau?: string;
  khu_vuc?: string;
  hinh_anh?: string;
  hinh_anh_2?: string;
  ghi_chu?: string;
}

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
    //resolver: zodResolver(assetSchema),
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssetData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (url: string, field: keyof AssetFormData) => {
    setAssetData((prev) => ({ ...prev, [field]: url }));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="ten_csvc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên CSVC*</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên CSVC" {...field} value={assetData.ten_csvc} onChange={handleChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="loai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập loại" {...field} value={assetData.loai} onChange={handleChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="danh_muc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập danh mục" {...field} value={assetData.danh_muc} onChange={handleChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="so_luong"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số lượng*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Nhập số lượng"
                    {...field}
                    value={assetData.so_luong}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setAssetData((prev) => ({ ...prev, so_luong: value }));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="don_vi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đơn vị*</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập đơn vị" {...field} value={assetData.don_vi} onChange={handleChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="so_tien_mua"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số tiền mua</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số tiền mua" {...field} value={assetData.so_tien_mua} onChange={handleChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tinh_trang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tình trạng</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tình trạng" {...field} value={assetData.tinh_trang} onChange={handleChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="trang_thai_so_huu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái sở hữu</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập trạng thái sở hữu" {...field} value={assetData.trang_thai_so_huu} onChange={handleChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thuong_hieu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thương hiệu</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập thương hiệu" {...field} value={assetData.thuong_hieu} onChange={handleChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="mau"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Màu</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập màu" {...field} value={assetData.mau} onChange={handleChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="khu_vuc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Khu vực</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập khu vực" {...field} value={assetData.khu_vuc} onChange={handleChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="mo_ta_1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả 1</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập mô tả 1" className="resize-none" {...field} value={assetData.mo_ta_1} onChange={handleChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hinh_anh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình ảnh 1</FormLabel>
                <FormControl>
                  <ImageUpload
                    imageUrl={assetData.hinh_anh}
                    onUpload={(url) => handleImageUpload(url, 'hinh_anh')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hinh_anh_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình ảnh 2</FormLabel>
                <FormControl>
                  <ImageUpload
                    imageUrl={assetData.hinh_anh_2}
                    onUpload={(url) => handleImageUpload(url, 'hinh_anh_2')}
                  />
                </FormControl>
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
                <Textarea placeholder="Nhập ghi chú" className="resize-none" {...field} value={assetData.ghi_chu} onChange={handleChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
