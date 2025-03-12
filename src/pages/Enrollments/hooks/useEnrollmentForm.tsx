
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Enrollment } from '@/lib/types';
import { enrollmentService } from '@/lib/supabase';

export const useEnrollmentForm = (
  fetchData: () => Promise<void>, 
  closeAddSheet: () => void, 
  closeEditSheet: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddEnrollment = async (data: Partial<Enrollment>) => {
    try {
      setIsSubmitting(true);
      
      if (!data.hoc_sinh_id || !data.lop_chi_tiet_id) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn học sinh và lớp học",
          variant: "destructive"
        });
        return;
      }
      
      await enrollmentService.create(data);
      
      toast({
        title: "Thành công",
        description: "Thêm ghi danh mới thành công",
      });
      
      fetchData();
      closeAddSheet();
    } catch (error) {
      console.error("Error in handleAddEnrollment:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm ghi danh mới",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateEnrollment = async (enrollment: Enrollment | null, data: Partial<Enrollment>) => {
    try {
      setIsSubmitting(true);
      
      if (!enrollment?.id) {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy ID ghi danh",
          variant: "destructive"
        });
        return;
      }
      
      await enrollmentService.update(enrollment.id, data);
      
      toast({
        title: "Thành công",
        description: "Cập nhật ghi danh thành công",
      });
      
      fetchData();
      closeEditSheet();
    } catch (error) {
      console.error("Error in handleUpdateEnrollment:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật ghi danh",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    setIsSubmitting,
    handleAddEnrollment,
    handleUpdateEnrollment
  };
};
