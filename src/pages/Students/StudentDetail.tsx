import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Calendar,
  User,
  Phone,
  Mail,
  Home,
  Edit,
  Save,
  X,
  Image as ImageIcon,
  Book,
  School,
  MessageSquare,
  Lightbulb,
  FileDown,
  RotateCw,
  CreditCard,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Student, Enrollment } from '@/lib/types';
import { studentService, enrollmentService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ImageUpload from '@/components/common/ImageUpload';
import EnrollStudentButton from './components/EnrollStudentButton';
import { financeService } from '@/lib/supabase';
import EntityFinancesView from '@/pages/Finance/components/EntityFinancesView';

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempStudentData, setTempStudentData] = useState<Student | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const studentData = await studentService.getById(id);
          setStudent(studentData);
          setTempStudentData({ ...studentData });
          
          const studentEnrollments = await enrollmentService.getByStudent(id);
          setEnrollments(studentEnrollments || []);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin học sinh',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setTempStudentData({ ...student });
  };

  const handleSaveClick = async () => {
    if (!id || !tempStudentData) return;

    try {
      setIsLoading(true);
      await studentService.update(id, tempStudentData);
      setStudent({ ...tempStudentData });
      setIsEditing(false);
      toast({
        title: 'Thành công',
        description: 'Thông tin học sinh đã được cập nhật',
      });
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin học sinh',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTempStudentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (url: string) => {
    setTempStudentData((prev) => ({ ...prev, anh_minh_hoc: url }));
  };

  if (isLoading) {
    return <div>Đang tải thông tin học sinh...</div>;
  }

  if (!student) {
    return <div>Không tìm thấy thông tin học sinh</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            {student.anh_minh_hoc || student.hinh_anh_hoc_sinh ? (
              <img 
                src={student.anh_minh_hoc || student.hinh_anh_hoc_sinh} 
                alt={student.ho_va_ten || student.ten_hoc_sinh} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{student.ho_va_ten || student.ten_hoc_sinh}</h2>
            <div className="flex items-center gap-2">
              <Badge variant={student.trang_thai === 'active' ? 'default' : 'secondary'}>
                {student.trang_thai === 'active' ? 'Đang học' : 'Đã nghỉ'}
              </Badge>
              <span className="text-muted-foreground">
                Mã học sinh: {student.ma_hoc_sinh || 'Chưa có'}
              </span>
            </div>
          </div>
        </div>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={handleCancelClick}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSaveClick}>
              <Save className="w-4 h-4 mr-2" />
              Lưu
            </Button>
          </div>
        ) : (
          <Button onClick={handleEditClick}>
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
        )}
      </div>

      <Separator />

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="classes">Lớp học đã ghi danh</TabsTrigger>
          <TabsTrigger value="finance">Tài chính</TabsTrigger>
          <TabsTrigger value="documents">Tài liệu</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="ho_va_ten">Họ và tên</Label>
                        <Input
                          id="ho_va_ten"
                          name="ho_va_ten"
                          value={tempStudentData?.ho_va_ten || tempStudentData?.ten_hoc_sinh || ''}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gioi_tinh">Giới tính</Label>
                        <select
                          id="gioi_tinh"
                          name="gioi_tinh"
                          value={tempStudentData?.gioi_tinh || ''}
                          onChange={handleChange}
                          className="w-full p-2 border rounded"
                        >
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="">Khác</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ngay_sinh">Ngày sinh</Label>
                        <Input
                          id="ngay_sinh"
                          name="ngay_sinh"
                          type="date"
                          value={tempStudentData?.ngay_sinh || ''}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="trang_thai">Trạng thái</Label>
                        <select
                          id="trang_thai"
                          name="trang_thai"
                          value={tempStudentData?.trang_thai || ''}
                          onChange={handleChange}
                          className="w-full p-2 border rounded"
                        >
                          <option value="active">Đang học</option>
                          <option value="inactive">Đã nghỉ</option>
                        </select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="ghi_chu">Ghi chú</Label>
                        <Textarea
                          id="ghi_chu"
                          name="ghi_chu"
                          value={tempStudentData?.ghi_chu || ''}
                          onChange={handleChange}
                          rows={3}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Họ và tên</span>
                        <p className="font-medium">{student.ho_va_ten || student.ten_hoc_sinh}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Giới tính</span>
                        <p className="font-medium">{student.gioi_tinh || 'Chưa cập nhật'}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Ngày sinh</span>
                        <p className="font-medium">
                          {student.ngay_sinh ? format(new Date(student.ngay_sinh), 'dd/MM/yyyy') : 'Chưa cập nhật'}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Trạng thái</span>
                        <p className="font-medium">
                          <Badge variant={student.trang_thai === 'active' ? 'default' : 'secondary'}>
                            {student.trang_thai === 'active' ? 'Đang học' : 'Đã nghỉ'}
                          </Badge>
                        </p>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <span className="text-sm text-muted-foreground">Ghi chú</span>
                        <p className="font-medium">{student.ghi_chu || 'Chưa cập nhật'}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="dia_chi">Địa chỉ</Label>
                      <Input
                        id="dia_chi"
                        name="dia_chi"
                        value={tempStudentData?.dia_chi || ''}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ten_ph">Tên phụ huynh</Label>
                      <Input
                        id="ten_ph"
                        name="ten_ph"
                        value={tempStudentData?.ten_ph || tempStudentData?.ten_PH || ''}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="so_dien_thoai">Số điện thoại</Label>
                      <Input
                        id="so_dien_thoai"
                        name="so_dien_thoai"
                        value={tempStudentData?.so_dien_thoai || tempStudentData?.sdt_ph1 || ''}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email_ph1">Email</Label>
                      <Input
                        id="email_ph1"
                        name="email_ph1"
                        value={tempStudentData?.email_ph1 || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Địa chỉ</span>
                      <p className="font-medium">{student.dia_chi || 'Chưa cập nhật'}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Tên phụ huynh</span>
                      <p className="font-medium">{student.ten_ph || student.ten_PH || 'Chưa cập nhật'}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Số điện thoại</span>
                      <p className="font-medium flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                        {student.so_dien_thoai || student.sdt_ph1 || 'Chưa cập nhật'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Email</span>
                      <p className="font-medium flex items-center">
                        <Mail className="w-3 h-3 mr-1 text-muted-foreground" />
                        {student.email_ph1 || 'Chưa cập nhật'}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin học vấn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="truong">Trường</Label>
                      <Input
                        id="truong"
                        name="truong"
                        value={tempStudentData?.truong || ''}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lop">Lớp</Label>
                      <Input
                        id="lop"
                        name="lop"
                        value={tempStudentData?.lop || ''}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nguon_den">Nguồn đến</Label>
                      <Input
                        id="nguon_den"
                        name="nguon_den"
                        value={tempStudentData?.nguon_den || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Trường</span>
                      <p className="font-medium">{student.truong || 'Chưa cập nhật'}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Lớp</span>
                      <p className="font-medium">{student.lop || 'Chưa cập nhật'}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Nguồn đến</span>
                      <p className="font-medium">{student.nguon_den || 'Chưa cập nhật'}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin học phí</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="ct_hoc">Chương trình học</Label>
                      <Input
                        id="ct_hoc"
                        name="ct_hoc"
                        value={tempStudentData?.ct_hoc || ''}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ngay_bat_dau_hoc_phi">Ngày bắt đầu học phí</Label>
                      <Input
                        type="date"
                        id="ngay_bat_dau_hoc_phi"
                        name="ngay_bat_dau_hoc_phi"
                        value={tempStudentData?.ngay_bat_dau_hoc_phi || ''}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="han_hoc_phi">Hạn học phí</Label>
                      <Input
                        type="date"
                        id="han_hoc_phi"
                        name="han_hoc_phi"
                        value={tempStudentData?.han_hoc_phi || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Chương trình học</span>
                      <p className="font-medium">{student.ct_hoc || 'Chưa cập nhật'}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Ngày bắt đầu học phí</span>
                      <p className="font-medium">
                        {student.ngay_bat_dau_hoc_phi ? format(new Date(student.ngay_bat_dau_hoc_phi), 'dd/MM/yyyy') : 'Chưa cập nhật'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Hạn học phí</span>
                      <p className="font-medium">
                        {student.han_hoc_phi ? format(new Date(student.han_hoc_phi), 'dd/MM/yyyy') : 'Chưa cập nhật'}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>Hành động</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-start gap-4">
              <EnrollStudentButton 
                student={student}
                studentId={id}
                onEnrollmentCreated={async () => {
                  toast({
                    title: 'Thành công',
                    description: 'Đã ghi danh học sinh vào lớp',
                  });
                  
                  try {
                    const studentEnrollments = await enrollmentService.getByStudent(id || '');
                    setEnrollments(studentEnrollments || []);
                  } catch (error) {
                    console.error('Error refreshing enrollments:', error);
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Lớp học đã ghi danh
              </CardTitle>
            </CardHeader>
            <CardContent>
              {enrollments.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <Card key={enrollment.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h3 className="text-lg font-semibold">{enrollment.ten_lop_full || enrollment.ten_lop || 'Lớp không tên'}</h3>
                            <p className="text-sm text-muted-foreground">
                              {enrollment.ct_hoc ? `Chương trình: ${enrollment.ct_hoc}` : ''}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Trạng thái điểm danh:</p>
                            <Badge variant={enrollment.tinh_trang_diem_danh === 'present' ? 'success' : 
                                          enrollment.tinh_trang_diem_danh === 'absent' ? 'destructive' : 
                                          enrollment.tinh_trang_diem_danh === 'late' ? 'warning' : 'outline'}>
                              {enrollment.tinh_trang_diem_danh === 'present' ? 'Có mặt' : 
                               enrollment.tinh_trang_diem_danh === 'absent' ? 'Vắng mặt' : 
                               enrollment.tinh_trang_diem_danh === 'late' ? 'Đi muộn' : 'Chưa điểm danh'}
                            </Badge>
                          </div>
                          <div className="flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/classes/${enrollment.lop_chi_tiet_id}`)}
                            >
                              Xem lớp
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-muted-foreground">
                  <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Học sinh chưa được ghi danh vào lớp nào</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => document.querySelector('[value="info"]')?.dispatchEvent(new Event('click'))}
                  >
                    Đăng ký vào lớp
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Lịch sử tài chính
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EntityFinancesView entityType="student" entityId={id || ''} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileDown className="h-5 w-5" />
                Tài liệu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-10 text-center text-muted-foreground">
                <FileDown className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Chưa có tài liệu nào</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetail;
