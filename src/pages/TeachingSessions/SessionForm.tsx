
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { TeachingSession } from '@/lib/types';
import { teachingSessionSchema, SessionFormData } from './schemas/sessionSchema';
import { classService, employeeService, facilityService } from '@/lib/supabase';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import SessionBasicInfoFields from './components/SessionBasicInfoFields';
import SessionContentField from './components/SessionContentField';
import SessionEvaluationFields from './components/SessionEvaluationFields';

interface SessionFormProps {
  initialData?: Partial<TeachingSession>;
  onSubmit: (data: Partial<TeachingSession>) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const SessionForm: React.FC<SessionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const { toast } = useToast();
  
  // Use default values for the form
  const defaultValues = {
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
    nhan_xet_1: initialData?.nhan_xet_1 || null,
    nhan_xet_2: initialData?.nhan_xet_2 || null,
    nhan_xet_3: initialData?.nhan_xet_3 || null,
    nhan_xet_4: initialData?.nhan_xet_4 || null,
    nhan_xet_5: initialData?.nhan_xet_5 || null,
    nhan_xet_6: initialData?.nhan_xet_6 || null,
    nhan_xet_chung: initialData?.nhan_xet_chung || '',
    danh_gia_buoi_hoc: initialData?.danh_gia_buoi_hoc || '',
    diem_manh: initialData?.diem_manh || '',
    diem_yeu: initialData?.diem_yeu || '',
    ghi_chu_danh_gia: initialData?.ghi_chu_danh_gia || ''
  };
  
  const form = useForm<SessionFormData>({
    resolver: zodResolver(teachingSessionSchema),
    defaultValues
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

  // Handle form submission
  const handleFormSubmit = (values: SessionFormData) => {
    console.log('Form values submitted:', values);
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Session basic info fields */}
        <SessionBasicInfoFields 
          form={form} 
          classes={classes} 
          teachers={teachers} 
          isLoading={isLoading} 
        />
        
        <SessionContentField form={form} />
        
        <SessionEvaluationFields form={form} />
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEdit ? 'Update Session' : 'Create Session'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SessionForm;
