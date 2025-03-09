
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { teachingSessionService, classService, employeeService } from "@/lib/supabase";
import { TeachingSession, Class, Employee } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import DetailPanel from "@/components/ui/DetailPanel";
import SessionDetail from "./SessionDetail";
import SessionForm from "./SessionForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const TeachingSessions = () => {
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [classes, setClasses] = useState<Record<string, Class>>({});
  const [teachers, setTeachers] = useState<Record<string, Employee>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<TeachingSession | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch sessions and classes in parallel
      const [sessionsData, classesArray, teachersData] = await Promise.all([
        teachingSessionService.getAll(),
        classService.getAll(),
        employeeService.getByRole("Giáo viên")
      ]);
      
      console.log("Fetched classes:", classesArray);
      console.log("Fetched sessions:", sessionsData);
      
      // Convert classes array to a lookup dictionary with proper type handling
      const classesDict = (classesArray || []).reduce((acc, cls) => {
        if (cls) {
          // Ensure required fields are present
          const completeClass = {
            ...cls,
            id: cls.id || crypto.randomUUID(),
            ten_lop_full: cls.ten_lop_full || cls.Ten_lop_full || '',
            Ten_lop_full: cls.Ten_lop_full || cls.ten_lop_full || '',
            ten_lop: cls.ten_lop || '',
            ct_hoc: cls.ct_hoc || '',
            co_so: cls.co_so || '',
            gv_chinh: cls.gv_chinh || cls.GV_chinh || '',
            GV_chinh: cls.GV_chinh || cls.gv_chinh || '',
            tinh_trang: cls.tinh_trang || 'pending'
          } as Class;
          
          acc[cls.id] = completeClass;
        }
        return acc;
      }, {} as Record<string, Class>);
      
      // Convert teachers array to a lookup dictionary
      const teachersDict = teachersData.reduce((acc, teacher) => {
        if (teacher) acc[teacher.id] = teacher;
        return acc;
      }, {} as Record<string, Employee>);
      
      setSessions(sessionsData);
      setClasses(classesDict);
      setTeachers(teachersDict);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu buổi học",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (session: TeachingSession) => {
    setSelectedSession(session);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const handleAddSession = () => {
    setShowAddForm(true);
  };

  const handleSessionSubmit = async (sessionData: Partial<TeachingSession>) => {
    try {
      setIsLoading(true);
      console.log("Submitting session data:", sessionData);
      
      await teachingSessionService.create(sessionData);
      
      toast({
        title: "Thành công",
        description: "Đã thêm buổi học mới vào hệ thống",
      });
      
      setShowAddForm(false);
      fetchData(); // Refresh the list after adding a new session
    } catch (error) {
      console.error("Error adding session:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm buổi học mới: " + (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
  };

  const columns = [
    {
      title: "Lớp",
      key: "lop_chi_tiet_id",
      sortable: true,
      render: (value: string) => <span>{classes[value]?.Ten_lop_full || classes[value]?.ten_lop_full || value}</span>,
    },
    {
      title: "Buổi học số",
      key: "session_id",
      sortable: true,
    },
    {
      title: "Ngày học",
      key: "ngay_hoc",
      sortable: true,
      render: (value: string) => <span>{formatDate(value)}</span>,
    },
    {
      title: "Thời gian",
      key: "thoi_gian_bat_dau",
      render: (value: string, record: TeachingSession) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {value?.substring(0, 5) || ""} - {record.thoi_gian_ket_thuc?.substring(0, 5) || ""}
        </div>
      ),
    },
    {
      title: "Giáo viên",
      key: "giao_vien",
      sortable: true,
      render: (value: string) => <span>{teachers[value]?.ten_nhan_su || value}</span>,
    },
    {
      title: "Đánh giá TB",
      key: "trung_binh",
      sortable: true,
      render: (value: number) => <span>{value?.toFixed(1) || "N/A"}</span>,
    },
    {
      title: "Loại bài học",
      key: "Loai_bai_hoc",
      sortable: true,
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddSession}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Buổi Học
      </Button>
    </div>
  );

  return (
    <TablePageLayout
      title="Buổi Học"
      description="Quản lý thông tin buổi dạy trong hệ thống"
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

      {selectedSession && (
        <DetailPanel
          title="Thông Tin Buổi Học"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <SessionDetail 
            session={selectedSession} 
            class={classes[selectedSession.lop_chi_tiet_id]} 
            teacher={teachers[selectedSession.giao_vien]}
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
            onSubmit={handleSessionSubmit} 
            onCancel={handleCancelForm}
          />
        </DialogContent>
      </Dialog>
    </TablePageLayout>
  );
};

export default TeachingSessions;
