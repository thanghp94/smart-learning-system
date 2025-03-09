
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { studentService } from "@/lib/supabase";
import { Student } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import DetailPanel from "@/components/ui/DetailPanel";
import StudentDetail from "./StudentDetail";

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const { toast } = useToast();

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

  const columns = [
    {
      title: "Tên Học Sinh",
      key: "ten_hoc_sinh",
      sortable: true,
    },
    {
      title: "Phụ Huynh",
      key: "ten_PH",
      sortable: true,
    },
    {
      title: "SĐT",
      key: "sdt_ph1",
    },
    {
      title: "Email",
      key: "email_ph1",
    },
    {
      title: "Chương Trình",
      key: "ct_hoc",
      sortable: true,
    },
    {
      title: "Trạng Thái",
      key: "trang_thai",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "active" ? "success" : "secondary"}>
          {value === "active" ? "Đang học" : value}
        </Badge>
      ),
    },
    {
      title: "Ngày Sinh",
      key: "ngay_sinh",
      sortable: true,
      render: (value: string) => formatDate(value),
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
      <Button size="sm" className="h-8">
        <Plus className="h-4 w-4 mr-1" /> Thêm Học Sinh
      </Button>
    </div>
  );

  return (
    <TablePageLayout
      title="Học Sinh"
      description="Quản lý thông tin học sinh trong hệ thống"
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

      {selectedStudent && (
        <DetailPanel
          title="Thông Tin Học Sinh"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <StudentDetail student={selectedStudent} />
        </DetailPanel>
      )}
    </TablePageLayout>
  );
};

export default Students;
