
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Student } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import StudentForm from "../StudentForm";
import PageHeader from "@/components/common/PageHeader";
import { studentService } from "@/lib/supabase";

interface StudentFormContainerProps {
  studentId?: string;
  isAdd?: boolean;
}

const StudentFormContainer: React.FC<StudentFormContainerProps> = ({ 
  studentId, 
  isAdd = false 
}) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (studentId) {
      fetchStudentById(studentId);
    }
  }, [studentId]);

  const fetchStudentById = async (id: string) => {
    try {
      setIsLoading(true);
      const data = await studentService.getById(id);
      
      if (data) {
        // Normalize co_so_ID/co_so_id to have consistent data
        const normalizedData = {
          ...data as Student,
          co_so_id: data.co_so_ID || data.co_so_id,
          co_so_ID: data.co_so_ID || data.co_so_id,
          id: data.id || id
        };
        
        setStudent(normalizedData);
      } else {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy thông tin học sinh.",
          variant: "destructive",
        });
        navigate("/students");
      }
    } catch (error) {
      console.error("Error fetching student:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin học sinh.",
        variant: "destructive",
      });
      navigate("/students");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      console.log("Submitting student data:", data);
      
      // Making sure we use the correct field name for the facility ID
      // Ensure both co_so_id and co_so_ID are present for compatibility
      if (data.co_so_id) {
        data.co_so_ID = data.co_so_id;
      } else if (data.co_so_ID) {
        data.co_so_id = data.co_so_ID;
      }
      
      // Ensure all date fields are properly formatted for Supabase
      if (data.ngay_sinh && data.ngay_sinh instanceof Date) {
        data.ngay_sinh = data.ngay_sinh.toISOString().split('T')[0];
      }
      
      if (data.han_hoc_phi && data.han_hoc_phi instanceof Date) {
        data.han_hoc_phi = data.han_hoc_phi.toISOString().split('T')[0];
      }
      
      if (data.ngay_bat_dau_hoc_phi && data.ngay_bat_dau_hoc_phi instanceof Date) {
        data.ngay_bat_dau_hoc_phi = data.ngay_bat_dau_hoc_phi.toISOString().split('T')[0];
      }
      
      console.log("Formatted student data for submission:", data);
      
      if (!isAdd && student) {
        await studentService.update(student.id, data);
        toast({
          title: "Thành công",
          description: "Cập nhật thông tin học sinh thành công",
        });
      } else {
        await studentService.create(data);
        toast({
          title: "Thành công",
          description: "Thêm học sinh mới thành công",
        });
      }
      
      navigate("/students");
    } catch (error) {
      console.error("Error saving student:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu thông tin học sinh",
        variant: "destructive",
      });
    }
  };

  const handleFormCancel = () => {
    navigate("/students");
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title={isAdd ? "Thêm Học Sinh" : "Sửa Thông Tin Học Sinh"}
        description={isAdd ? "Thêm học sinh mới vào hệ thống" : "Cập nhật thông tin học sinh"}
      />
      
      {isLoading && !isAdd ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <StudentForm
          initialData={student}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default StudentFormContainer;
