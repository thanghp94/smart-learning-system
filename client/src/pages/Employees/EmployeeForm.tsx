import React, { useState, useEffect } from 'react';
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
import { Employee, Facility } from '@/lib/types';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import ImageUpload from "@/components/common/ImageUpload";
import { facilityService } from '@/lib/supabase';

interface EmployeeFormProps {
  initialData?: Partial<Employee>;
  onSubmit: (data: Partial<Employee>) => void;
}

const EmployeeForm = ({ initialData, onSubmit }: EmployeeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [employeeImage, setEmployeeImage] = useState(initialData?.hinh_anh || '');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(true);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      ten_nhan_vien: initialData?.ten_nhan_vien || '',
      ten_ngan: initialData?.ten_ngan || '',
      bo_phan: initialData?.bo_phan || '',
      chuc_vu: initialData?.chuc_vu || '',
      so_dien_thoai: initialData?.so_dien_thoai || '',
      email: initialData?.email || '',
      co_so_id: Array.isArray(initialData?.co_so_id) ? (initialData.co_so_id.length > 0 ? initialData.co_so_id[0] : '') : (initialData?.co_so_id || ''),
      trang_thai: initialData?.trang_thai || 'active',
      ngay_sinh: initialData?.ngay_sinh || null,
      dia_chi: initialData?.dia_chi || '',
      gioi_tinh: initialData?.gioi_tinh || '',
      ghi_chu: initialData?.ghi_chu || ''
    }
  });

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      setIsLoadingFacilities(true);
      const facilitiesData = await facilityService.getAll();
      setFacilities(facilitiesData);
    } catch (error) {
      console.error('Error loading facilities:', error);
    } finally {
      setIsLoadingFacilities(false);
    }
  };

  const handleImageChange = (url: string) => {
    setEmployeeImage(url);
  };

  const processSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      // Process the date field - if empty, set to null to avoid SQL date parsing errors
      const processedData = {
        ...formData,
        ngay_sinh: formData.ngay_sinh || null,
        co_so_id: formData.co_so_id || null,
        hinh_anh: employeeImage
      };

      console.log("Submitting employee data:", processedData);
      await onSubmit(processedData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextTab = () => {
    if (activeTab === 'basic') setActiveTab('contact');
    else if (activeTab === 'contact') setActiveTab('additional');
  };

  const prevTab = () => {
    if (activeTab === 'additional') setActiveTab('contact');
    else if (activeTab === 'contact') setActiveTab('basic');
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="contact">Thông tin liên hệ</TabsTrigger>
          <TabsTrigger value="additional">Thông tin bổ sung</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="mb-6">
            <Label htmlFor="employeeImage">Hình ảnh nhân viên</Label>
            <div className="mt-2">
              <ImageUpload
                value={employeeImage}
                onChange={handleImageChange}
                onRemove={() => setEmployeeImage('')}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ten_nhan_vien">Tên nhân viên*</Label>
            <Input
              id="ten_nhan_vien"
              {...register('ten_nhan_vien', { required: true })}
              className={errors.ten_nhan_vien ? 'border-red-500' : ''}
            />
            {errors.ten_nhan_vien && <p className="text-red-500 text-xs mt-1">Vui lòng nhập tên nhân viên</p>}
          </div>

          <div>
            <Label htmlFor="ten_ngan">Tên ngắn</Label>
            <Input id="ten_ngan" {...register('ten_ngan')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bo_phan">Bộ phận</Label>
              <Select
                onValueChange={(value) => setValue('bo_phan', value)}
                defaultValue={watch('bo_phan')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn bộ phận" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Giáo viên">Giáo viên</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Kế toán">Kế toán</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="chuc_vu">Chức danh</Label>
              <Select
                onValueChange={(value) => setValue('chuc_vu', value)}
                defaultValue={watch('chuc_vu')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chức danh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Giám đốc">Giám đốc</SelectItem>
                  <SelectItem value="GV">Giáo viên</SelectItem>
                  <SelectItem value="TG">Trợ giảng</SelectItem>
                  <SelectItem value="Nhân viên">Nhân viên</SelectItem>
                  <SelectItem value="Quản lý">Quản lý</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={nextTab}>
              Tiếp theo
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="so_dien_thoai">Số điện thoại</Label>
              <Input id="so_dien_thoai" {...register('so_dien_thoai')} />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không hợp lệ'
                  }
                })}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="dia_chi">Địa chỉ</Label>
            <Input id="dia_chi" {...register('dia_chi')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ngay_sinh">Ngày sinh</Label>
              <Input
                id="ngay_sinh"
                type="date"
                {...register('ngay_sinh')}
              />
            </div>

            <div>
              <Label htmlFor="gioi_tinh">Giới tính</Label>
              <Select
                onValueChange={(value) => setValue('gioi_tinh', value)}
                defaultValue={watch('gioi_tinh')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between space-x-2">
            <Button type="button" variant="outline" onClick={prevTab}>
              Quay lại
            </Button>
            <Button type="button" onClick={nextTab}>
              Tiếp theo
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="additional" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="co_so_id">Cơ sở</Label>
              <Select
                onValueChange={(value) => setValue('co_so_id', value)}
                defaultValue={watch('co_so_id')}
                disabled={isLoadingFacilities}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingFacilities ? "Đang tải..." : "Chọn cơ sở"} />
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
                  <SelectItem value="active">Đang làm việc</SelectItem>
                  <SelectItem value="inactive">Đã nghỉ việc</SelectItem>
                  <SelectItem value="maternity_leave">Nghỉ thai sản</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="ghi_chu">Ghi chú</Label>
            <Textarea id="ghi_chu" {...register('ghi_chu')} rows={3} />
          </div>

          <div className="flex justify-between space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={prevTab}>
              Quay lại
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thông tin"
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default EmployeeForm;