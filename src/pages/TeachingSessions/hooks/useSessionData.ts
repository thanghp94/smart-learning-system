
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import { TeachingSession } from '@/lib/types';
import { EnrollmentWithStudent, ProcessedStudent } from '../types/student';

interface UseSessionDataResult {
  sessionData: any;
  teacher: any;
  classData: any;
  studentsList: ProcessedStudent[];
  isLoading: boolean;
  setSessionData: (data: any) => void;
}

export const useSessionData = (session?: any, sessionId?: string): UseSessionDataResult => {
  const [sessionData, setSessionData] = useState<any>(session || {});
  const [teacher, setTeacher] = useState<any>(null);
  const [classData, setClassData] = useState<any>(null);
  const [studentsList, setStudentsList] = useState<ProcessedStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const id = session?.id || sessionId;

  useEffect(() => {
    if (id) {
      fetchSessionData();
    }
  }, [id]);

  const fetchSessionData = async () => {
    setIsLoading(true);
    try {
      let currentSession = sessionData;
      if (!currentSession.id) {
        const { data, error } = await supabase
          .from('teaching_sessions')
          .select(`
            *,
            classes:lop_chi_tiet_id (
              id,
              ten_lop_full,
              ten_lop,
              co_so,
              gv_chinh
            )
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        currentSession = data;
        setSessionData(data);
      }

      if (currentSession.giao_vien) {
        const { data: teacherData, error: teacherError } = await supabase
          .from('employees')
          .select('*')
          .eq('id', currentSession.giao_vien)
          .single();
        
        if (!teacherError && teacherData) {
          setTeacher(teacherData);
        }
      }

      if (currentSession.lop_chi_tiet_id) {
        const { data: classInfo, error: classError } = await supabase
          .from('classes')
          .select('*')
          .eq('id', currentSession.lop_chi_tiet_id)
          .single();
        
        if (!classError && classInfo) {
          setClassData(classInfo);
        }

        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
            id,
            hoc_sinh_id,
            students:hoc_sinh_id (
              id,
              ten_hoc_sinh,
              hinh_anh_hoc_sinh,
              ma_hoc_sinh
            )
          `)
          .eq('lop_chi_tiet_id', currentSession.lop_chi_tiet_id);
        
        if (!enrollmentsError && enrollmentsData) {
          const students = (enrollmentsData as unknown as EnrollmentWithStudent[]).map(enrollment => {
            const studentInfo = enrollment.students || {
              id: enrollment.hoc_sinh_id,
              ten_hoc_sinh: 'Unknown',
              hinh_anh_hoc_sinh: null,
              ma_hoc_sinh: 'N/A'
            };
            
            return {
              id: studentInfo.id,
              name: studentInfo.ten_hoc_sinh,
              image: studentInfo.hinh_anh_hoc_sinh,
              code: studentInfo.ma_hoc_sinh
            };
          });
          
          setStudentsList(students);
        }
      }
    } catch (error) {
      console.error('Error fetching session details:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin buổi học. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sessionData,
    teacher,
    classData,
    studentsList,
    isLoading,
    setSessionData
  };
};
