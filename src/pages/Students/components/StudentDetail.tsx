
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';
import { Student, Enrollment, Evaluation } from '@/lib/types';
import { evaluationService, enrollmentService } from '@/lib/supabase';
import DataTable from '@/components/ui/DataTable';
import EnrollStudentButton from './EnrollStudentButton';
import ViewEvaluationsButton from '../../Evaluations/ViewEvaluationsButton';

interface StudentDetailProps {
  student: Student;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        if (student.id) {
          const data = await enrollmentService.getByStudent(student.id);
          setEnrollments(data);
        }
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [student.id]);

  const enrollmentColumns = [
    {
      title: "Lớp học",
      key: "ten_lop_full",
      sortable: true,
    },
    {
      title: "Chương trình",
      key: "ct_hoc",
      sortable: true,
      render: (value: string) => value || '-',
    },
    {
      title: "Tình trạng điểm danh",
      key: "tinh_trang_diem_danh",
      sortable: true,
      render: (value: string) => (
        <Badge
          variant={
            value === 'present' ? 'success' : 
            value === 'absent' ? 'destructive' : 
            value === 'late' ? 'warning' : 
            'secondary'
          }
        >
          {value === 'present' ? 'Có mặt' : 
           value === 'absent' ? 'Vắng mặt' : 
           value === 'late' ? 'Đi muộn' : 
           'Chưa điểm danh'}
        </Badge>
      ),
    },
    {
      title: "Đánh giá",
      key: "actions",
      sortable: false,
      render: (_: any, record: Enrollment) => (
        <ViewEvaluationsButton 
          enrollmentId={record.id} 
          buttonText="Xem đánh giá"
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin học sinh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Họ tên</h3>
              <p>{student.ten_hoc_sinh}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Phụ huynh</h3>
              <p>{student.ten_PH || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Số điện thoại</h3>
              <p>{student.sdt_ph1 || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p>{student.email_ph1 || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Ngày sinh</h3>
              <p>{student.ngay_sinh ? formatDate(student.ngay_sinh) : 'Chưa cập nhật'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Giới tính</h3>
              <p>{student.gioi_tinh || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Chương trình học</h3>
              <p>{student.ct_hoc || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Trạng thái</h3>
              <Badge 
                variant={student.trang_thai === 'active' ? 'success' : 'destructive'}
              >
                {student.trang_thai === 'active' ? 'Đang học' : 'Đã nghỉ'}
              </Badge>
            </div>
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">Địa chỉ</h3>
              <p>{student.dia_chi || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="enrollments">
        <TabsList>
          <TabsTrigger value="enrollments">Lớp học đã ghi danh</TabsTrigger>
          <TabsTrigger value="evaluations">Đánh giá</TabsTrigger>
          <TabsTrigger value="finances">Tài chính</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enrollments" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Danh sách lớp học đã ghi danh</CardTitle>
              <EnrollStudentButton student={student} onSuccess={() => {
                // Refresh enrollments after adding new one
                if (student.id) {
                  enrollmentService.getByStudent(student.id).then(setEnrollments);
                }
              }} />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Đang tải...</div>
              ) : (
                <DataTable
                  columns={enrollmentColumns}
                  data={enrollments}
                  searchable={true}
                  searchPlaceholder="Tìm kiếm lớp học..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="evaluations" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá học sinh</CardTitle>
            </CardHeader>
            <CardContent>
              <ViewEvaluationsButton 
                studentId={student.id} 
                showAsSheet={false}
                buttonText="Xem tất cả đánh giá"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finances" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài chính</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Hạn đóng học phí</h3>
                  <p>{student.han_hoc_phi ? formatDate(student.han_hoc_phi) : 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Ngày bắt đầu học phí</h3>
                  <p>{student.ngay_bat_dau_hoc_phi ? formatDate(student.ngay_bat_dau_hoc_phi) : 'Chưa cập nhật'}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Xem lịch sử thanh toán
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetail;
