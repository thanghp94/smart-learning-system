
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TeachingSession, Class, Employee } from "@/lib/types";
import { classService, employeeService } from "@/lib/supabase";
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
      Loai_bai_hoc: "Học mới",
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
        
        const [classesData, teachersData] = await Promise.all([
          classService.getAll(),
          employeeService.getByRole("Giáo viên")
        ]);
        
        console.log("Form classes data:", classesData);
        console.log("Form teachers data:", teachersData);
        
        setClasses(classesData);
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
