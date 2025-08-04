
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { teachingSessionSchema, SessionFormData } from '../schemas/sessionSchema';
import { classService, employeeService, facilityService } from "@/lib/database";
import { TeachingSession } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface UseSessionFormProps {
  initialData?: Partial<TeachingSession>;
}

export const useSessionForm = ({ initialData }: UseSessionFormProps) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Define default values for the form
  const defaultValues: Partial<SessionFormData> = {
    lop_chi_tiet_id: initialData?.lop_chi_tiet_id || '',
    giao_vien: initialData?.giao_vien || '',
    ngay_hoc: initialData?.ngay_hoc || '',
    thoi_gian_bat_dau: initialData?.thoi_gian_bat_dau || '09:00',
    thoi_gian_ket_thuc: initialData?.thoi_gian_ket_thuc || '10:30',
    session_id: initialData?.session_id || '',
    loai_bai_hoc: initialData?.loai_bai_hoc || '',
    phong_hoc_id: initialData?.phong_hoc_id || '',
    tro_giang: initialData?.tro_giang || '',
    noi_dung: initialData?.noi_dung || '',
    ghi_chu: initialData?.ghi_chu || '',
    co_so_id: initialData?.co_so_id || '',
  };

  // Initialize the form with react-hook-form
  const form = useForm<SessionFormData>({
    resolver: zodResolver(teachingSessionSchema),
    defaultValues
  });

  // Fetch necessary data for form dropdown options
  useEffect(() => {
    const fetchFormData = async () => {
      setIsLoading(true);
      try {
        // Fetch all required data in parallel
        const [classesData, teachersData, facilitiesData] = await Promise.all([
          classService.getAll(),
          employeeService.getAll(),
          facilityService.getAll()
        ]);
        
        setClasses(classesData || []);
        setTeachers(teachersData || []);
        setFacilities(facilitiesData || []);
      } catch (error) {
        console.error('Error fetching form data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load form data. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFormData();
  }, [toast]);

  return {
    form,
    classes,
    teachers,
    facilities,
    isLoading
  };
};
