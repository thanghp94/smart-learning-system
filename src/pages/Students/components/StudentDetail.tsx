import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { studentService, financeService, eventService, evaluationService } from '@/lib/supabase';
import { formatDate } from '@/utils/format';
import { Student, Finance, Event, Evaluation } from '@/lib/types';
import { PenSquare, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DataTable from '@/components/ui/DataTable';
import EnrollStudentButton from './EnrollStudentButton';
import { formatGender, formatStudentStatus } from '@/utils/format';

interface StudentDetailProps {
  studentId: string;
}

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch student details
        const studentData = await studentService.getById(id);
        setStudent(studentData);
        
        // Fetch related finances
        const financesData = await financeService.getByEntity('student', id);
        setFinances(financesData);
        
        // Fetch related events
        const eventsData = await eventService.getByEntity('student', id);
        setEvents(eventsData);
        
        // Fetch evaluations
        // We need to implement getByStudentId in evaluationService
        const evaluationsData = await evaluationService.getByStudentId(id);
        setEvaluations(evaluationsData);
        
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast({
          title: 'Error',
          description: 'Unable to load student data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudentData();
  }, [id, toast]);

  const financeColumns = [
    {
      title: 'Ngày',
      key: 'ngay',
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Loại',
      key: 'loai_giao_dich',
    },
    {
      title: 'Số tiền',
      key: 'tong_tien',
      render: (value: number) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
    },
    {
      title: 'Ghi chú',
      key: 'ghi_chu',
    },
  ];

  const eventColumns = [
    {
      title: 'Tên sự kiện',
      key: 'ten_su_kien',
    },
    {
      title: 'Ngày',
      key: 'ngay',
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Địa điểm',
      key: 'dia_diem',
    },
  ];

  const evaluationColumns = [
    {
      title: 'Giáo viên',
      key: 'giao_vien_id',
    },
    {
      title: 'Lớp',
      key: 'lop_id',
    },
    {
      title: 'Nhận xét',
      key: 'nhan_xet',
    },
  ];

  if (isLoading) {
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
          <p className="text-muted-foreground">
            {student.dia_chi || 'No address'}
          </p>
        </div>
        <div className="space-x-2">
          <EnrollStudentButton studentId={student.id} />
          <Button asChild>
            <Link to={`/students/edit/${student.id}`} className="flex items-center gap-1">
              <PenSquare className="h-4 w-4" /> Edit
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>Thông tin chi tiết về học sinh</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Họ và tên</p>
            <p>{student.ten_hoc_sinh}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Giới tính</p>
            <p>{formatGender(student.gioi_tinh)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Ngày sinh</p>
            <p>{formatDate(student.ngay_sinh)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Cơ sở</p>
            <p>{student.co_so_id}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Địa chỉ</p>
            <p>{student.dia_chi}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Trạng thái</p>
            <Badge variant={student.trang_thai === 'active' ? 'success' : 'destructive'}>
              {formatStudentStatus(student.trang_thai)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="finances" className="space-y-4">
        <TabsList>
          <TabsTrigger value="finances">Tài chính</TabsTrigger>
          <TabsTrigger value="events">Sự kiện</TabsTrigger>
          <TabsTrigger value="evaluations">Đánh giá</TabsTrigger>
        </TabsList>
        <TabsContent value="finances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tài chính</CardTitle>
              <CardDescription>Lịch sử giao dịch tài chính của học sinh</CardDescription>
            </CardHeader>
            <CardContent>
              {finances.length === 0 ? (
                <p className="text-muted-foreground">Không có giao dịch tài chính</p>
              ) : (
                <DataTable columns={financeColumns} data={finances} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sự kiện</CardTitle>
              <CardDescription>Các sự kiện mà học sinh tham gia</CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-muted-foreground">Không có sự kiện</p>
              ) : (
                <DataTable columns={eventColumns} data={events} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="evaluations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá</CardTitle>
              <CardDescription>Các đánh giá của giáo viên về học sinh</CardDescription>
            </CardHeader>
            <CardContent>
              {evaluations.length === 0 ? (
                <p className="text-muted-foreground">Không có đánh giá</p>
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
