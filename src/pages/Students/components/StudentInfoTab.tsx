import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { StudentFormValues } from '../schemas/studentSchema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { DatePicker } from "@/components/ui/date-picker"
import ImageUpload from '@/components/common/ImageUpload';

interface StudentInfoTabProps {
  facilities: any[];
  isLoadingFacilities: boolean;
}

const StudentInfoTab: React.FC<StudentInfoTabProps> = ({ facilities, isLoadingFacilities }) => {
  const { register, formState: { errors }, watch, setValue } = useFormContext<StudentFormValues>();
  const student = watch();
  const [photoUrl, setPhotoUrl] = useState(student?.anh_minh_hoc || student?.hinh_anh_hoc_sinh || '');

  const handlePhotoUpload = (url: string) => {
    setPhotoUrl(url);
    setValue('anh_minh_hoc', url);
    setValue('hinh_anh_hoc_sinh', url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ten_hoc_sinh">Tên học sinh</Label>
          <Input
            id="ten_hoc_sinh"
            placeholder="Nhập tên học sinh"
            {...register("ten_hoc_sinh", { required: "Tên học sinh là bắt buộc" })}
            className={cn(errors.ten_hoc_sinh ? "border-red-500" : "")}
          />
          {errors.ten_hoc_sinh && (
            <p className="text-red-500 text-sm">{errors.ten_hoc_sinh.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="gioi_tinh">Giới tính</Label>
          <Select onValueChange={value => setValue('gioi_tinh', value)} defaultValue={student?.gioi_tinh}>
            <SelectTrigger className={cn(errors.gioi_tinh ? "border-red-500" : "")}>
              <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nam">Nam</SelectItem>
              <SelectItem value="Nữ">Nữ</SelectItem>
              <SelectItem value="Khác">Khác</SelectItem>
            </SelectContent>
          </Select>
          {errors.gioi_tinh && (
            <p className="text-red-500 text-sm">{errors.gioi_tinh.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ngay_sinh">Ngày sinh</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !student?.ngay_sinh && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {student?.ngay_sinh ? (
                  format(new Date(student.ngay_sinh), "dd/MM/yyyy")
                ) : (
                  <span>Chọn ngày sinh</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <DatePicker
                mode="single"
                selected={student?.ngay_sinh ? new Date(student.ngay_sinh) : undefined}
                onSelect={(date) => setValue("ngay_sinh", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.ngay_sinh && (
            <p className="text-red-500 text-sm">{errors.ngay_sinh.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="co_so_id">Cơ sở</Label>
          <Select
            onValueChange={value => setValue('co_so_id', value)}
            defaultValue={student?.co_so_id}
            disabled={isLoadingFacilities}
          >
            <SelectTrigger className={cn(errors.co_so_id ? "border-red-500" : "")}>
              <SelectValue placeholder="Chọn cơ sở" />
            </SelectTrigger>
            <SelectContent>
              {facilities.map(facility => (
                <SelectItem key={facility.id} value={facility.id}>
                  {facility.ten_co_so}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.co_so_id && (
            <p className="text-red-500 text-sm">{errors.co_so_id.message}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <Label htmlFor="studentImage">Hình ảnh học sinh</Label>
        <div className="mt-2">
          <ImageUpload
            currentUrl={photoUrl}
            onUpload={handlePhotoUpload}
            entityType="student"
            entityId={student?.id || 'new'}
            value={photoUrl}
            onChange={handlePhotoUpload}
            onRemove={() => setPhotoUrl('')}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentInfoTab;
