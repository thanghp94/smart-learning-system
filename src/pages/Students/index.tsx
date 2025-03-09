
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { Student } from "@/lib/types";
import { studentService } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import DetailPanel from "@/components/ui/DetailPanel";
import { Link, useNavigate } from "react-router-dom";
import StudentDetail from "./StudentDetail";
import { formatDate } from "@/lib/utils";

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await studentService.getAll();
      console.log("Students data received:", data);
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Could not load students data",
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
    navigate("/students/add");
  };

  const columns = [
    {
      title: "Tên Học Sinh",
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
      render: (value: string) => value ? formatDate(value) : "",
    },
    {
      title: "Chương Trình Học",
      key: "ct_hoc",
    },
    {
      title: "Tên Phụ Huynh",
      key: "ten_ph",
    },
    {
      title: "Số ĐT Phụ Huynh",
      key: "sdt_ph1",
    },
    {
      title: "Trạng Thái",
      key: "trang_thai",
      render: (value: string) => (
        <Badge variant={value === "active" ? "success" : "destructive"}>
          {value === "active" ? "Đang Học" : "Đã Nghỉ"}
        </Badge>
      ),
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
      <Button size="sm" className="h-8" onClick={handleAddClick}>
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
