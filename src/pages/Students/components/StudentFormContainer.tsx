
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
  const [isSaving, setIsSaving] = useState(false);
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
        setStudent(data);
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
      setIsSaving(true);
      console.log("Submitting student data:", data);
      
      // Format the data for API submission
      const formattedData = {
        ...data,
        ngay_sinh: data.ngay_sinh ? data.ngay_sinh.toISOString().split('T')[0] : null,
        han_hoc_phi: data.han_hoc_phi ? data.han_hoc_phi.toISOString().split('T')[0] : null,
        ngay_bat_dau_hoc_phi: data.ngay_bat_dau_hoc_phi ? data.ngay_bat_dau_hoc_phi.toISOString().split('T')[0] : null,
      };
      
      // Remove any fields that might cause issues with the database
      // The mo_ta_hs field is in the database instead of ghi_chu, so we'll map it
      formattedData.mo_ta_hs = formattedData.ghi_chu;
      delete formattedData.ghi_chu;
      
      console.log("Formatted student data for submission:", formattedData);
      
      let response;
      if (!isAdd && student) {
        response = await studentService.update(student.id, formattedData);
        if (response) {
          toast({
            title: "Thành công",
            description: "Cập nhật thông tin học sinh thành công",
          });
        } else {
          throw new Error("Không thể cập nhật thông tin học sinh");
        }
      } else {
        response = await studentService.create(formattedData);
        if (response) {
          toast({
            title: "Thành công",
            description: "Thêm học sinh mới thành công",
          });
        } else {
          throw new Error("Không thể thêm học sinh mới");
        }
      }
      
      navigate("/students");
    } catch (error) {
      console.error("Error saving student:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu thông tin học sinh",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default StudentFormContainer;
