import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { TeachingSession } from '@/lib/types';
import { teachingSessionSchema } from './schemas/sessionSchema';
import { classService, employeeService, facilityService, teachingSessionService } from "@/lib/database";
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import SessionBasicInfoFields from './components/SessionBasicInfoFields';
import SessionContentField from './components/SessionContentField';
import SessionEvaluationFields from './components/SessionEvaluationFields';
import { SessionFormData } from './schemas/sessionSchema';

interface TeachingSessionFormProps {
  initialData?: Partial<TeachingSession>;
  onSubmit: (data: Partial<TeachingSession>) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const TeachingSessionForm: React.FC<TeachingSessionFormProps> = ({
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
  
  // Process initialData to convert Date objects to strings
  const processedInitialData = initialData ? {
    ...initialData,
    // Convert Date objects to strings if necessary
    ngay_hoc: initialData.ngay_hoc ? typeof initialData.ngay_hoc === 'object' 
      ? format(initialData.ngay_hoc as Date, 'yyyy-MM-dd') 
      : initialData.ngay_hoc 
      : undefined
  } : undefined;
  
  const form = useForm<SessionFormData>({
    resolver: zodResolver(teachingSessionSchema),
    defaultValues: processedInitialData || {
      lop_chi_tiet_id: '',
      giao_vien: '',
      ngay_hoc: '',
      thoi_gian_bat_dau: '',
      thoi_gian_ket_thuc: '',
      session_id: '',
      loai_bai_hoc: '',
      phong_hoc_id: '',
      tro_giang: '',
      nhan_xet_chung: '',
      ghi_chu: ''
    }
  });
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Use the correct service method to fetch classes
        const classesData = await classService.getAll();
        const teachersData = await employeeService.getAll();
        const facilitiesData = await facilityService.getAll();
        
        setClasses(classesData);
        setTeachers(teachersData);
        setFacilities(facilitiesData);
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
    // Transform form values if needed
    const sessionData = {
      ...values,
      // Add any other transformations needed
    };
    
    onSubmit(sessionData);
  };

  const calculateAverageScore = (data: SessionFormData): number | null => {
    const scores = [
      data.nhan_xet_1,
      data.nhan_xet_2,
      data.nhan_xet_3,
      data.nhan_xet_4,
      data.nhan_xet_5,
      data.nhan_xet_6,
    ].filter(score => score !== null && score !== undefined);
  
    if (scores.length === 0) {
      return null;
    }
  
    const total = scores.reduce((sum, score) => sum + Number(score), 0);
    return total / scores.length;
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

export default TeachingSessionForm;
