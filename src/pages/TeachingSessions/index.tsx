import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, FileDown, Filter, RotateCw, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { teachingSessionService, classService, employeeService } from "@/lib/supabase";
import { TeachingSession, ClassDetail, Employee } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import TeachingSessionForm from "./TeachingSessionForm";
import { formatDate } from "@/lib/utils";

const TeachingSessions = () => {
  const [teachingSessions, setTeachingSessions] = useState<TeachingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [classes, setClasses] = useState<ClassDetail[]>([]);
  const [teachers, setTeachers] = useState<Employee[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    fetchTeachingSessions();
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchTeachingSessions = async () => {
    try {
      setIsLoading(true);
      const data = await teachingSessionService.getAll();
      setTeachingSessions(data);
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

  const fetchClasses = async () => {
    try {
      const data = await classService.getAll();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách lớp học",
        variant: "destructive"
      });
    }
  };

  const fetchTeachers = async () => {
    try {
      const data = await employeeService.getAll();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách giáo viên",
        variant: "destructive"
      });
    }
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
      fetchTeachingSessions();
    } catch (error) {
      console.error("Error adding teaching session:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm buổi học mới: " + (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const handleRowClick = (evaluation: TeachingSession) => {
    navigate(`/teaching-sessions/${evaluation.id}`);
  };

  const getClassName = (classId: string) => {
    const classDetail = classes.find(c => c.id === classId);
    return classDetail ? classDetail.ten_lop : 'Không xác định';
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.ten_nhan_su : 'Không xác định';
  };

  const columns = [
    {
      title: "Lớp",
      key: "lop_chi_tiet_id",
      render: (value: string) => getClassName(value),
      sortable: true,
    },
    {
      title: "Giáo viên",
      key: "giao_vien",
      render: (value: string) => getTeacherName(value),
      sortable: true,
    },
    {
      title: "Ngày học",
      key: "ngay_hoc",
      render: (value: string) => formatDate(value),
      sortable: true,
    },
    {
      title: "Loại bài học",
      key: "loai_bai_hoc",
    },
    {
      title: "Điểm trung bình",
      key: "trung_binh",
      render: (value: number) => value ? value.toFixed(1) : 'N/A',
      sortable: true,
    }
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchTeachingSessions}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm buổi học
      </Button>
    </div>
  );

  return (
    <>
      <TablePageLayout
        title="Buổi Học"
        description="Quản lý thông tin các buổi học"
        actions={tableActions}
      >
        <DataTable
          columns={columns}
          data={teachingSessions}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          searchable={true}
          searchPlaceholder="Tìm kiếm buổi học..."
        />
      </TablePageLayout>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Buổi Học Mới</DialogTitle>
            <DialogDescription>
              Điền thông tin buổi học mới và nhấn lưu để tạo buổi học.
            </DialogDescription>
          </DialogHeader>
          <TeachingSessionForm
            onSubmit={handleAddFormSubmit}
            onCancel={handleAddFormCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeachingSessions;
