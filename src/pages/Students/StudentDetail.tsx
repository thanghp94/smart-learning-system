import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Student } from '@/lib/types';
import { studentService, enrollmentService, facilityService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import StudentInfoTab from './components/StudentInfoTab';
import StudentFinanceTab from './components/StudentFinanceTab';
import StudentEnrollmentsTab from './components/StudentEnrollmentsTab';
import StudentActionsSection from './components/StudentActionsSection';
import StudentProgressTab from './components/StudentProgressTab';

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempStudentData, setTempStudentData] = useState<Student | null>(null);
  const [facilityName, setFacilityName] = useState<string>('');
  const { toast } = useToast();

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
          
          if (studentData.co_so_id) {
            try {
              const facilityData = await facilityService.getById(studentData.co_so_id);
              if (facilityData) {
                setFacilityName(facilityData.ten_co_so);
              }
            } catch (error) {
              console.error('Error fetching facility:', error);
            }
          }
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
  
  const refreshEnrollments = async () => {
    if (!id) return;
    try {
      const studentEnrollments = await enrollmentService.getByStudent(id);
      setEnrollments(studentEnrollments || []);
    } catch (error) {
      console.error('Error refreshing enrollments:', error);
    }
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
          <TabsTrigger value="info">Thông tin chung</TabsTrigger>
          <TabsTrigger value="progress">Tiến độ</TabsTrigger>
          <TabsTrigger value="finance">Tài chính</TabsTrigger>
          <TabsTrigger value="enrollments">Ghi danh</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <StudentInfoTab 
            student={student}
            isEditing={isEditing}
            tempStudentData={tempStudentData}
            handleChange={handleChange}
            handleImageUpload={handleImageUpload}
            facilityName={facilityName}
          />
          
          <StudentActionsSection 
            student={student}
            studentId={id || ''}
            refreshEnrollments={refreshEnrollments}
          />
        </TabsContent>

        <TabsContent value="progress">
          <StudentProgressTab studentId={id || ''} />
        </TabsContent>

        <TabsContent value="finance">
          <StudentFinanceTab studentId={id || ''} />
        </TabsContent>

        <TabsContent value="enrollments">
          <StudentEnrollmentsTab enrollments={enrollments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetail;
