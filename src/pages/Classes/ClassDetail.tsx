
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, UserCheck, Calendar } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { Class, Enrollment, TeachingSession } from '@/lib/types';
import { classService, enrollmentService, teachingSessionService } from '@/lib/supabase';
import DataTable from '@/components/ui/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import AddTeachingSessionButton from './AddTeachingSessionButton';

// Define separate components for each section of the detail view
const ClassInfo: React.FC<{ classData: Class }> = ({ classData }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Thông tin lớp học</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Mã lớp</h3>
            <p>{classData.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Tên lớp</h3>
            <p>{classData.ten_lop_full}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Chương trình học</h3>
            <p>{classData.ct_hoc || 'Chưa xác định'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Trạng thái</h3>
            <Badge 
              variant={classData.tinh_trang === 'active' ? 'success' : 'destructive'}
            >
              {classData.tinh_trang === 'active' ? 'Đang hoạt động' : 'Đã đóng'}
            </Badge>
          </div>
          {classData.ngay_bat_dau && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Ngày bắt đầu</h3>
              <p>{formatDate(classData.ngay_bat_dau)}</p>
            </div>
          )}
          {classData.ghi_chu && (
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">Ghi chú</h3>
              <p>{classData.ghi_chu}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const EnrollmentsSection: React.FC<{ 
  enrollments: Enrollment[],
  onRefresh: () => void
}> = ({ enrollments, onRefresh }) => {
  const columns = [
    {
      title: "Học sinh",
      key: "ten_hoc_sinh",
      sortable: true,
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
      title: "Nhận xét",
      key: "nhan_xet_tieu_chi_1",
      sortable: false,
      render: (value: string) => value ? value.substring(0, 50) + (value.length > 50 ? '...' : '') : '-',
    },
  ];

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Danh sách học sinh đã ghi danh</CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Thêm học sinh
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={enrollments}
          searchable={true}
          searchPlaceholder="Tìm kiếm học sinh..."
        />
      </CardContent>
    </Card>
  );
};

const SessionsSection: React.FC<{ 
  sessions: TeachingSession[],
  classData: Class,
  onRefresh: () => void
}> = ({ sessions, classData, onRefresh }) => {
  const columns = [
    {
      title: "Ngày học",
      key: "ngay_hoc",
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      title: "Thời gian",
      key: "thoi_gian_bat_dau",
      sortable: true,
      render: (value: string, record: TeachingSession) => 
        `${value} - ${record.thoi_gian_ket_thuc}`,
    },
    {
      title: "Giáo viên",
      key: "giao_vien",
      sortable: true,
    },
    {
      title: "Trợ giảng",
      key: "tro_giang",
      sortable: true,
      render: (value: string) => value || '-',
    },
    {
      title: "Loại bài học",
      key: "loai_bai_hoc",
      sortable: true,
      render: (value: string) => value || '-',
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Danh sách buổi học</CardTitle>
        <AddTeachingSessionButton classData={classData} onSuccess={onRefresh} />
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={sessions}
          searchable={true}
          searchPlaceholder="Tìm kiếm buổi học..."
        />
      </CardContent>
    </Card>
  );
};

// Main component
const ClassDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [classData, setClassData] = React.useState<Class | null>(null);
  const [enrollments, setEnrollments] = React.useState<Enrollment[]>([]);
  const [sessions, setSessions] = React.useState<TeachingSession[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchClassData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await classService.getById(id);
      setClassData(data);
      
      // Fetch enrollments for this class
      const enrollmentsData = await enrollmentService.getByClass(id);
      setEnrollments(enrollmentsData);
      
      // Fetch sessions for this class
      const sessionsData = await teachingSessionService.getByClass(id);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error fetching class data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClassData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!classData) {
    return <div>Class not found</div>;
  }

  return (
    <div className="container mx-auto py-4">
      <PageHeader
        title={`Lớp: ${classData.ten_lop_full}`}
        description="Chi tiết thông tin lớp học và danh sách học sinh"
        backButton={
          <Button variant="outline" size="sm" asChild>
            <Link to="/classes">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Link>
          </Button>
        }
      />
      
      <ClassInfo classData={classData} />
      <EnrollmentsSection enrollments={enrollments} onRefresh={fetchClassData} />
      <SessionsSection sessions={sessions} classData={classData} onRefresh={fetchClassData} />
    </div>
  );
};

export default ClassDetail;
