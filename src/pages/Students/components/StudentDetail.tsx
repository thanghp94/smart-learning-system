
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Student, Enrollment, Finance, Event, Evaluation } from '@/lib/types';
import { studentService } from '@/lib/supabase/student-service';
import { enrollmentService } from '@/lib/supabase/enrollment-service';
import { financeService } from '@/lib/supabase/finance-service';
import { eventService } from '@/lib/supabase/event-service';
import { evaluationService } from '@/lib/supabase/evaluation-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatStatus } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { PenSquare } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { studentAssignmentService } from '@/lib/supabase/student-assignment-service';

interface StudentDetailProps {
  studentId: string;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ studentId }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        
        // Fetch student details
        const studentData = await studentService.getById(studentId);
        setStudent(studentData);
        
        // Fetch related enrollments
        const enrollmentsData = await enrollmentService.getByStudent(studentId);
        setEnrollments(enrollmentsData);
        
        // Fetch related finances
        const financesData = await financeService.getByEntityId('student', studentId);
        setFinances(financesData);
        
        // Fetch related events
        const eventsData = await eventService.getByEntityId('student', studentId);
        setEvents(eventsData);
        
        // Fetch related evaluations
        const evaluationsData = await evaluationService.getByEntity('student', studentId);
        setEvaluations(evaluationsData);
        
        // Fetch student assignments
        const assignmentsData = await studentAssignmentService.getByStudent(studentId);
        setAssignments(assignmentsData);
        
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast({
          title: 'Error',
          description: 'Unable to load student data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  // Column definitions for Enrollments table
  const enrollmentColumns: ColumnDef<Enrollment>[] = [
    {
      accessorKey: 'lop_chi_tiet_id',
      header: 'Lớp',
    },
    {
      accessorKey: 'tinh_trang_diem_danh',
      header: 'Tình trạng',
      cell: ({ row }) => (
        <Badge variant={row.original.tinh_trang_diem_danh === 'present' ? 'success' : 'secondary'}>
          {formatStatus(row.original.tinh_trang_diem_danh)}
        </Badge>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Ngày ghi danh',
      cell: ({ row }) => formatDate(row.original.created_at),
    },
  ];

  // Column definitions for Finances table
  const financeColumns: ColumnDef<Finance>[] = [
    {
      accessorKey: 'ngay',
      header: 'Ngày',
      cell: ({ row }) => formatDate(row.original.ngay),
    },
    {
      accessorKey: 'loai_thu_chi',
      header: 'Loại thu chi',
    },
    {
      accessorKey: 'dien_giai',
      header: 'Diễn giải',
    },
    {
      accessorKey: 'tong_tien',
      header: 'Số tiền',
      cell: ({ row }) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.original.tong_tien),
    },
    {
      accessorKey: 'tinh_trang',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <Badge variant={row.original.tinh_trang === 'completed' ? 'success' : 'secondary'}>
          {formatStatus(row.original.tinh_trang)}
        </Badge>
      ),
    },
  ];

  // Column definitions for Events table
  const eventColumns: ColumnDef<Event>[] = [
    {
      accessorKey: 'ten_su_kien',
      header: 'Tên sự kiện',
    },
    {
      accessorKey: 'loai_su_kien',
      header: 'Loại sự kiện',
    },
    {
      accessorKey: 'ngay_bat_dau',
      header: 'Ngày',
      cell: ({ row }) => formatDate(row.original.ngay_bat_dau),
    },
    {
      accessorKey: 'trang_thai',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <Badge variant={row.original.trang_thai === 'completed' ? 'success' : 'secondary'}>
          {formatStatus(row.original.trang_thai)}
        </Badge>
      ),
    },
  ];

  // Column definitions for Evaluations table
  const evaluationColumns: ColumnDef<Evaluation>[] = [
    {
      accessorKey: 'ten_danh_gia',
      header: 'Tên đánh giá',
    },
    {
      accessorKey: 'ngay_dau_dot_danh_gia',
      header: 'Ngày bắt đầu',
      cell: ({ row }) => formatDate(row.original.ngay_dau_dot_danh_gia),
    },
    {
      accessorKey: 'ngay_cuoi_dot_danh_gia',
      header: 'Ngày kết thúc',
      cell: ({ row }) => formatDate(row.original.ngay_cuoi_dot_danh_gia),
    },
    {
      accessorKey: 'trang_thai',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <Badge variant={row.original.trang_thai === 'completed' ? 'success' : 'secondary'}>
          {formatStatus(row.original.trang_thai)}
        </Badge>
      ),
    },
  ];

  // Column definitions for Assignments table
  const assignmentColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'tieu_de',
      header: 'Tiêu đề',
    },
    {
      accessorKey: 'ngay_giao',
      header: 'Ngày giao',
      cell: ({ row }) => formatDate(row.original.ngay_giao),
    },
    {
      accessorKey: 'han_nop',
      header: 'Hạn nộp',
      cell: ({ row }) => row.original.han_nop ? formatDate(row.original.han_nop) : 'Không có',
    },
    {
      accessorKey: 'trang_thai',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <Badge variant={row.original.trang_thai === 'completed' ? 'success' : 'secondary'}>
          {formatStatus(row.original.trang_thai)}
        </Badge>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{student.ten_hoc_sinh}</h2>
          <p className="text-muted-foreground">{student.ct_hoc || 'No curriculum'}</p>
        </div>
        <Button onClick={() => navigate(`/students/edit/${studentId}`)} className="flex items-center gap-1">
          <PenSquare className="h-4 w-4" /> Edit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin học sinh</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Họ tên</p>
            <p>{student.ten_hoc_sinh}</p>
          </div>
          {student.gioi_tinh && (
            <div>
              <p className="text-sm font-medium">Giới tính</p>
              <p>{student.gioi_tinh}</p>
            </div>
          )}
          {student.ngay_sinh && (
            <div>
              <p className="text-sm font-medium">Ngày sinh</p>
              <p>{formatDate(student.ngay_sinh)}</p>
            </div>
          )}
          {student.co_so_ID && (
            <div>
              <p className="text-sm font-medium">Cơ sở</p>
              <p>{student.co_so_ID}</p>
            </div>
          )}
          {student.ten_PH && (
            <div>
              <p className="text-sm font-medium">Phụ huynh</p>
              <p>{student.ten_PH}</p>
            </div>
          )}
          {student.sdt_ph1 && (
            <div>
              <p className="text-sm font-medium">SĐT phụ huynh</p>
              <p>{student.sdt_ph1}</p>
            </div>
          )}
          {student.email_ph1 && (
            <div>
              <p className="text-sm font-medium">Email phụ huynh</p>
              <p>{student.email_ph1}</p>
            </div>
          )}
          {student.dia_chi && (
            <div>
              <p className="text-sm font-medium">Địa chỉ</p>
              <p>{student.dia_chi}</p>
            </div>
          )}
          {student.han_hoc_phi && (
            <div>
              <p className="text-sm font-medium">Hạn học phí</p>
              <p>{formatDate(student.han_hoc_phi)}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium">Trạng thái</p>
            <Badge variant={student.trang_thai === 'active' ? 'success' : 'destructive'}>
              {formatStatus(student.trang_thai)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="enrollments">
        <TabsList>
          <TabsTrigger value="enrollments">Ghi danh</TabsTrigger>
          <TabsTrigger value="assignments">Bài tập</TabsTrigger>
          <TabsTrigger value="finances">Học phí</TabsTrigger>
          <TabsTrigger value="events">Sự kiện</TabsTrigger>
          <TabsTrigger value="evaluations">Đánh giá</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enrollments">
          <Card>
            <CardHeader>
              <CardTitle>Ghi danh</CardTitle>
              <CardDescription>Danh sách lớp học đã ghi danh</CardDescription>
            </CardHeader>
            <CardContent>
              {enrollments.length === 0 ? (
                <p className="text-muted-foreground">Học sinh chưa ghi danh vào lớp nào</p>
              ) : (
                <DataTable columns={enrollmentColumns} data={enrollments} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Bài tập</CardTitle>
              <CardDescription>Danh sách bài tập được giao</CardDescription>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <p className="text-muted-foreground">Học sinh chưa có bài tập nào</p>
              ) : (
                <DataTable columns={assignmentColumns} data={assignments} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finances">
          <Card>
            <CardHeader>
              <CardTitle>Học phí</CardTitle>
              <CardDescription>Danh sách các khoản nộp học phí</CardDescription>
            </CardHeader>
            <CardContent>
              {finances.length === 0 ? (
                <p className="text-muted-foreground">Không có thông tin học phí</p>
              ) : (
                <DataTable columns={financeColumns} data={finances} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Sự kiện</CardTitle>
              <CardDescription>Danh sách sự kiện liên quan</CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-muted-foreground">Không có sự kiện nào</p>
              ) : (
                <DataTable columns={eventColumns} data={events} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="evaluations">
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá</CardTitle>
              <CardDescription>Danh sách đánh giá của học sinh</CardDescription>
            </CardHeader>
            <CardContent>
              {evaluations.length === 0 ? (
                <p className="text-muted-foreground">Không có đánh giá nào</p>
              ) : (
                <DataTable columns={evaluationColumns} data={evaluations} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetail;
