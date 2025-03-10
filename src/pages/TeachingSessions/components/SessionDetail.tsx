import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase/client';
import { TeachingSession } from '@/lib/types';
import ImageUploadForm from './ImageUploadForm';
import AssignmentForm from './AssignmentForm';
import SessionHeader from './SessionHeader';
import {
  OverviewTab,
  MaterialsTab,
  HomeworkTab,
  AttendanceTab,
  StudentsTab,
  TeacherTab
} from './SessionTabs';

interface StudentData {
  id?: string;
  ten_hoc_sinh?: string;
  hinh_anh_hoc_sinh?: string | null;
  ma_hoc_sinh?: string;
}

interface EnrollmentWithStudent {
  id: string;
  hoc_sinh_id: string;
  students?: StudentData;
}

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

      if (currentSession.lop_chi_tiet_id) {
        const { data: classInfo, error: classError } = await supabase
          .from('classes')
          .select('*')
          .eq('id', currentSession.lop_chi_tiet_id)
          .single();
        
        if (!classError && classInfo) {
          setClassData(classInfo);
        }

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
          const students = (enrollmentsData as EnrollmentWithStudent[]).map(enrollment => {
            const studentData = enrollment.students || {} as StudentData;
            return {
              id: studentData.id || enrollment.hoc_sinh_id,
              name: studentData.ten_hoc_sinh || 'Unknown',
              image: studentData.hinh_anh_hoc_sinh || null,
              code: studentData.ma_hoc_sinh || 'N/A'
            };
          });
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

  const handleImageUploadComplete = async (imageId: string, imagePath: string) => {
    setIsImageDialogOpen(false);
    toast({
      title: 'Tải ảnh thành công',
      description: 'Hình ảnh đã được thêm vào buổi học',
    });
    fetchSessionData();
  };

  const handleAssignmentAdded = async () => {
    setIsAssignmentDialogOpen(false);
    toast({
      title: 'Thành công',
      description: 'Đã thêm bài tập mới',
    });
    fetchSessionData();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <SessionHeader sessionData={sessionData} classData={classData} />

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
          <OverviewTab 
            sessionData={sessionData}
            notes={notes}
            editingNotes={editingNotes}
            isSaving={isSaving}
            setNotes={setNotes}
            setEditingNotes={setEditingNotes}
            handleSaveNotes={handleSaveNotes}
          />
        </TabsContent>

        <TabsContent value="materials">
          <MaterialsTab setIsImageDialogOpen={setIsImageDialogOpen} />
        </TabsContent>

        <TabsContent value="homework">
          <HomeworkTab 
            sessionId={sessionData?.id || id} 
            setIsAssignmentDialogOpen={setIsAssignmentDialogOpen}
          />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceTab />
        </TabsContent>

        <TabsContent value="students">
          <StudentsTab students={studentsList} />
        </TabsContent>

        <TabsContent value="teacher">
          <TeacherTab 
            teacher={teacher} 
            classData={classData}
            studentCount={studentsList.length}
          />
        </TabsContent>
      </Tabs>

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
