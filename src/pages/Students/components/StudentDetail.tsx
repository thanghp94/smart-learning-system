
import React from 'react';
import { Student } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Mail, Phone, User, Home, School, FileText } from 'lucide-react';

interface StudentDetailProps {
  student: Student;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student }) => {
  // Format fields or provide defaults
  const formatField = (value: any) => {
    if (value === null || value === undefined || value === '') {
      return 'Chưa cập nhật';
    }
    return value;
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <User className="mr-2 h-5 w-5 text-primary" />
            Thông tin cá nhân
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tên học sinh</p>
              <p className="font-medium">{formatField(student.ten_hoc_sinh || student.ho_va_ten)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Giới tính</p>
              <p className="font-medium">{formatField(student.gioi_tinh)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ngày sinh</p>
              <p className="font-medium flex items-center">
                <CalendarDays className="mr-1 h-4 w-4 text-muted-foreground" />
                {formatField(student.ngay_sinh)}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Trạng thái</p>
              <p className="font-medium">{formatField(student.trang_thai)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <Home className="mr-2 h-5 w-5 text-primary" />
            Thông tin liên hệ
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Địa chỉ</p>
              <p className="font-medium">{formatField(student.dia_chi)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Trường học</p>
              <p className="font-medium">{formatField(student.truong)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Lớp</p>
              <p className="font-medium">{formatField(student.lop)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nguồn đến</p>
              <p className="font-medium">{formatField(student.nguon_den)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parent Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <User className="mr-2 h-5 w-5 text-primary" />
            Thông tin phụ huynh
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tên phụ huynh</p>
              <p className="font-medium">{formatField(student.ten_PH || student.ten_ph)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Số điện thoại</p>
              <p className="font-medium flex items-center">
                <Phone className="mr-1 h-4 w-4 text-muted-foreground" />
                {formatField(student.sdt_ph1 || student.so_dien_thoai)}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium flex items-center">
                <Mail className="mr-1 h-4 w-4 text-muted-foreground" />
                {formatField(student.email_ph1)}
              </p>
            </div>
            
            {student.email_ph2 && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email 2</p>
                <p className="font-medium flex items-center">
                  <Mail className="mr-1 h-4 w-4 text-muted-foreground" />
                  {formatField(student.email_ph2)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <School className="mr-2 h-5 w-5 text-primary" />
            Thông tin học tập
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Chương trình học</p>
              <p className="font-medium">{formatField(student.ct_hoc)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Hạn học phí</p>
              <p className="font-medium flex items-center">
                <CalendarDays className="mr-1 h-4 w-4 text-muted-foreground" />
                {formatField(student.han_hoc_phi)}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ngày bắt đầu học phí</p>
              <p className="font-medium flex items-center">
                <CalendarDays className="mr-1 h-4 w-4 text-muted-foreground" />
                {formatField(student.ngay_bat_dau_hoc_phi)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Thông tin bổ sung
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Mô tả tính cách</p>
              <p className="font-medium">{formatField(student.mo_ta_tinh_cach)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Điểm mạnh</p>
              <p className="font-medium">{formatField(student.diem_manh)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ghi chú</p>
              <p className="font-medium">{formatField(student.ghi_chu)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetail;
