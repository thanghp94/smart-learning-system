
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/common/ImageUpload';
import { UseFormReturn } from 'react-hook-form';
import { AssetFormData } from '../schemas/assetSchema';

interface AssetFormFieldsProps {
  form: UseFormReturn<AssetFormData>;
  assetData: AssetFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageUpload: (url: string, field: keyof AssetFormData) => void;
}

const AssetFormFields: React.FC<AssetFormFieldsProps> = ({
  form,
  assetData,
  handleChange,
  handleImageUpload
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="ten_csvc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên CSVC*</FormLabel>
            <FormControl>
              <Input 
                placeholder="Nhập tên CSVC" 
                {...field} 
                value={assetData.ten_csvc} 
                onChange={handleChange} 
              />
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
                <Input 
                  placeholder="Nhập loại" 
                  {...field} 
                  value={assetData.loai || ''} 
                  onChange={handleChange} 
                />
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
                <Input 
                  placeholder="Nhập danh mục" 
                  {...field} 
                  value={assetData.danh_muc || ''} 
                  onChange={handleChange} 
                />
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
                    handleChange({
                      ...e,
                      target: {
                        ...e.target,
                        name: 'so_luong',
                        value: isNaN(value) ? 0 : value
                      }
                    } as React.ChangeEvent<HTMLInputElement>);
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
                <Input 
                  placeholder="Nhập đơn vị" 
                  {...field} 
                  value={assetData.don_vi} 
                  onChange={handleChange} 
                />
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
                <Input 
                  placeholder="Nhập số tiền mua" 
                  {...field} 
                  value={assetData.so_tien_mua || ''} 
                  onChange={handleChange} 
                />
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
                <Input 
                  placeholder="Nhập tình trạng" 
                  {...field} 
                  value={assetData.tinh_trang || ''} 
                  onChange={handleChange} 
                />
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
                <Input 
                  placeholder="Nhập trạng thái sở hữu" 
                  {...field} 
                  value={assetData.trang_thai_so_huu || ''} 
                  onChange={handleChange} 
                />
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
                <Input 
                  placeholder="Nhập thương hiệu" 
                  {...field} 
                  value={assetData.thuong_hieu || ''} 
                  onChange={handleChange} 
                />
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
                <Input 
                  placeholder="Nhập màu" 
                  {...field} 
                  value={assetData.mau || ''} 
                  onChange={handleChange} 
                />
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
                <Input 
                  placeholder="Nhập khu vực" 
                  {...field} 
                  value={assetData.khu_vuc || ''} 
                  onChange={handleChange} 
                />
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
            <FormLabel>Mô tả</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Nhập mô tả" 
                className="resize-none" 
                {...field} 
                value={assetData.mo_ta_1 || ''} 
                onChange={handleChange} 
              />
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
                  value={assetData.hinh_anh || ''}
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
                  value={assetData.hinh_anh_2 || ''}
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
              <Textarea 
                placeholder="Nhập ghi chú" 
                className="resize-none" 
                {...field} 
                value={assetData.ghi_chu || ''} 
                onChange={handleChange} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AssetFormFields;
