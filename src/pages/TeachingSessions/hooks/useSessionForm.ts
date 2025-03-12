
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { teachingSessionSchema, SessionFormData } from '../schemas/sessionSchema';
import { classService, employeeService, facilityService } from '@/lib/supabase';
import { TeachingSession } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function useSessionForm({ initialData }: { initialData?: Partial<TeachingSession> }) {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Process initialData
  const processedInitialData = initialData || {};

  const form = useForm<SessionFormData>({
    resolver: zodResolver(teachingSessionSchema),
    defaultValues: {
      lop_chi_tiet_id: processedInitialData.lop_chi_tiet_id || '',
      giao_vien: processedInitialData.giao_vien || '',
      ngay_hoc: processedInitialData.ngay_hoc || '',
      thoi_gian_bat_dau: processedInitialData.thoi_gian_bat_dau || '',
      thoi_gian_ket_thuc: processedInitialData.thoi_gian_ket_thuc || '',
      session_id: processedInitialData.session_id || '',
      loai_bai_hoc: processedInitialData.loai_bai_hoc || '',
      phong_hoc_id: processedInitialData.phong_hoc_id || '',
      tro_giang: processedInitialData.tro_giang || '',
      ghi_chu: processedInitialData.ghi_chu || '',
      co_so_id: processedInitialData.co_so_id || '',
      noi_dung: processedInitialData.noi_dung || '',
      nhan_xet_1: processedInitialData.nhan_xet_1 || '',
      nhan_xet_2: processedInitialData.nhan_xet_2 || '',
      nhan_xet_3: processedInitialData.nhan_xet_3 || '',
      nhan_xet_4: processedInitialData.nhan_xet_4 || '',
      nhan_xet_5: processedInitialData.nhan_xet_5 || '',
      nhan_xet_6: processedInitialData.nhan_xet_6 || '',
      nhan_xet_chung: processedInitialData.nhan_xet_chung || '',
      danh_gia_buoi_hoc: processedInitialData.danh_gia_buoi_hoc || '',
      diem_manh: processedInitialData.diem_manh || '',
      diem_yeu: processedInitialData.diem_yeu || '',
      ghi_chu_danh_gia: processedInitialData.ghi_chu_danh_gia || ''
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
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
          description: 'Failed to load data. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  return {
    form,
    classes,
    teachers,
    facilities,
    isLoading
  };
}
