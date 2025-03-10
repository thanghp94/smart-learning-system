
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { Loader2 } from "lucide-react";
import { Student } from "@/lib/types";
import { studentService } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import StudentsList from "./Students/components/StudentsList";
import StudentFormContainer from "./Students/components/StudentFormContainer";

interface StudentsProps {
  add?: boolean;
  edit?: boolean;
}

const Students: React.FC<StudentsProps> = ({ add = false, edit = false }) => {
  const { id } = useParams<{ id: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!add && !edit) {
      fetchStudents();
    }
  }, [add, edit]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await studentService.getAll();
      console.log("Students data received:", data);
      
      if (Array.isArray(data)) {
        // Ensure we have proper Student objects with all required fields
        const studentsWithRequiredFields = data.map(student => ({
          ...student,
          id: student.id || crypto.randomUUID(),
          ten_hoc_sinh: student.ten_hoc_sinh || '',
          co_so_id: student.co_so_id || '',
          trang_thai: student.trang_thai || 'active'
        })) as Student[];
        
        setStudents(studentsWithRequiredFields);
      } else {
        console.error("Invalid students data format:", data);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách học sinh. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = () => {
    navigate("/students/add");
  };

  // Show form for add/edit
  if (add) {
    return <StudentFormContainer isAdd={true} />;
  }
  
  if (edit && id) {
    return <StudentFormContainer studentId={id} />;
  }

  return (
    <>
      <PageHeader
        title="Học sinh"
        description="Quản lý danh sách học sinh trong hệ thống."
        action={{
          label: "Thêm học sinh",
          onClick: handleAddStudent
        }}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <StudentsList 
          data={students} 
          isLoading={isLoading}
          onRefresh={fetchStudents}
          onAddStudent={handleAddStudent}
        />
      )}
    </>
  );
};

export default Students;
