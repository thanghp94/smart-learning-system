
import React from 'react';
import { Student } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, MapPin, Book, School, Phone, Mail, FileText, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface StudentDetailProps {
  student: Student;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa có thông tin';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Tabs defaultValue="info">
      <TabsList className="mb-4 w-full">
        <TabsTrigger value="info">Thông tin chung</TabsTrigger>
        <TabsTrigger value="education">Học tập</TabsTrigger>
        <TabsTrigger value="contact">Liên hệ</TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Thông tin cá nhân
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Họ và tên</p>
                    <p className="font-medium">{student.ten_hoc_sinh || student.ho_va_ten}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Giới tính</p>
                    <p>{student.gioi_tinh === 'male' ? 'Nam' : student.gioi_tinh === 'female' ? 'Nữ' : student.gioi_tinh}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Ngày sinh</p>
                  <p className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                    {formatDate(student.ngay_sinh)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Địa chỉ</p>
                  <p className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    {student.dia_chi || 'Chưa có thông tin'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Book className="mr-2 h-5 w-5" />
                Trạng thái
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Trạng thái</p>
                    <p className="font-medium">{
                      student.trang_thai === 'active' ? 'Đang học' : 
                      student.trang_thai === 'inactive' ? 'Đã nghỉ' : 
                      student.trang_thai === 'pending' ? 'Chờ xử lý' : 
                      student.trang_thai || 'Đang học'
                    }</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cơ sở</p>
                    <p>{student.co_so_id || 'Chưa xác định'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Chương trình học</p>
                  <p className="flex items-center">
                    <School className="mr-2 h-4 w-4 text-muted-foreground" />
                    {student.ct_hoc || 'Chưa có thông tin'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Hạn học phí</p>
                  <p className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                    {formatDate(student.han_hoc_phi)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="education" className="space-y-4">
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <School className="mr-2 h-5 w-5" />
              Thông tin học tập
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Trường</p>
                <p>{student.truong || 'Chưa có thông tin'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lớp</p>
                <p>{student.lop || 'Chưa có thông tin'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mô tả tính cách</p>
                <p className="whitespace-pre-wrap">{student.mo_ta_tinh_cach || 'Chưa có thông tin'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Điểm mạnh</p>
                <p className="whitespace-pre-wrap">{student.diem_manh || 'Chưa có thông tin'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nguồn đến</p>
                <p>{student.nguon_den || 'Chưa có thông tin'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contact" className="space-y-4">
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <User className="mr-2 h-5 w-5" />
              Thông tin phụ huynh
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Tên phụ huynh</p>
                <p className="font-medium">{student.ten_ph || student.ten_PH || 'Chưa có thông tin'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số điện thoại</p>
                <p className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  {student.sdt_ph1 || student.so_dien_thoai || 'Chưa có thông tin'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  {student.email_ph1 || 'Chưa có thông tin'}
                </p>
              </div>
              {student.email_ph2 && (
                <div>
                  <p className="text-sm text-muted-foreground">Email phụ</p>
                  <p className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    {student.email_ph2}
                  </p>
                </div>
              )}
              {student.ghi_chu && (
                <div>
                  <p className="text-sm text-muted-foreground">Ghi chú</p>
                  <p className="whitespace-pre-wrap">{student.ghi_chu}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default StudentDetail;
