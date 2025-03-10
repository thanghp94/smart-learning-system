
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Student, Enrollment, Finance, Event, Contact, Evaluation } from '@/lib/types';
import { Phone, Mail, Home, Calendar, School, User, FileText, DollarSign, Bell, Users, Star } from 'lucide-react';
import { enrollmentService, financeService, eventService, contactService, evaluationService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable from '@/components/ui/DataTable';
import EnrollStudentButton from './EnrollStudentButton';

interface StudentDetailProps {
  student: Student;
  onRefresh: () => void;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student, onRefresh }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRelatedData = async () => {
      setIsLoading(true);
      try {
        // Fetch related data in parallel
        const [enrollmentsData, financesData, eventsData, contactsData, evaluationsData] = await Promise.all([
          enrollmentService.getByStudent(student.id),
          financeService.getByStudent(student.id),
          eventService.getByEntity('student', student.id),
          contactService.getByEntity('student', student.id),
          evaluationService.getByStudent(student.id)
        ]);
        
        setEnrollments(enrollmentsData);
        setFinances(financesData);
        setEvents(eventsData);
        setContacts(contactsData);
        setEvaluations(evaluationsData);
      } catch (error) {
        console.error('Error fetching student related data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu liên quan đến học sinh',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (student?.id) {
      fetchRelatedData();
    }
  }, [student?.id, toast]);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const enrollmentsData = await enrollmentService.getByStudent(student.id);
      setEnrollments(enrollmentsData);
      onRefresh();
    } catch (error) {
      console.error('Error refreshing enrollments:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật danh sách ghi danh',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const enrollmentColumns = [
    { title: 'Lớp', key: 'lop_chi_tiet_id', sortable: true },
    { title: 'Trạng thái', key: 'tinh_trang_diem_danh', sortable: true },
    { title: 'Ngày tạo', key: 'created_at', sortable: true, render: (value: string) => formatDate(value) },
    { title: 'Cập nhật', key: 'updated_at', sortable: true, render: (value: string) => formatDate(value) },
  ];

  const financeColumns = [
    { title: 'Ngày', key: 'ngay', sortable: true, render: (value: string) => formatDate(value) },
    { title: 'Tên phí', key: 'ten_phi', sortable: true },
    { title: 'Loại thu chi', key: 'loai_thu_chi', sortable: true },
    { title: 'Tổng tiền', key: 'tong_tien', sortable: true, render: (value: number) => formatCurrency(value) },
    { title: 'Trạng thái', key: 'tinh_trang', sortable: true }
  ];

  const eventColumns = [
    { title: 'Tên sự kiện', key: 'ten_su_kien', sortable: true },
    { title: 'Loại sự kiện', key: 'loai_su_kien', sortable: true },
    { title: 'Ngày bắt đầu', key: 'ngay_bat_dau', sortable: true, render: (value: string) => formatDate(value) },
    { title: 'Địa điểm', key: 'dia_diem', sortable: true },
    { title: 'Trạng thái', key: 'trang_thai', sortable: true }
  ];

  const contactColumns = [
    { title: 'Tên liên hệ', key: 'ten_lien_he', sortable: true },
    { title: 'Số điện thoại', key: 'sdt', sortable: true },
    { title: 'Email', key: 'email', sortable: true },
    { title: 'Phân loại', key: 'phan_loai', sortable: true },
    { title: 'Trạng thái', key: 'trang_thai', sortable: true }
  ];

  const evaluationColumns = [
    { title: 'Tên đánh giá', key: 'ten_danh_gia', sortable: true },
    { title: 'Ngày bắt đầu', key: 'ngay_dau_dot_danh_gia', sortable: true, render: (value: string) => value ? formatDate(value) : 'N/A' },
    { title: 'Ngày kết thúc', key: 'ngay_cuoi_dot_danh_gia', sortable: true, render: (value: string) => value ? formatDate(value) : 'N/A' },
    { title: 'Nhận xét chung', key: 'nhan_xet_chung', sortable: true },
    { title: 'Trạng thái', key: 'trang_thai', sortable: true }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-semibold">{student.ten_hoc_sinh}</h3>
          <p className="text-muted-foreground">
            {student.gioi_tinh === 'nam' ? 'Nam' : 
             student.gioi_tinh === 'nu' ? 'Nữ' : 
             'Không xác định'} - {student.ngay_sinh ? formatDate(student.ngay_sinh) : 'Chưa có ngày sinh'}
          </p>
        </div>
        <Badge variant={student.trang_thai === 'active' ? 'success' : 'destructive'}>
          {student.trang_thai === 'active' ? 'Đang học' : 'Ngừng học'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Ngày sinh: {student.ngay_sinh ? formatDate(student.ngay_sinh) : 'Chưa có'}</span>
            </div>
            <div className="flex items-center">
              <Home className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Địa chỉ: {student.dia_chi || 'Chưa có'}</span>
            </div>
            <div className="flex items-center">
              <School className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Chương trình: {student.ct_hoc || 'Chưa xác định'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Thông tin phụ huynh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Tên phụ huynh: {student.ten_PH || 'Chưa có'}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Số điện thoại: {student.sdt_ph1 || 'Chưa có'}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Email: {student.email_ph1 || 'Chưa có'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <EnrollStudentButton student={student} onEnrollmentComplete={refreshData} />
      </div>

      <Tabs defaultValue="enrollments" className="w-full pt-4">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="enrollments" className="flex items-center">
            <School className="h-4 w-4 mr-2" />
            Ghi danh
          </TabsTrigger>
          <TabsTrigger value="finances" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Học phí
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Sự kiện
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Liên lạc
          </TabsTrigger>
          <TabsTrigger value="evaluations" className="flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Đánh giá
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrollments" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <DataTable
                columns={enrollmentColumns}
                data={enrollments}
                isLoading={isLoading}
                searchable={true}
                searchPlaceholder="Tìm kiếm ghi danh..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <DataTable
                columns={financeColumns}
                data={finances}
                isLoading={isLoading}
                searchable={true}
                searchPlaceholder="Tìm kiếm học phí..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <DataTable
                columns={eventColumns}
                data={events}
                isLoading={isLoading}
                searchable={true}
                searchPlaceholder="Tìm kiếm sự kiện..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <DataTable
                columns={contactColumns}
                data={contacts}
                isLoading={isLoading}
                searchable={true}
                searchPlaceholder="Tìm kiếm liên lạc..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluations" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <DataTable
                columns={evaluationColumns}
                data={evaluations}
                isLoading={isLoading}
                searchable={true}
                searchPlaceholder="Tìm kiếm đánh giá..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {student.ghi_chu && (
        <Card>
          <CardContent className="p-6">
            <h4 className="font-medium mb-2">Ghi chú</h4>
            <p>{student.ghi_chu}</p>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-muted-foreground flex justify-between">
        <span>Ngày tạo: {formatDate(student.created_at || '')}</span>
        <span>Cập nhật: {formatDate(student.updated_at || '')}</span>
      </div>
    </div>
  );
};

export default StudentDetail;
