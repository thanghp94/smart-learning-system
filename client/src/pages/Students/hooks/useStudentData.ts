
import { useState, useEffect } from 'react';
import { Student } from '@/lib/types';
import { studentService, enrollmentService, facilityService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useStudentData = (studentId?: string) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempStudentData, setTempStudentData] = useState<Student | null>(null);
  const [facilityName, setFacilityName] = useState<string>('');
  const { toast } = useToast();

  // Fetch student data, enrollments, and facility info
  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Get student data
        const studentData = await studentService.getById(studentId);
        setStudent(studentData);
        setTempStudentData({ ...studentData });
        
        // Get student enrollments
        await refreshEnrollments();
        
        // Get facility information if available
        if (studentData?.co_so_id) {
          try {
            const facilityData = await facilityService.getById(studentData.co_so_id);
            if (facilityData) {
              setFacilityName(facilityData.ten_co_so);
            }
          } catch (error) {
            console.error('Error fetching facility:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin học sinh',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [studentId, toast]);

  // Handle refreshing enrollments
  const refreshEnrollments = async () => {
    if (!studentId) return;
    try {
      const studentEnrollments = await enrollmentService.getByStudent(studentId);
      setEnrollments(studentEnrollments || []);
    } catch (error) {
      console.error('Error refreshing enrollments:', error);
    }
  };

  // Handle saving student updates
  const handleSave = async () => {
    if (!studentId || !tempStudentData) return;

    try {
      setIsLoading(true);
      await studentService.update(studentId, tempStudentData);
      setStudent({ ...tempStudentData });
      setIsEditing(false);
      toast({
        title: 'Thành công',
        description: 'Thông tin học sinh đã được cập nhật',
      });
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin học sinh',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTempStudentData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Handle image upload
  const handleImageUpload = async (url: string) => {
    setTempStudentData((prev) => (prev ? { ...prev, anh_minh_hoc: url } : null));
  };

  return {
    student,
    tempStudentData,
    enrollments,
    isLoading,
    isEditing,
    facilityName,
    setIsEditing,
    setTempStudentData,
    refreshEnrollments,
    handleChange,
    handleImageUpload,
    handleSave
  };
};
