
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
import { Class, Employee, TeachingSession } from '@/lib/types';

interface EvaluationFormProps {
  initialData: TeachingSession;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  classInfo?: Class;
  teacherInfo?: Employee;
}

const EvaluationForm = ({ initialData, onSubmit, onCancel, classInfo, teacherInfo }: EvaluationFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      ten_danh_gia: `Đánh giá buổi dạy ${initialData?.ngay_hoc || ''}`,
      doi_tuong: 'teaching_session',
      ghi_chu: '',
      nhan_xet_1: initialData?.nhan_xet_1 || '',
      nhan_xet_2: initialData?.nhan_xet_2 || '',
      nhan_xet_3: initialData?.nhan_xet_3 || '',
      nhan_xet_4: initialData?.nhan_xet_4 || '',
      nhan_xet_5: initialData?.nhan_xet_5 || '',
      nhan_xet_6: initialData?.nhan_xet_6 || '',
      nhan_xet_chung: initialData?.nhan_xet_chung || '',
    }
  });

  const handleFormSubmit = (data: any) => {
    // Convert string ratings to numbers for the database
    const processedData = {
      ...data,
      nhan_xet_1: data.nhan_xet_1 ? data.nhan_xet_1.toString() : '',
      nhan_xet_2: data.nhan_xet_2 ? data.nhan_xet_2.toString() : '',
      nhan_xet_3: data.nhan_xet_3 ? data.nhan_xet_3.toString() : '',
      nhan_xet_4: data.nhan_xet_4 ? data.nhan_xet_4.toString() : '',
      nhan_xet_5: data.nhan_xet_5 ? data.nhan_xet_5.toString() : '',
      nhan_xet_6: data.nhan_xet_6 ? data.nhan_xet_6.toString() : '',
    };

    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {classInfo && teacherInfo && (
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md mb-4">
          <div>
            <p className="text-sm font-medium">Lớp: <span className="font-normal">{classInfo.Ten_lop_full}</span></p>
            <p className="text-sm font-medium">Buổi học số: <span className="font-normal">{initialData.session_id}</span></p>
            <p className="text-sm font-medium">Ngày học: <span className="font-normal">{initialData.ngay_hoc}</span></p>
          </div>
          <div>
            <p className="text-sm font-medium">Giáo viên: <span className="font-normal">{teacherInfo.ten_nhan_su}</span></p>
            <p className="text-sm font-medium">Loại bài học: <span className="font-normal">{initialData.Loai_bai_hoc || 'N/A'}</span></p>
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="ten_danh_gia">Tên đánh giá*</Label>
        <Input
          id="ten_danh_gia"
          {...register('ten_danh_gia', { required: true })}
          className={errors.ten_danh_gia ? 'border-red-500' : ''}
        />
        {errors.ten_danh_gia && <p className="text-red-500 text-xs mt-1">Vui lòng nhập tên đánh giá</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tiêu chí 1: Nội dung bài giảng</Label>
          <Select
            onValueChange={(value) => setValue('nhan_xet_1', value)}
            defaultValue={watch('nhan_xet_1')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Rất kém</SelectItem>
              <SelectItem value="2">2 - Kém</SelectItem>
              <SelectItem value="3">3 - Trung bình</SelectItem>
              <SelectItem value="4">4 - Khá</SelectItem>
              <SelectItem value="5">5 - Tốt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tiêu chí 2: Phương pháp giảng dạy</Label>
          <Select
            onValueChange={(value) => setValue('nhan_xet_2', value)}
            defaultValue={watch('nhan_xet_2')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Rất kém</SelectItem>
              <SelectItem value="2">2 - Kém</SelectItem>
              <SelectItem value="3">3 - Trung bình</SelectItem>
              <SelectItem value="4">4 - Khá</SelectItem>
              <SelectItem value="5">5 - Tốt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tiêu chí 3: Quản lý lớp học</Label>
          <Select
            onValueChange={(value) => setValue('nhan_xet_3', value)}
            defaultValue={watch('nhan_xet_3')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Rất kém</SelectItem>
              <SelectItem value="2">2 - Kém</SelectItem>
              <SelectItem value="3">3 - Trung bình</SelectItem>
              <SelectItem value="4">4 - Khá</SelectItem>
              <SelectItem value="5">5 - Tốt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tiêu chí 4: Tương tác với học sinh</Label>
          <Select
            onValueChange={(value) => setValue('nhan_xet_4', value)}
            defaultValue={watch('nhan_xet_4')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Rất kém</SelectItem>
              <SelectItem value="2">2 - Kém</SelectItem>
              <SelectItem value="3">3 - Trung bình</SelectItem>
              <SelectItem value="4">4 - Khá</SelectItem>
              <SelectItem value="5">5 - Tốt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tiêu chí 5: Sử dụng tài liệu/công cụ</Label>
          <Select
            onValueChange={(value) => setValue('nhan_xet_5', value)}
            defaultValue={watch('nhan_xet_5')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Rất kém</SelectItem>
              <SelectItem value="2">2 - Kém</SelectItem>
              <SelectItem value="3">3 - Trung bình</SelectItem>
              <SelectItem value="4">4 - Khá</SelectItem>
              <SelectItem value="5">5 - Tốt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tiêu chí 6: Đánh giá và phản hồi</Label>
          <Select
            onValueChange={(value) => setValue('nhan_xet_6', value)}
            defaultValue={watch('nhan_xet_6')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Rất kém</SelectItem>
              <SelectItem value="2">2 - Kém</SelectItem>
              <SelectItem value="3">3 - Trung bình</SelectItem>
              <SelectItem value="4">4 - Khá</SelectItem>
              <SelectItem value="5">5 - Tốt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="nhan_xet_chung">Nhận xét chung</Label>
        <Textarea id="nhan_xet_chung" {...register('nhan_xet_chung')} rows={3} />
      </div>

      <div>
        <Label htmlFor="ghi_chu">Ghi chú</Label>
        <Textarea id="ghi_chu" {...register('ghi_chu')} rows={2} />
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
        )}
        <Button type="submit">Lưu đánh giá</Button>
      </div>
    </form>
  );
};

export default EvaluationForm;
