import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Download, Calendar } from 'lucide-react';
import { Student } from '@/lib/types';
import { Link } from 'react-router-dom';
import DataTable from '@/components/ui/DataTable';
import EnrollStudentButton from './EnrollStudentButton';
import { enrollmentService, financeService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const formatGender = (gender: string | undefined) => {
  if (!gender) return 'N/A';
  return gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : gender;
};

const formatStudentStatus = (status: string | undefined) => {
  if (!status) return 'N/A';
  switch(status) {
    case 'active': return 'Đang học';
    case 'inactive': return 'Nghỉ học';
    case 'waiting': return 'Chờ nhập học';
    case 'graduated': return 'Đã tốt nghiệp';
    default: return status;
  }
};

interface StudentDetailProps {
  student: Student;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [finances, setFinances] = useState([]);
  const [isLoadingFinances, setIsLoadingFinances] = useState(true);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingEnrollments(true);
        const enrollmentsData = await enrollmentService.getByStudent(student.id);
        setEnrollments(enrollmentsData);
      } catch (error) {
        console.error("Error loading enrollments:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu đăng ký lớp học",
          variant: "destructive",
        });
      } finally {
        setIsLoadingEnrollments(false);
      }

      try {
        setIsLoadingFinances(true);
        const financesData = await financeService.getByStudent(student.id);
        setFinances(financesData);
      } catch (error) {
        console.error("Error loading finances:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu tài chính",
          variant: "destructive",
        });
      } finally {
        setIsLoadingFinances(false);
      }
    };

    loadData();
  }, [student.id, toast]);

  const basicInfoColumns = [
    {
      title: "Mã học sinh",
      key: "ma_hoc_sinh",
      render: () => student.ma_hoc_sinh || "N/A",
    },
    {
      title: "Họ và tên",
      key: "ho_va_ten",
      render: () => student.ho_va_ten || "N/A",
    },
    {
      title: "Ngày sinh",
      key: "ngay_sinh",
      render: () => student.ngay_sinh ? format(new Date(student.ngay_sinh), 'dd/MM/yyyy') : "N/A",
    },
    {
      title: "Giới tính",
      key: "gioi_tinh",
      render: () => formatGender(student.gioi_tinh),
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      render: () => (
        <Badge variant={student.trang_thai === 'active' ? 'success' : 'secondary'}>
          {formatStudentStatus(student.trang_thai)}
        </Badge>
      ),
    },
  ];

  const parentInfoColumns = [
    {
      title: "Họ tên Phụ huynh",
      key: "ten_phu_huynh",
      render: () => student.ten_ph || "N/A",
    },
    {
      title: "Số điện thoại",
      key: "so_dien_thoai",
      render: () => student.so_dien_thoai || "N/A",
    },
    {
      title: "Email",
      key: "email",
      render: () => student.email_ph1 || "N/A",
    },
  ];

  const schoolInfoColumns = [
    {
      title: "Trường học",
      key: "truong",
      render: () => student.truong || "N/A",
    },
    {
      title: "Lớp học",
      key: "lop",
      render: () => student.lop || "N/A",
    },
  ];

  const handleEnrollmentComplete = () => {
    enrollmentService.getByStudent(student.id).then(data => {
      setEnrollments(data);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Thông tin học sinh</h2>
          <p className="text-muted-foreground">Thông tin chi tiết về học sinh</p>
        </div>
        <div className="flex items-center space-x-2">
          <EnrollStudentButton 
            student={student.id}
            onEnrollmentComplete={handleEnrollmentComplete}
          />
          <Button asChild variant="outline">
            <Link to={`/students/edit/${student.id}`}>
              <Pencil className="h-4 w-4 mr-2" /> Sửa thông tin
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Xuất
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic-info">
        <TabsList className="mb-4">
          <TabsTrigger value="basic-info">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="enrollments">Đăng ký lớp học ({enrollments.length})</TabsTrigger>
          <TabsTrigger value="finances">Tài chính ({finances.length})</TabsTrigger>
          <TabsTrigger value="attendance">Điểm danh</TabsTrigger>
          <TabsTrigger value="notes">Ghi chú</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin học sinh</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={basicInfoColumns}
                  data={[student]}
                  noDataMessage="Không có thông tin học sinh"
                  showHeader={false}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin phụ huynh</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={parentInfoColumns}
                  data={[student]}
                  noDataMessage="Không có thông tin phụ huynh"
                  showHeader={false}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin trường học</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={schoolInfoColumns}
                  data={[student]}
                  noDataMessage="Không có thông tin trường học"
                  showHeader={false}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ghi chú</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{student.ghi_chu || 'Không có ghi chú'}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="enrollments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Đăng ký lớp học</CardTitle>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-1" /> Lịch học
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                {isLoadingEnrollments ? 'Đang tải...' : (
                  enrollments.length === 0 ? 'Chưa đăng ký lớp học nào' : 'Danh sách lớp học đã đăng ký'
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finances">
          <Card>
            <CardHeader>
              <CardTitle>Tài chính</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                {isLoadingFinances ? 'Đang tải...' : (
                  finances.length === 0 ? 'Không có giao dịch tài chính' : 'Danh sách giao dịch tài chính'
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Điểm danh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Thông tin điểm danh sẽ hiển thị ở đây
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Ghi chú</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Các ghi chú về học sinh sẽ hiển thị ở đây
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetail;
