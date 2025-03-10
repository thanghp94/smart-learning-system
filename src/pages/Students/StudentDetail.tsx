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
  RotateCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Student } from '@/lib/types';
import { studentService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ImageUpload from '@/components/common/ImageUpload';
import EnrollStudentButton from './components/EnrollStudentButton';
import { financeService } from '@/lib/supabase';
import EntityFinancesView from '@/pages/Finance/components/EntityFinancesView';

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempStudentData, setTempStudentData] = useState<Student | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const studentData = await studentService.getById(id);
          setStudent(studentData);
          setTempStudentData({ ...studentData });
        }
      } catch (error) {
        console.error('Error fetching student:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin học sinh',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
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
        <div className="flex flex-col space-y-1">
          <h2 className="text-2xl font-bold">{student.ho_va_ten}</h2>
          <p className="text-muted-foreground">
            Mã học sinh: {student.ma_hoc_sinh || 'Chưa có'}
          </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                <ImageUpload
                  imageUrl={tempStudentData?.anh_minh_hoc}
                  onUpload={handleImageUpload}
                  disabled={!isEditing}
                />
              </div>
              <div>
                {isEditing ? (
                  <>
                    <Label htmlFor="ho_va_ten">Họ và tên</Label>
                    <Input
                      id="ho_va_ten"
                      name="ho_va_ten"
                      value={tempStudentData?.ho_va_ten || ''}
                      onChange={handleChange}
                    />
                  </>
                ) : (
                  <>
                    <div className="font-medium">{student.ho_va_ten}</div>
                  </>
                )}
                <Badge variant="secondary">
                  {student.trang_thai === 'active' ? 'Đang học' : 'Đã nghỉ'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Ngày sinh:</span>
              {isEditing ? (
                <Input
                  type="date"
                  name="ngay_sinh"
                  value={tempStudentData?.ngay_sinh || ''}
                  onChange={handleChange}
                />
              ) : (
                <span>{student.ngay_sinh ? format(new Date(student.ngay_sinh), 'dd/MM/yyyy') : 'Chưa có'}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Giới tính:</span>
              {isEditing ? (
                <select
                  name="gioi_tinh"
                  value={tempStudentData?.gioi_tinh || ''}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="">Khác</option>
                </select>
              ) : (
                <span>{student.gioi_tinh || 'Chưa có'}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Địa chỉ:</span>
              {isEditing ? (
                <Input
                  name="dia_chi"
                  value={tempStudentData?.dia_chi || ''}
                  onChange={handleChange}
                />
              ) : (
                <span>{student.dia_chi || 'Chưa có'}</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin phụ huynh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Tên phụ huynh:</span>
              {isEditing ? (
                <Input
                  name="ten_ph"
                  value={tempStudentData?.ten_ph || ''}
                  onChange={handleChange}
                />
              ) : (
                <span>{student.ten_ph || 'Chưa có'}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Số điện thoại:</span>
              {isEditing ? (
                <Input
                  name="so_dien_thoai"
                  value={tempStudentData?.so_dien_thoai || ''}
                  onChange={handleChange}
                />
              ) : (
                <span>{student.so_dien_thoai || 'Chưa có'}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              {isEditing ? (
                <Input
                  name="email_ph1"
                  value={tempStudentData?.email_ph1 || ''}
                  onChange={handleChange}
                />
              ) : (
                <span>{student.email_ph1 || 'Chưa có'}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin học vấn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <School className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Trường:</span>
              {isEditing ? (
                <Input
                  name="truong"
                  value={tempStudentData?.truong || ''}
                  onChange={handleChange}
                />
              ) : (
                <span>{student.truong || 'Chưa có'}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Book className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Lớp:</span>
              {isEditing ? (
                <Input
                  name="lop"
                  value={tempStudentData?.lop || ''}
                  onChange={handleChange}
                />
              ) : (
                <span>{student.lop || 'Chưa có'}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Nguồn đến:</span>
              {isEditing ? (
                <Input
                  name="nguon_den"
                  value={tempStudentData?.nguon_den || ''}
                  onChange={handleChange}
                />
              ) : (
                <span>{student.nguon_den || 'Chưa có'}</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin khác</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Điểm mạnh:</span>
              {isEditing ? (
                <Textarea
                  name="diem_manh"
                  value={tempStudentData?.diem_manh || ''}
                  onChange={handleChange}
                />
              ) : (
                <span>{student.diem_manh || 'Chưa có'}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Ghi chú:</span>
              {isEditing ? (
                <Textarea
                  name="ghi_chu"
                  value={tempStudentData?.ghi_chu || ''}
                  onChange={handleChange}
                />
              ) : (
                <span>{student.ghi_chu || 'Chưa có'}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle>Hành động</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-start gap-4">
          <EnrollStudentButton 
            studentId={id}
            onEnrollmentCreated={async () => {
              toast({
                title: 'Thành công',
                description: 'Đã ghi danh học sinh vào lớp',
              });
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle>Lịch sử tài chính</CardTitle>
        </CardHeader>
        <CardContent>
          <EntityFinancesView entityType="student" entityId={id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetail;
