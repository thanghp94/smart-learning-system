import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Filter, FileDown, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

const TeachingSessions = () => {
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<TeachingSession | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
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
    // TODO: Filter sessions by date
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
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Buổi Học
      </Button>
    </div>
  );

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
          <SessionDetail session={selectedSession} />
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
    </>
  );
};

export default TeachingSessions;
