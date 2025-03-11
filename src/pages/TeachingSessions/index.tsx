import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Filter, RotateCw, UserCheck, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { TeachingSession } from '@/lib/types';
import { teachingSessionService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import DataTable from '@/components/ui/DataTable';
import TablePageLayout from '@/components/common/TablePageLayout';
import DetailPanel from '@/components/ui/DetailPanel';
import SessionDetail from './components/SessionDetail';
import SessionForm from './SessionForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PlaceholderPage from '@/components/common/PlaceholderPage';
import ExportButton from '@/components/ui/ExportButton';
import AttendanceDialog from './components/AttendanceDialog';

const TeachingSessions = () => {
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<TeachingSession | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [showConfirmTimeDialog, setShowConfirmTimeDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const data = await teachingSessionService.getAll();
      setSessions(data);
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

  const handleRowClick = (session: TeachingSession) => {
    setSelectedSession(session);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddFormCancel = () => {
    setShowAddForm(false);
  };

  const handleAddFormSubmit = async (formData: Partial<TeachingSession>) => {
    try {
      await teachingSessionService.create(formData);
      toast({
        title: "Thành công",
        description: "Thêm buổi học mới thành công",
      });
      setShowAddForm(false);
      fetchSessions();
    } catch (error) {
      console.error("Error adding teaching session:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm buổi học mới",
        variant: "destructive"
      });
    }
  };

  const handleSessionUpdate = async (updatedData: Partial<TeachingSession>) => {
    if (!selectedSession) return;
    
    try {
      await teachingSessionService.update(selectedSession.id, updatedData);
      toast({
        title: "Thành công",
        description: "Cập nhật buổi học thành công",
      });
      fetchSessions();
    } catch (error) {
      console.error("Error updating session:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật buổi học",
        variant: "destructive"
      });
    }
  };

  const handleAddAttendance = (session: TeachingSession) => {
    setSelectedSession(session);
    setShowAttendanceDialog(true);
  };

  const handleAddEvaluation = (session: TeachingSession) => {
    setSelectedSession(session);
    setShowEvaluationForm(true);
  };

  const handleConfirmTime = (session: TeachingSession) => {
    setSelectedSession(session);
    setShowConfirmTimeDialog(true);
  };

  const formatSessionDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (e) {
      return dateString;
    }
  };

  const formatSessionTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Format HH:MM
  };

  const renderSessionActions = (session: TeachingSession) => {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleAddAttendance(session);
          }}
          title="Thêm điểm danh"
        >
          <UserCheck className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleAddEvaluation(session);
          }}
          title="Đánh giá giáo viên"
        >
          <Star className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleConfirmTime(session);
          }}
          title="Xác nhận thời gian"
        >
          <Clock className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const columns = [
    {
      title: "Lớp",
      key: "class_name",
      sortable: true,
      render: (_: string, record: TeachingSession) => (
        <div className="font-medium">{record.class_name || "N/A"}</div>
      ),
    },
    {
      title: "Ngày học",
      key: "ngay_hoc",
      sortable: true,
      render: (value: string) => formatSessionDate(value),
    },
    {
      title: "Thời gian",
      key: "thoi_gian_bat_dau",
      render: (value: string, record: TeachingSession) => (
        <span>
          {formatSessionTime(value)} - {formatSessionTime(record.thoi_gian_ket_thuc)}
        </span>
      ),
    },
    {
      title: "Giáo viên",
      key: "teacher_name",
      render: (value: string) => value || "N/A",
    },
    {
      title: "Buổi học số",
      key: "session_id",
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      title: "Loại bài học",
      key: "loai_bai_hoc",
      render: (value: string) => value || "Học mới",
    },
    {
      title: "Trạng thái",
      key: "completed",
      render: (value: string) => (
        <Badge variant={value === "true" ? "success" : "secondary"}>
          {value === "true" ? "Hoàn thành" : "Chưa hoàn thành"}
        </Badge>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record: TeachingSession) => renderSessionActions(record),
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <Calendar className="h-4 w-4 mr-2" />
        <input
          type="date"
          className="border rounded px-2 py-1"
          onChange={handleDateChange}
          value={selectedDate.toISOString().split('T')[0]}
        />
      </div>
      <Button variant="outline" size="sm" className="h-8" onClick={fetchSessions}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <ExportButton 
        data={sessions} 
        filename="Danh_sach_buoi_hoc" 
        label="Xuất dữ liệu"
      />
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Buổi Học
      </Button>
    </div>
  );

  const handleToggleAttendanceDialog = () => {
    setShowAttendanceDialog(!showAttendanceDialog);
  };

  return (
    <>
      {sessions.length === 0 && !isLoading ? (
        <PlaceholderPage
          title="Buổi Học"
          description="Quản lý thông tin buổi học"
          addButtonAction={handleAddClick}
        />
      ) : (
        <TablePageLayout
          title="Buổi Học"
          description="Quản lý thông tin buổi học"
          actions={tableActions}
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
      )}

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

      {showAttendanceDialog && (
        <AttendanceDialog
          open={showAttendanceDialog}
          onClose={handleToggleAttendanceDialog}
          sessionId={selectedSession.id}
          classId={selectedSession.lop_chi_tiet_id}
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
