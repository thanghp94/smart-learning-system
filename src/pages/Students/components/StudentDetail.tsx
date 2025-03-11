
import React, { useState, useEffect } from 'react';
import { Student } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, MapPin, Book, School, Phone, Mail, FileText, User, Layers } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { facilityService, enrollmentService } from '@/lib/supabase';
import EntityFinancesView from '@/pages/Finance/components/EntityFinancesView';

interface StudentDetailProps {
  student: Student;
  facilities?: {[key: string]: string};
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student, facilities = {} }) => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!student?.id) return;
      
      setIsLoading(true);
      try {
        const data = await enrollmentService.getByStudent(student.id);
        setEnrollments(data || []);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, [student?.id]);

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
        <TabsTrigger value="finance">Thu chi</TabsTrigger>
        <TabsTrigger value="enrollments">Ghi danh</TabsTrigger>
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
                  <p className="text-sm text-muted-foreground">Cơ sở</p>
                  <p className="flex items-center">
                    <School className="mr-2 h-4 w-4 text-muted-foreground" />
                    {student.co_so_id && facilities[student.co_so_id] 
                      ? facilities[student.co_so_id] 
                      : (student.co_so_id || 'Chưa xác định')}
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
                    <p className="text-sm text-muted-foreground">Nguồn đến</p>
                    <p>{student.nguon_den || 'Chưa xác định'}</p>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Thông tin liên hệ
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
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <School className="mr-2 h-5 w-5" />
                Thông tin học tập
              </h3>
              <div className="space-y-3">
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
                {student.ghi_chu && (
                  <div>
                    <p className="text-sm text-muted-foreground">Ghi chú</p>
                    <p className="whitespace-pre-wrap">{student.ghi_chu}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="finance" className="space-y-4">
        <EntityFinancesView entityType="hoc_sinh" entityId={student.id} />
      </TabsContent>

      <TabsContent value="enrollments" className="space-y-4">
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Layers className="mr-2 h-5 w-5" />
              Lớp đã ghi danh
            </h3>
            {isLoading ? (
              <p className="text-center py-4 text-muted-foreground">Đang tải dữ liệu...</p>
            ) : enrollments.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">Học sinh chưa ghi danh vào lớp nào</p>
            ) : (
              <div className="space-y-3">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="p-3 border rounded-md">
                    <div className="font-medium">{enrollment.ten_lop || enrollment.class_name || 'Lớp không xác định'}</div>
                    <div className="text-sm text-muted-foreground mt-1 flex items-center">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {enrollment.created_at ? formatDate(enrollment.created_at) : 'Không có ngày'}
                    </div>
                    {enrollment.tong_tien && (
                      <div className="text-sm mt-1">
                        Học phí: {Number(enrollment.tong_tien).toLocaleString('vi-VN')} VNĐ
                      </div>
                    )}
                    {enrollment.class_id && (
                      <div className="mt-2">
                        <Link to={`/classes/${enrollment.class_id}`}>
                          <Button variant="outline" size="sm">Xem lớp</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default StudentDetail;
