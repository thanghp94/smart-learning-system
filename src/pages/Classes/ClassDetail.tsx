
import React, { useState, useEffect } from 'react';
import { 
  Clock, Calendar, User, Users, Book, Building, 
  Trash2, Share2, FileEdit, ArrowLeft, CreditCard
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Class, Student, TeachingSession, Enrollment, Evaluation } from '@/lib/types';
import { enrollmentService, teachingSessionService, evaluationService, facilityService } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import AddTeachingSessionButton from './AddTeachingSessionButton';
import ViewEvaluationsButton from '../Evaluations/ViewEvaluationsButton';
import ClassHeaderSection from './components/ClassHeaderSection';
import ClassInfoSection from './components/ClassInfoSection';
import ClassSessionsList from './components/ClassSessionsList';
import ClassStudentsList from './components/ClassStudentsList';

interface ClassDetailProps {
  classItem: Class;
}

const ClassDetail: React.FC<ClassDetailProps> = ({ classItem }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [classItem?.id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (classItem?.id) {
        const enrollmentsData = await enrollmentService.getByClass(classItem.id);
        setEnrollments(enrollmentsData || []);
        
        const sessionsData = await teachingSessionService.getByClass(classItem.id);
        setSessions(sessionsData || []);
      }
    } catch (error) {
      console.error('Error fetching class details:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu chi tiết của lớp học',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    if (classItem?.id) {
      try {
        await fetchData();
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật dữ liệu',
        });
      } catch (error) {
        console.error('Error refreshing data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể cập nhật dữ liệu',
          variant: 'destructive'
        });
      }
    }
  };

  if (!classItem) {
    return <div>Không tìm thấy thông tin lớp học</div>;
  }

  return (
    <div className="space-y-6">
      <ClassHeaderSection classItem={classItem} />
      
      <Separator />
      
      <ClassInfoSection 
        classItem={classItem} 
        enrollmentCount={enrollments.length} 
      />
      
      <Tabs defaultValue="sessions" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sessions">Buổi học</TabsTrigger>
          <TabsTrigger value="students">Học sinh</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions">
          <ClassSessionsList 
            sessions={sessions}
            classItem={classItem}
            onRefresh={handleRefreshData}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="students">
          <ClassStudentsList 
            enrollments={enrollments}
            onRefresh={handleRefreshData}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassDetail;
