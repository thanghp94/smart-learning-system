
import React, { useState, useEffect } from 'react';
import { 
  Clock, Calendar, User, Users, Book, Building, 
  Trash2, Share2, FileEdit, ArrowLeft
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Class, Student, TeachingSession, Enrollment, Evaluation } from '@/lib/types';
import { enrollmentService, teachingSessionService, evaluationService } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import AddTeachingSessionButton from './AddTeachingSessionButton';
import ViewEvaluationsButton from '../Evaluations/ViewEvaluationsButton';

interface ClassDetailProps {
  classItem: Class;
}

const ClassDetail: React.FC<ClassDetailProps> = ({ classItem }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (classItem?.id) {
          const enrollmentsData = await enrollmentService.getByClass(classItem.id);
          setEnrollments(enrollmentsData || []);
          
          const sessionsData = await teachingSessionService.getByClass(classItem.id);
          setSessions(sessionsData || []);
        }
      } catch (error) {
        console.error('Error fetching class details:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu chi tiết của lớp học',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (classItem?.id) {
      fetchData();
    }
  }, [classItem?.id, toast]);

  const handleRefreshData = async () => {
    if (classItem?.id) {
      try {
        const sessionsData = await teachingSessionService.getByClass(classItem.id);
        setSessions(sessionsData || []);
        
        const enrollmentsData = await enrollmentService.getByClass(classItem.id);
        setEnrollments(enrollmentsData || []);
        
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật dữ liệu',
        });
      } catch (error) {
        console.error('Error refreshing data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể cập nhật dữ liệu',
          variant: 'destructive'
        });
      }
    }
  };

  if (!classItem) {
    return <div>Không tìm thấy thông tin lớp học</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{classItem.ten_lop_full}</h2>
          <Badge variant={classItem.tinh_trang === 'active' ? 'success' : 'destructive'}>
            {classItem.tinh_trang === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
          </Badge>
        </div>
        <p className="text-muted-foreground">{classItem.ten_lop} - {classItem.ct_hoc}</p>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Ngày bắt đầu:</span>
          <span>{classItem.ngay_bat_dau ? formatDate(classItem.ngay_bat_dau) : 'Chưa có'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Giáo viên chính:</span>
          <span>{classItem.teacher_name || 'Not assigned'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Cơ sở:</span>
          <span>{classItem.facility_name || 'Not assigned'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Số học sinh:</span>
          <span>{enrollments.length}</span>
        </div>
      </div>
      
      {classItem.ghi_chu && (
        <div className="mt-4">
          <h3 className="font-medium">Ghi chú:</h3>
          <p className="text-sm text-muted-foreground mt-1">{classItem.ghi_chu}</p>
        </div>
      )}
      
      <Tabs defaultValue="sessions" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sessions">Buổi học</TabsTrigger>
          <TabsTrigger value="students">Học sinh</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions" className="space-y-4">
          <div className="flex justify-between items-center my-4">
            <h3 className="text-lg font-medium">Danh sách buổi học</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefreshData}>
                <Calendar className="h-4 w-4 mr-1" />
                Làm mới
              </Button>
              <AddTeachingSessionButton 
                classItem={classItem} 
                onSuccess={handleRefreshData}
              />
            </div>
          </div>
          
          {sessions.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground">Chưa có buổi học nào</p>
                <AddTeachingSessionButton 
                  classItem={classItem} 
                  onSuccess={handleRefreshData}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">
                          {session.lesson_content || 'Session'} - {session.ngay_hoc ? format(parseISO(session.ngay_hoc), 'dd/MM/yyyy') : 'No date'}
                        </CardTitle>
                        <CardDescription>
                          {session.teacher_name || 'Not assigned'}
                        </CardDescription>
                      </div>
                      <Badge variant={
                        typeof session.completed === 'boolean' 
                          ? (session.completed ? 'success' : 'destructive')
                          : session.completed === 'completed' ? 'success' :
                            session.completed === 'cancelled' ? 'destructive' :
                            'secondary'
                      }>
                        {
                          typeof session.completed === 'boolean'
                            ? (session.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành')
                            : session.completed === 'completed' ? 'Đã hoàn thành' :
                              session.completed === 'cancelled' ? 'Đã hủy' :
                              session.completed === 'scheduled' ? 'Đã lên lịch' :
                              'Chưa xác định'
                        }
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {session.nhan_xet_1 ? (
                      <p className="text-sm">{session.nhan_xet_1}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Chưa có nội dung</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-0">
                    <Button variant="outline" size="sm">
                      <FileEdit className="h-4 w-4 mr-1" />
                      Chi tiết
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="students" className="space-y-4">
          <div className="flex justify-between items-center my-4">
            <h3 className="text-lg font-medium">Danh sách học sinh</h3>
            <Button variant="outline" size="sm" onClick={handleRefreshData}>
              <Users className="h-4 w-4 mr-1" />
              Làm mới
            </Button>
          </div>
          
          {enrollments.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground">Chưa có học sinh nào đăng ký lớp này</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{enrollment.ten_hoc_sinh || 'Học sinh'}</CardTitle>
                      <Badge variant={
                        typeof enrollment.tinh_trang_diem_danh === 'boolean' 
                          ? (enrollment.tinh_trang_diem_danh ? 'success' : 'destructive')
                          : enrollment.tinh_trang_diem_danh === 'active' ? 'success' :
                            enrollment.tinh_trang_diem_danh === 'inactive' ? 'destructive' :
                            'secondary'
                      }>
                        {
                          typeof enrollment.tinh_trang_diem_danh === 'boolean'
                            ? (enrollment.tinh_trang_diem_danh ? 'Đang học' : 'Chưa học')
                            : enrollment.tinh_trang_diem_danh === 'active' ? 'Đang học' :
                              enrollment.tinh_trang_diem_danh === 'inactive' ? 'Đã nghỉ' :
                              enrollment.tinh_trang_diem_danh === 'pending' ? 'Chờ xử lý' :
                              'Khác'
                        }
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Ngày ghi danh:</span>
                        <span>{enrollment.created_at ? format(parseISO(enrollment.created_at), 'dd/MM/yyyy') : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Book className="h-4 w-4 text-muted-foreground" />
                        <span>Học phí:</span>
                        <span>{enrollment.tong_tien || 'Not set'}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-0">
                    <ViewEvaluationsButton 
                      enrollmentId={enrollment.id}
                      entityType="enrollment"
                      title={`Đánh giá cho ${enrollment.ten_hoc_sinh || 'học sinh'}`}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassDetail;
