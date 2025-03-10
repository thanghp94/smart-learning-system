
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useNavigate } from 'react-router-dom';
import { sessionService } from '@/lib/supabase/session-service';
import { teachingSessionService } from '@/lib/supabase/teaching-session-service';
import { classService } from '@/lib/supabase/services/class';
import { employeeService } from '@/lib/supabase/employee-service';
import { useToast } from '@/hooks/use-toast';
import { Session, Class, Employee, TeachingSession } from '@/lib/types';
import SessionBasicInfoFields from './components/SessionBasicInfoFields';
import SessionEvaluationFields from './components/SessionEvaluationFields';
import { TeachingSessionSchema, teachingSessionSchema } from './schemas/sessionSchema';
import { formatDate } from '@/utils/format';

interface TeachingSessionFormProps {
  initialData?: TeachingSession;
  isEditMode?: boolean;
}

const TeachingSessionForm: React.FC<TeachingSessionFormProps> = ({ 
  initialData, 
  isEditMode = false 
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<TeachingSessionSchema>({
    resolver: zodResolver(teachingSessionSchema),
    defaultValues: initialData ? {
      ...initialData,
      ngay_hoc: initialData.ngay_hoc ? new Date(initialData.ngay_hoc) : undefined,
    } : {
      ngay_hoc: new Date(),
      thoi_gian_bat_dau: '08:00',
      thoi_gian_ket_thuc: '09:30',
      trang_thai: 'pending',
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sessionsData, classesData, teachersData] = await Promise.all([
          sessionService.getAll(),
          classService.classBaseService.getAll(),
          employeeService.getAll()
        ]);
        
        setSessions(sessionsData);
        setClasses(classesData);
        setTeachers(teachersData);
      } catch (error) {
        console.error('Error fetching data for teaching session form:', error);
        toast({
          title: 'Error',
          description: 'Failed to load form data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: TeachingSessionSchema) => {
    try {
      if (isEditMode && initialData) {
        // Update existing teaching session
        await teachingSessionService.update(initialData.id, {
          ...data,
          ngay_hoc: data.ngay_hoc ? formatDate(data.ngay_hoc) : undefined,
        });
        toast({
          title: 'Thành công',
          description: 'Buổi dạy đã được cập nhật',
        });
      } else {
        // Create new teaching session
        await teachingSessionService.create({
          ...data,
          ngay_hoc: data.ngay_hoc ? formatDate(data.ngay_hoc) : undefined,
        });
        toast({
          title: 'Thành công',
          description: 'Buổi dạy mới đã được tạo',
        });
      }
      navigate('/teaching-sessions');
    } catch (error) {
      console.error('Error saving teaching session:', error);
      toast({
        title: 'Error',
        description: 'Failed to save teaching session',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">
        {isEditMode ? 'Chỉnh sửa buổi dạy' : 'Thêm buổi dạy mới'}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin buổi dạy</CardTitle>
              <CardDescription>Nhập thông tin cơ bản về buổi dạy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SessionBasicInfoFields 
                form={form} 
                sessions={sessions} 
                classes={classes} 
                teachers={teachers} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Đánh giá buổi dạy</CardTitle>
              <CardDescription>Nhập đánh giá và nhận xét về buổi dạy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SessionEvaluationFields form={form} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/teaching-sessions')}
              >
                Hủy
              </Button>
              <Button type="submit">
                {isEditMode ? 'Cập nhật' : 'Tạo buổi dạy'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default TeachingSessionForm;
