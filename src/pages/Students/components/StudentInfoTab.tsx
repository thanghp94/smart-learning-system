
import React from 'react';
import { Student } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/DatePicker';
import ImageUpload from '@/components/common/ImageUpload';

export interface StudentInfoTabProps {
  student: Student;
  isEditing: boolean;
  tempStudentData: Student;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleImageUpload: (url: string) => Promise<void>;
  facilityName: string;
}

const StudentInfoTab: React.FC<StudentInfoTabProps> = ({
  student,
  isEditing,
  tempStudentData,
  handleChange,
  handleImageUpload,
  facilityName
}) => {
  // Extract image URLs with fallbacks
  const studentImage = tempStudentData?.hinh_anh_hoc_sinh || student?.hinh_anh_hoc_sinh || '';
  const idImage = tempStudentData?.anh_minh_hoc || student?.anh_minh_hoc || '';

  // Handle date change for birth date
  const handleBirthDateChange = (date: Date | undefined) => {
    if (date) {
      const e = {
        target: {
          name: 'ngay_sinh',
          value: date
        }
      } as any;
      handleChange(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="ten_hoc_sinh">Tên học sinh</Label>
            <Input
              id="ten_hoc_sinh"
              name="ten_hoc_sinh"
              value={tempStudentData.ten_hoc_sinh || ''}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Nhập tên học sinh"
            />
          </div>

          <div>
            <Label htmlFor="ngay_sinh">Ngày sinh</Label>
            {isEditing ? (
              <DatePicker 
                date={tempStudentData.ngay_sinh ? new Date(tempStudentData.ngay_sinh) : undefined}
                setDate={handleBirthDateChange}
                placeholder="Chọn ngày sinh"
              />
            ) : (
              <Input
                id="ngay_sinh"
                value={tempStudentData.ngay_sinh ? new Date(tempStudentData.ngay_sinh).toLocaleDateString('vi-VN') : ''}
                disabled
              />
            )}
          </div>

          <div>
            <Label htmlFor="gioi_tinh">Giới tính</Label>
            {isEditing ? (
              <Select
                value={tempStudentData.gioi_tinh || ''}
                onValueChange={(value) => {
                  const e = {
                    target: {
                      name: 'gioi_tinh',
                      value
                    }
                  } as any;
                  handleChange(e);
                }}
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
            ) : (
              <Input
                id="gioi_tinh"
                value={tempStudentData.gioi_tinh || ''}
                disabled
              />
            )}
          </div>

          <div>
            <Label htmlFor="dia_chi">Địa chỉ</Label>
            <Textarea
              id="dia_chi"
              name="dia_chi"
              value={tempStudentData.dia_chi || ''}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Nhập địa chỉ"
            />
          </div>

          <div>
            <Label htmlFor="co_so_id">Cơ sở</Label>
            <Input
              id="co_so_id"
              value={facilityName}
              disabled
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Hình ảnh học sinh</Label>
            <ImageUpload 
              value={studentImage} 
              disabled={!isEditing}
              onChange={url => handleImageUpload(url)}
              onRemove={() => {}}
            />
          </div>

          <div>
            <Label>Ảnh minh họa</Label>
            <ImageUpload 
              value={idImage} 
              disabled={!isEditing}
              onChange={url => {
                // This is a simplified approach. For a production app,
                // you might want to handle this differently.
                const e = {
                  target: {
                    name: 'anh_minh_hoc',
                    value: url
                  }
                } as any;
                handleChange(e);
              }}
              onRemove={() => {}}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="ghi_chu">Ghi chú</Label>
        <Textarea
          id="ghi_chu"
          name="ghi_chu"
          value={tempStudentData.ghi_chu || ''}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="Nhập ghi chú"
          className="h-24"
        />
      </div>
    </div>
  );
};

export default StudentInfoTab;
