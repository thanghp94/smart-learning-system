
import React from 'react';
import { useParams } from 'react-router-dom';
import { User, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import StudentInfoTab from './components/StudentInfoTab';
import StudentFinanceTab from './components/StudentFinanceTab';
import StudentEnrollmentsTab from './components/StudentEnrollmentsTab';
import StudentActionsSection from './components/StudentActionsSection';
import StudentProgressTab from './components/StudentProgressTab';
import { useStudentData } from './hooks/useStudentData';

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    student, 
    tempStudentData, 
    enrollments, 
    isLoading, 
    isEditing, 
    facilityName,
    setIsEditing, 
    setTempStudentData,
    refreshEnrollments, 
    handleChange, 
    handleImageUpload, 
    handleSave
  } = useStudentData(id);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setTempStudentData({ ...student });
  };

  if (isLoading) {
    return <div className="p-4 text-center">Đang tải thông tin học sinh...</div>;
  }

  if (!student) {
    return <div className="p-4 text-center">Không tìm thấy thông tin học sinh</div>;
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
            <Button onClick={handleSave}>
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
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="progress">Tiến độ</TabsTrigger>
          <TabsTrigger value="finance">Tài chính</TabsTrigger>
          <TabsTrigger value="enrollments">Ghi danh</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <StudentInfoTab 
                student={student}
                isEditing={isEditing}
                tempStudentData={tempStudentData}
                handleChange={handleChange}
                handleImageUpload={handleImageUpload}
                facilityName={facilityName}
              />
            </div>
            <div>
              <StudentActionsSection 
                student={student}
                studentId={id || ''}
                refreshEnrollments={refreshEnrollments}
              />
            </div>
          </div>
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
