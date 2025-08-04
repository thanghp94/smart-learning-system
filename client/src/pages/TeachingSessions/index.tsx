
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import TablePageLayout from '@/components/common/TablePageLayout';
import DataTable from '@/components/ui/data-table';
import { teachingSessionService } from '@/lib/database';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PlaceholderPage from '@/components/common/PlaceholderPage';
import DetailPanel from '@/components/ui/DetailPanel';
import { Button } from '@/components/ui/button';
import { EnhancedTeachingSession } from './types';
import { sessionService } from './TeachingSessionService';
import SessionActionBar from './components/SessionActionBar';
import SessionDetail from './components/SessionDetail';
import SessionForm from './components/SessionForm';
import AttendanceDialog from './components/AttendanceDialog';
import { getTableColumns } from './components/SessionTableColumns';

const TeachingSessions = () => {
  const [sessions, setSessions] = useState<EnhancedTeachingSession[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [lessonSessions, setLessonSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<EnhancedTeachingSession | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [showConfirmTimeDialog, setShowConfirmTimeDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await sessionService.fetchAllData();
      
      setSessions(data.sessions);
      setClasses(data.classes);
      setLessonSessions(data.lessonSessions);
    } catch (error) {
      console.error("Error fetching teaching sessions:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách buổi học",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    setSelectedDate(newDate);
  };

  const handleRowClick = (session: EnhancedTeachingSession) => {
    setSelectedSession(session);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const handleAddClick = () => {
    console.log("Opening add session form");
    setShowAddForm(true);
  };

  const handleAddFormCancel = () => {
    setShowAddForm(false);
  };

  const handleAddFormSubmit = async (formData: Partial<EnhancedTeachingSession>) => {
    try {
      console.log("Submitting form data:", formData);
      await teachingSessionService.create(formData);
      toast({
        title: "Thành công",
        description: "Thêm buổi học mới thành công",
      });
      setShowAddForm(false);
      fetchData();
    } catch (error) {
      console.error("Error adding teaching session:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm buổi học mới",
        variant: "destructive"
      });
    }
  };

  const handleSessionUpdate = async (updatedData: Partial<EnhancedTeachingSession>) => {
    if (!selectedSession) return;
    
    try {
      await teachingSessionService.update(selectedSession.id, updatedData);
      toast({
        title: "Thành công",
        description: "Cập nhật buổi học thành công",
      });
      fetchData();
    } catch (error) {
      console.error("Error updating session:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật buổi học",
        variant: "destructive"
      });
    }
  };

  const handleAttendance = (session: EnhancedTeachingSession) => {
    setSelectedSession(session);
    setShowAttendanceDialog(true);
  };

  const handleAddEvaluation = (session: EnhancedTeachingSession) => {
    setSelectedSession(session);
    setShowEvaluationForm(true);
  };

  const handleConfirmTime = (session: EnhancedTeachingSession) => {
    setSelectedSession(session);
    setShowConfirmTimeDialog(true);
  };

  const getLessonName = (sessionId: string) => {
    return sessionService.getLessonName(sessionId, lessonSessions);
  };

  const columns = getTableColumns(
    handleAttendance,
    handleAddEvaluation,
    handleConfirmTime,
    getLessonName
  );

  const handleToggleAttendanceDialog = () => {
    setShowAttendanceDialog(!showAttendanceDialog);
  };

  if (sessions.length === 0 && !isLoading) {
    return (
      <PlaceholderPage
        title="Buổi Học"
        description="Quản lý thông tin buổi học"
        addButtonAction={handleAddClick}
      />
    );
  }

  return (
    <>
      <TablePageLayout
        title="Buổi Học"
        description="Quản lý thông tin buổi học"
        actions={
          <SessionActionBar 
            onAddClick={handleAddClick}
            onRefresh={fetchData}
            sessions={sessions}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        }
      >
        <DataTable
          columns={columns}
          data={sessions}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          searchable={true}
          searchPlaceholder="Tìm kiếm buổi học..."
        />
      </TablePageLayout>

      {selectedSession && (
        <DetailPanel
          title="Thông Tin Buổi Học"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <SessionDetail 
            sessionId={selectedSession.id} 
            onSave={handleSessionUpdate}
          />
        </DetailPanel>
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Buổi Học Mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin buổi học mới vào biểu mẫu bên dưới
            </DialogDescription>
          </DialogHeader>
          <SessionForm 
            onSubmit={handleAddFormSubmit}
            onCancel={handleAddFormCancel}
          />
        </DialogContent>
      </Dialog>

      {showAttendanceDialog && selectedSession && (
        <AttendanceDialog
          open={showAttendanceDialog}
          onClose={handleToggleAttendanceDialog}
          sessionId={selectedSession.id}
          classId={selectedSession.lop_chi_tiet_id || ''}
        />
      )}

      <Dialog open={showEvaluationForm} onOpenChange={setShowEvaluationForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Đánh Giá Giáo Viên</DialogTitle>
            <DialogDescription>
              Đánh giá giáo viên cho buổi học {selectedSession?.buoi_hoc_so || selectedSession?.session_id}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <p className="text-center text-muted-foreground py-4">
              Chức năng đánh giá giáo viên đang được phát triển
            </p>
            <div className="flex justify-end">
              <Button 
                onClick={() => setShowEvaluationForm(false)}
              >
                Đóng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmTimeDialog} onOpenChange={setShowConfirmTimeDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Xác Nhận Thời Gian</DialogTitle>
            <DialogDescription>
              Xác nhận thời gian thực tế của buổi học
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Thời gian bắt đầu thực tế</label>
                <input 
                  type="time"
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  defaultValue={selectedSession?.thoi_gian_bat_dau?.substring(0, 5)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Thời gian kết thúc thực tế</label>
                <input 
                  type="time"
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  defaultValue={selectedSession?.thoi_gian_ket_thuc?.substring(0, 5)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ghi chú</label>
              <textarea 
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-[80px]"
                placeholder="Ghi chú về thời gian (nếu có)"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                variant="outline"
                onClick={() => setShowConfirmTimeDialog(false)}
              >
                Hủy
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Thành công",
                  description: "Đã xác nhận thời gian buổi học",
                });
                setShowConfirmTimeDialog(false);
              }}>
                Xác nhận
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeachingSessions;
