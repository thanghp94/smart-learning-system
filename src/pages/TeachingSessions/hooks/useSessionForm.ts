
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TeachingSession, Class, Employee } from "@/lib/types";
import { classService, employeeService } from "@/lib/supabase";
import { supabase } from "@/lib/supabase/client";
import { sessionSchema, SessionFormData } from "../schemas/sessionSchema";

interface UseSessionFormProps {
  initialData?: Partial<TeachingSession>;
}

export const useSessionForm = ({ initialData }: UseSessionFormProps = {}) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: initialData || {
      lop_chi_tiet_id: "",
      giao_vien: "",
      ngay_hoc: new Date().toISOString().substring(0, 10),
      thoi_gian_bat_dau: "08:00",
      thoi_gian_ket_thuc: "09:30",
      session_id: "1",
      loai_bai_hoc: "Học mới", // Changed from Loai_bai_hoc to loai_bai_hoc
      noi_dung: "",
      nhan_xet_1: null,
      nhan_xet_2: null,
      nhan_xet_3: null,
      nhan_xet_4: null,
      nhan_xet_5: null,
      nhan_xet_6: null,
      trung_binh: null,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Try to get classes directly from the database without RLS
        let classesData: Class[] = [];
        const { data: directClassesData, error: directClassesError } = await supabase
          .from('classes')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (directClassesError) {
          console.error("Error fetching classes directly:", directClassesError);
          // Fallback to using the service
          classesData = await classService.getAll();
        } else {
          console.log("Directly fetched classes:", directClassesData);
          
          // Ensure all required fields are present for each class
          classesData = (directClassesData || []).map(cls => ({
            ...cls,
            id: cls.id || crypto.randomUUID(),
            ten_lop_full: cls.ten_lop_full || cls.Ten_lop_full || '',
            Ten_lop_full: cls.Ten_lop_full || cls.ten_lop_full || '',
            ten_lop: cls.ten_lop || '',
            ct_hoc: cls.ct_hoc || '',
            co_so: cls.co_so || '',
            gv_chinh: cls.gv_chinh || cls.GV_chinh || '',
            GV_chinh: cls.GV_chinh || cls.gv_chinh || '',
            tinh_trang: cls.tinh_trang || 'pending'
          })) as Class[];
        }
        
        const teachersData = await employeeService.getByRole("Giáo viên");
        
        console.log("Form classes data:", classesData);
        console.log("Form teachers data:", teachersData);
        
        setClasses(classesData as Class[]);
        setTeachers(teachersData);
      } catch (error) {
        console.error("Error fetching form data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateAverageScore = (data: SessionFormData) => {
    if (data.nhan_xet_1 || data.nhan_xet_2 || data.nhan_xet_3 || 
        data.nhan_xet_4 || data.nhan_xet_5 || data.nhan_xet_6) {
      
      const scores = [
        Number(data.nhan_xet_1 || 0),
        Number(data.nhan_xet_2 || 0),
        Number(data.nhan_xet_3 || 0),
        Number(data.nhan_xet_4 || 0),
        Number(data.nhan_xet_5 || 0),
        Number(data.nhan_xet_6 || 0)
      ].filter(score => score > 0);
      
      if (scores.length > 0) {
        const sum = scores.reduce((acc, score) => acc + score, 0);
        return sum / scores.length;
      }
    }
    return null;
  };

  return {
    form,
    classes,
    teachers,
    isLoading,
    calculateAverageScore
  };
};
