
import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter,
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Student, Enrollment, Finance, Event } from '@/lib/types';
import { 
  User, Calendar, MapPin, Phone, Mail, School, FileText, 
  DollarSign, Edit, Trash, Clock, Pencil, Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/DataTable';
import { format } from 'date-fns';
import { enrollmentService, financeService, eventService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import EnrollStudentButton from './EnrollStudentButton';

interface StudentDetailProps {
  student: Student;
  onEdit?: () => void;
  onDelete?: () => void;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student, onEdit, onDelete }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadStudentData = async () => {
      setIsLoading(true);
      try {
        // Get enrollments for this student
        const enrollmentsData = await enrollmentService.getByStudent(student.id);
        setEnrollments(enrollmentsData || []);
        
        // Get finances related to this student
        const financesData = await financeService.getByEntity('student', student.id);
        setFinances(financesData || []);
        
        // Get events related to this student
        const eventsData = await eventService.getByEntity('student', student.id);
        setEvents(eventsData || []);
        
      } catch (error) {
        console.error('Error loading student data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu học sinh. Vui lòng thử lại sau.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStudentData();
  }, [student.id, toast]);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Hoạt động</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Không hoạt động</Badge>;
      case 'pending':
        return <Badge variant="outline">Chờ xử lý</Badge>;
      default:
        return <Badge variant="outline">{status || 'N/A'}</Badge>;
    }
  };

  // Table columns for enrollments
  const enrollmentColumns = [
    {
      title: "Lớp học",
      key: "class_id",
      render: () => "Tên lớp"
    },
    {
      title: "Ngày bắt đầu",
      key: "start_date",
      render: () => "01/01/2023"
    },
    {
      title: "Trạng thái",
      key: "status",
      render: () => <Badge variant="success">Đang học</Badge>
    },
    {
      title: "Học phí",
      key: "fee",
      render: () => "2,000,000 ₫"
    },
    {
      title: "Hạn đóng phí",
      key: "due_date",
      render: () => "15/01/2023"
    }
  ];

  // Table columns for finances
  const financeColumns = [
    {
      title: "Ngày",
      key: "date",
      render: () => "01/01/2023"
    },
    {
      title: "Loại",
      key: "type",
      render: () => "Học phí"
    },
    {
      title: "Số tiền",
      key: "amount",
      render: () => "2,000,000 ₫"
    }
  ];

  // Table columns for events
  const eventColumns = [
    {
      title: "Ngày",
      key: "date",
      render: () => "01/01/2023"
    },
    {
      title: "Tên sự kiện",
      key: "name",
      render: () => "Sự kiện A"
    },
    {
      title: "Loại",
      key: "type",
      render: () => "Hoạt động ngoại khóa"
    },
    {
      title: "Trạng thái",
      key: "status",
      render: () => <Badge variant="outline">Sắp diễn ra</Badge>
    }
  ];

  const loadClassEnrollments = async () => {
    try {
      setActiveTab('enrollments');
      if (enrollments.length === 0) {
        const enrollmentsData = await enrollmentService.getByStudent(student.id);
        setEnrollments(enrollmentsData || []);
      }
    } catch (error) {
      console.error('Error loading enrollments:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu lớp học. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    }
  };

  // Placeholder data
  const dummyStudentData: Student = student;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{dummyStudentData.ho_va_ten || dummyStudentData.ten_hoc_sinh}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <span>{dummyStudentData.ma_hoc_sinh || 'MS12345'}</span>
              <span className="mx-2">•</span>
              {getStatusBadge(dummyStudentData.trang_thai)}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-1" /> Sửa
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash className="h-4 w-4 mr-1" /> Xóa
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="enrollments">Lớp học</TabsTrigger>
          <TabsTrigger value="finances">Tài chính</TabsTrigger>
          <TabsTrigger value="events">Sự kiện</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground w-32">Họ và tên:</span>
                  <span>{dummyStudentData.ho_va_ten || dummyStudentData.ten_hoc_sinh}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground w-32">Ngày sinh:</span>
                  <span>{dummyStudentData.ngay_sinh ? format(new Date(dummyStudentData.ngay_sinh), 'dd/MM/yyyy') : 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground w-32">Địa chỉ:</span>
                  <span>{dummyStudentData.dia_chi || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center">
                  <School className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground w-32">Trường:</span>
                  <span>{dummyStudentData.truong || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground w-32">Nguồn đến:</span>
                  <span>{dummyStudentData.nguon_den || 'Chưa cập nhật'}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Thông tin phụ huynh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground w-32">Tên phụ huynh:</span>
                  <span>{dummyStudentData.ten_PH || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground w-32">Số điện thoại:</span>
                  <span>{dummyStudentData.sdt_ph1 || dummyStudentData.so_dien_thoai || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground w-32">Email:</span>
                  <span>{dummyStudentData.email_ph1 || 'Chưa cập nhật'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="enrollments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Danh sách lớp học</CardTitle>
              <EnrollStudentButton studentId={student.id} onEnrollmentCreated={loadClassEnrollments} />
            </CardHeader>
            <CardContent>
              <DataTable
                columns={enrollmentColumns}
                data={enrollments}
                emptyMessage="Học sinh chưa đăng ký lớp học nào"
                showHeader={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finances">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Thông tin tài chính</CardTitle>
              <Button variant="outline" size="sm">
                <DollarSign className="h-4 w-4 mr-1" /> Tạo giao dịch mới
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={financeColumns}
                data={finances}
                emptyMessage="Chưa có thông tin tài chính"
                showHeader={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sự kiện tham gia</CardTitle>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-1" /> Đăng ký sự kiện
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={eventColumns}
                data={events}
                emptyMessage="Chưa tham gia sự kiện nào"
                showHeader={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-muted-foreground">
                <p>Chưa có dữ liệu lịch sử</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetail;
