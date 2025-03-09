
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/ui/DataTable";
import DetailPanel from "@/components/ui/DetailPanel";
import { Student, Enrollment } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";
import StudentDetail from "./StudentDetail";
import { enrollmentService } from "@/lib/supabase";

interface StudentsListProps {
  students: Student[];
  isLoading: boolean;
  onAddStudent: () => void;
}

const StudentsList: React.FC<StudentsListProps> = ({ 
  students, 
  isLoading,
  onAddStudent
}) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [studentEnrollments, setStudentEnrollments] = useState<Enrollment[]>([]);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);
  const navigate = useNavigate();

  const handleRowClick = async (student: Student) => {
    setSelectedStudent(student);
    setDetailOpen(true);
    
    // Load enrollments for this student
    try {
      setIsLoadingEnrollments(true);
      const enrollments = await enrollmentService.getByStudent(student.id);
      setStudentEnrollments(enrollments || []);
    } catch (error) {
      console.error("Error fetching student enrollments:", error);
    } finally {
      setIsLoadingEnrollments(false);
    }
  };

  const handleEditStudent = () => {
    if (selectedStudent) {
      navigate(`/students/edit/${selectedStudent.id}`);
    }
  };
  
  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedStudent(null);
    setStudentEnrollments([]);
  };

  const columns = [
    {
      title: "Học sinh",
      key: "ten_hoc_sinh",
      render: (value: string, record: Student) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={record.hinh_anh_hoc_sinh} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {value.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-muted-foreground">ID: {record.id}</div>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      title: "Chương trình học",
      key: "ct_hoc",
      render: (value: string) => (
        <span className="font-medium">{value || "-"}</span>
      ),
      sortable: true
    },
    {
      title: "Phụ huynh",
      key: "ten_PH",
      render: (value: string, record: Student) => (
        <div>
          <div>{value || "-"}</div>
          <div className="text-xs text-muted-foreground">{record.sdt_ph1 || "-"}</div>
        </div>
      ),
      sortable: true
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      render: (value: string) => (
        <Badge className={cn(STATUS_COLORS[value as keyof typeof STATUS_COLORS] || STATUS_COLORS.default)}>
          {value === "active" && "Đang học"}
          {value === "inactive" && "Nghỉ học"}
          {value === "pending" && "Chờ xác nhận"}
          {!value && "-"}
        </Badge>
      ),
      width: "120px",
      sortable: true
    },
    {
      title: "Hạn học phí",
      key: "han_hoc_phi",
      render: (value: string) => {
        if (!value) return <span>-</span>;
        
        const date = new Date(value);
        const now = new Date();
        const isExpired = date < now;
        
        return (
          <div className={cn(
            "text-sm font-medium",
            isExpired ? "text-red-500" : "text-green-500"
          )}>
            {new Date(value).toLocaleDateString("vi-VN")}
          </div>
        );
      },
      width: "120px",
      sortable: true
    }
  ];

  console.log("Students data in StudentsList:", students);

  return (
    <>
      <DataTable
        data={students}
        columns={columns}
        onRowClick={handleRowClick}
        searchPlaceholder="Tìm học sinh theo tên, ID..."
        isLoading={isLoading}
      />
      
      {selectedStudent && (
        <DetailPanel
          title="Thông tin học sinh"
          isOpen={detailOpen}
          onClose={handleCloseDetail}
          footerContent={
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={handleEditStudent}>Sửa thông tin</Button>
              <Button onClick={() => navigate("/enrollments")}>Quản lý ghi danh</Button>
            </div>
          }
        >
          {isLoadingEnrollments ? (
            <div className="flex justify-center p-4">
              <span className="animate-spin">Loading...</span>
            </div>
          ) : (
            <StudentDetail 
              student={selectedStudent} 
              enrollments={studentEnrollments} 
            />
          )}
        </DetailPanel>
      )}
    </>
  );
};

export default StudentsList;
