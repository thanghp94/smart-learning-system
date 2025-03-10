
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TeachingSession } from '@/lib/types';
import ImageUploadForm from './ImageUploadForm';
import AssignmentForm from './AssignmentForm';
import SessionHeader from './SessionHeader';
import { useSessionData } from '../hooks/useSessionData';
import {
  OverviewTab,
  MaterialsTab,
  HomeworkTab,
  AttendanceTab,
  StudentsTab,
  TeacherTab
} from './SessionTabs';

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

  const {
    sessionData,
    teacher,
    classData,
    studentsList,
    isLoading,
    setSessionData,
    fetchSessionData
  } = useSessionData(session, sessionId);

  const { toast } = useToast();

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
            sessionId={sessionData?.id || sessionId} 
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
            sessionId={sessionData?.id || sessionId}
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
            sessionId={sessionData?.id || sessionId}
            onSuccess={handleAssignmentAdded}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionDetail;
