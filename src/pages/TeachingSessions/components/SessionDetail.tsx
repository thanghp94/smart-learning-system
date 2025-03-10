import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { TeachingSession } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Save, PlusCircle, FileText, Camera, UserRound, GraduationCap, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageUploadForm from './ImageUploadForm';
import AssignmentForm from './AssignmentForm';
import AssignmentList from './AssignmentList';
import { supabase } from '@/lib/supabase/client';
import { Link } from 'react-router-dom';

export interface SessionDetailProps {
  session?: any;
  sessionId?: string;
  onSave: (updatedSession: Partial<TeachingSession>) => Promise<void>;
}

const SessionDetail: React.FC<SessionDetailProps> = ({ session, sessionId, onSave }) => {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(session?.ghi_chu || '');
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionData, setSessionData] = useState<any>(session || {});
  const [teacher, setTeacher] = useState<any>(null);
  const [classData, setClassData] = useState<any>(null);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const id = session?.id || sessionId;

  useEffect(() => {
    if (id) {
      fetchSessionData();
    }
  }, [id]);

  const fetchSessionData = async () => {
    setIsLoading(true);
    try {
      // If we already have session data, use it, otherwise fetch it
      let currentSession = sessionData;
      if (!currentSession.id) {
        const { data, error } = await supabase
          .from('teaching_sessions')
          .select(`
            *,
            classes:lop_chi_tiet_id (
              id,
              ten_lop_full,
              ten_lop,
              co_so,
              gv_chinh
            )
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        currentSession = data;
        setSessionData(data);
      }

      // Fetch teacher info if we have giao_vien
      if (currentSession.giao_vien) {
        const { data: teacherData, error: teacherError } = await supabase
          .from('employees')
          .select('*')
          .eq('id', currentSession.giao_vien)
          .single();
        
        if (!teacherError && teacherData) {
          setTeacher(teacherData);
        }
      }

      // Fetch class info if we have lop_chi_tiet_id
      if (currentSession.lop_chi_tiet_id) {
        const { data: classInfo, error: classError } = await supabase
          .from('classes')
          .select('*')
          .eq('id', currentSession.lop_chi_tiet_id)
          .single();
        
        if (!classError && classInfo) {
          setClassData(classInfo);
        }

        // Fetch students enrolled in this class
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
            id,
            hoc_sinh_id,
            students:hoc_sinh_id (
              id,
              ten_hoc_sinh,
              hinh_anh_hoc_sinh,
              ma_hoc_sinh
            )
          `)
          .eq('lop_chi_tiet_id', currentSession.lop_chi_tiet_id);
        
        if (!enrollmentsError && enrollmentsData) {
          // Fix type issues by correctly mapping the data
          const students = enrollmentsData.map(e => ({
            id: e.hoc_sinh_id,
            name: e.students ? e.students.ten_hoc_sinh : 'Unknown',
            image: e.students ? e.students.hinh_anh_hoc_sinh : null,
            code: e.students ? e.students.ma_hoc_sinh : 'N/A'
          }));
          setStudentsList(students);
        }
      }

      setNotes(currentSession.ghi_chu || '');
    } catch (error) {
      console.error('Error fetching session details:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin buổi học. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      await onSave({ ghi_chu: notes });
      setEditingNotes(false);
      toast({
        title: 'Thành công',
        description: 'Đã lưu ghi chú buổi học',
      });
      // Update local session data
      setSessionData(prev => ({ ...prev, ghi_chu: notes }));
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu ghi chú. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline">Đã lên lịch</Badge>;
      case 'completed':
        return <Badge variant="success">Đã hoàn thành</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Đã hủy</Badge>;
      case 'in_progress':
        return <Badge variant="default">Đang diễn ra</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleImageUploadComplete = async (imageId: string, imagePath: string) => {
    setIsImageDialogOpen(false);
    toast({
      title: 'Tải ảnh thành công',
      description: 'Hình ảnh đã được thêm vào buổi học',
    });
    // Refresh the session data
    fetchSessionData();
  };

  const handleAssignmentAdded = async () => {
    setIsAssignmentDialogOpen(false);
    toast({
      title: 'Thành công',
      description: 'Đã thêm bài tập mới',
    });
    // Refresh the session data
    fetchSessionData();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Buổi {sessionData?.buoi_so || sessionData?.session_number || '?'} - {classData?.ten_lop_full || 'Unnamed Class'}
          </h2>
          {formatStatus(sessionData?.trang_thai || sessionData?.status || 'unknown')}
        </div>
        <div className="text-muted-foreground">
          {sessionData?.ngay_hoc && format(new Date(sessionData?.ngay_hoc), 'dd/MM/yyyy')} | 
          {sessionData?.thoi_gian_bat_dau || sessionData?.start_time || '?'} - 
          {sessionData?.thoi_gian_ket_thuc || sessionData?.end_time || '?'}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="materials">Tài liệu</TabsTrigger>
          <TabsTrigger value="homework">Bài tập</TabsTrigger>
          <TabsTrigger value="attendance">Điểm danh</TabsTrigger>
          <TabsTrigger value="students">Học sinh</TabsTrigger>
          <TabsTrigger value="teacher">Giáo viên</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 grid-cols-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Nội dung buổi học</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {sessionData?.noi_dung || sessionData?.content || 'Chưa có nội dung cho buổi học này.'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ghi chú</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => editingNotes ? handleSaveNotes() : setEditingNotes(true)}
                  disabled={isSaving}
                >
                  {editingNotes ? (
                    <Save className="h-4 w-4 mr-1" />
                  ) : (
                    <Edit2 className="h-4 w-4 mr-1" />
                  )}
                  {editingNotes ? 'Lưu' : 'Sửa'}
                </Button>
              </CardHeader>
              <CardContent>
                {editingNotes ? (
                  <div className="space-y-4">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Nhập ghi chú về buổi học..."
                      rows={5}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setNotes(sessionData?.ghi_chu || '');
                          setEditingNotes(false);
                        }}
                        disabled={isSaving}
                      >
                        Hủy
                      </Button>
                      <Button 
                        onClick={handleSaveNotes}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Đang lưu...' : 'Lưu ghi chú'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    {notes || 'Chưa có ghi chú nào.'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Hình ảnh & Tài liệu</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setIsImageDialogOpen(true)}>
                  <Camera className="h-4 w-4 mr-1" /> Thêm hình ảnh
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" /> Thêm tài liệu
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Images would be displayed here */}
                <div className="flex items-center justify-center h-40 border rounded bg-gray-50 text-gray-400">
                  Chưa có hình ảnh
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homework">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Bài tập</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsAssignmentDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-1" /> Thêm bài tập
              </Button>
            </CardHeader>
            <CardContent>
              <AssignmentList sessionId={sessionData?.id || id} />
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
                Dữ liệu điểm danh sẽ hiển thị ở đây
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách học sinh</CardTitle>
            </CardHeader>
            <CardContent>
              {studentsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studentsList.map(student => (
                    <div key={student.id} className="flex items-center p-3 border rounded-md">
                      <div className="flex-shrink-0 mr-3">
                        {student.image ? (
                          <img 
                            src={student.image} 
                            alt={student.name} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-slate-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <Link to={`/students/${student.id}`} className="text-sm font-medium hover:underline">
                          {student.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">Mã: {student.code}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  Chưa có học sinh nào trong lớp này.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teacher">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giáo viên</CardTitle>
            </CardHeader>
            <CardContent>
              {teacher ? (
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {teacher.hinh_anh ? (
                      <img 
                        src={teacher.hinh_anh} 
                        alt={teacher.ten_nhan_su} 
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-slate-200 flex items-center justify-center">
                        <UserRound className="h-10 w-10 text-slate-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">
                      <Link to={`/employees/${teacher.id}`} className="hover:underline">
                        {teacher.ten_nhan_su}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">{teacher.chuc_danh || 'Giáo viên'}</p>
                    <p className="text-sm mt-2">Email: {teacher.email || 'N/A'}</p>
                    <p className="text-sm">Điện thoại: {teacher.dien_thoai || 'N/A'}</p>
                    <div className="mt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.location.href = `/employees/${teacher.id}`}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  Không tìm thấy thông tin giáo viên.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Thông tin lớp học</CardTitle>
            </CardHeader>
            <CardContent>
              {classData ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Tên lớp:</span>
                    <Link to={`/classes/${classData.id}`} className="hover:underline">
                      {classData.ten_lop_full}
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Chương trình học:</span>
                    <span>{classData.ct_hoc || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ngày bắt đầu:</span>
                    <span>{classData.ngay_bat_dau ? format(new Date(classData.ngay_bat_dau), 'dd/MM/yyyy') : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Số học sinh:</span>
                    <span>{studentsList.length}</span>
                  </div>
                  <div className="mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.location.href = `/classes/${classData.id}`}
                    >
                      <BookOpen className="h-4 w-4 mr-1" /> Xem chi tiết lớp học
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  Không tìm thấy thông tin lớp học.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image Upload Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tải lên hình ảnh</DialogTitle>
          </DialogHeader>
          <ImageUploadForm 
            sessionId={sessionData?.id || id}
            onUploadComplete={handleImageUploadComplete}
          />
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm bài tập mới</DialogTitle>
          </DialogHeader>
          <AssignmentForm 
            sessionId={sessionData?.id || id}
            onSuccess={handleAssignmentAdded}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionDetail;
