
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { studentService } from "@/lib/supabase";
import { Student } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import DetailPanel from "@/components/ui/DetailPanel";
import StudentDetail from "./StudentDetail";
import StudentForm from "./StudentForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import { useDatabase } from "@/contexts/DatabaseContext";

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const { isDemoMode, initializeDatabase } = useDatabase();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách học sinh",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (student: Student) => {
    setSelectedStudent(student);
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

  const handleAddFormSubmit = async (formData: any) => {
    try {
      if (isDemoMode) {
        // Handle demo mode
        await initializeDatabase();
        toast({
          title: "Chế độ Demo",
          description: "Đã khởi tạo dữ liệu demo. Vui lòng thử lại thao tác của bạn.",
        });
        fetchStudents();
        setShowAddForm(false);
        return;
      }

      // In real mode, add the student
      const newStudent = await studentService.create(formData);
      setStudents([...students, newStudent]);
      toast({
        title: "Thành công",
        description: "Thêm học sinh mới thành công",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm học sinh mới",
        variant: "destructive"
      });
    }
  };

  const columns = [
    {
      title: "Họ và Tên",
      key: "ten_hoc_sinh",
      sortable: true,
    },
    {
      title: "Giới Tính",
      key: "gioi_tinh",
    },
    {
      title: "Ngày Sinh",
      key: "ngay_sinh",
      render: (value: string) => value ? new Date(value).toLocaleDateString('vi-VN') : "",
    },
    {
      title: "Tên Phụ Huynh",
      key: "ten_PH",
    },
    {
      title: "Số Điện Thoại",
      key: "sdt_ph1",
    },
    {
      title: "Chương Trình Học",
      key: "ct_hoc",
    },
    {
      title: "Hạn Học Phí",
      key: "han_hoc_phi",
      render: (value: string) => {
        if (!value) return "";
        const date = new Date(value);
        const today = new Date();
        const isExpired = date < today;
        
        return (
          <span className={isExpired ? "text-red-500 font-medium" : ""}>
            {date.toLocaleDateString('vi-VN')}
          </span>
        );
      },
    },
    {
      title: "Tình Trạng",
      key: "trang_thai",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "active" ? "success" : value === "inactive" ? "destructive" : "secondary"}>
          {value === "active" ? "Đang học" : value === "inactive" ? "Đã nghỉ" : "Chờ xử lý"}
        </Badge>
      ),
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchStudents}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Học Sinh
      </Button>
    </div>
  );

  return (
    <>
      {students.length === 0 && !isLoading ? (
        <PlaceholderPage
          title="Học Sinh"
          description="Quản lý thông tin học sinh"
          addButtonAction={handleAddClick}
        />
      ) : (
        <TablePageLayout
          title="Học Sinh"
          description="Quản lý thông tin học sinh"
          actions={tableActions}
        >
          <DataTable
            columns={columns}
            data={students}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            searchable={true}
            searchPlaceholder="Tìm kiếm học sinh..."
          />
        </TablePageLayout>
      )}

      {selectedStudent && (
        <DetailPanel
          title="Thông Tin Học Sinh"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <StudentDetail student={selectedStudent} />
        </DetailPanel>
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Học Sinh Mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin học sinh mới vào mẫu dưới đây
            </DialogDescription>
          </DialogHeader>
          <StudentForm
            onSubmit={handleAddFormSubmit}
            onCancel={handleAddFormCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Students;
