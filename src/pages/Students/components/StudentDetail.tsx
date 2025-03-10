
import React, { useState, useEffect } from 'react';
import { Student, Finance, Evaluation, Event } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { financeService, evaluationService, eventService } from '@/lib/supabase';
import { formatDate, formatCurrency } from '@/utils/format';
import DataTable from '@/components/ui/DataTable';
import EnrollStudentButton from './EnrollStudentButton';

interface StudentDetailProps {
  student: Student;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student }) => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!student?.id) return;
      
      setIsLoading(true);
      try {
        // Fetch related finances
        const financeData = await financeService.getByEntity('student', student.id);
        setFinances(financeData);
        
        // Fetch related events
        const eventData = await eventService.getByEntity('student', student.id);
        setEvents(eventData);
        
        // Fetch evaluations
        const evalData = await evaluationService.getByStudent(student.id);
        setEvaluations(evalData);
      } catch (error) {
        console.error('Error loading student details:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin chi tiết. Vui lòng thử lại sau.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudentDetails();
  }, [student?.id, toast]);

  const renderBasicInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p><strong>Tên học sinh:</strong> {student.ten_hoc_sinh}</p>
        <p><strong>Ngày sinh:</strong> {formatDate(student.ngay_sinh)}</p>
        <p><strong>Giới tính:</strong> {student.gioi_tinh}</p>
        <p><strong>Địa chỉ:</strong> {student.dia_chi || 'N/A'}</p>
      </div>
      <div>
        <p><strong>Phụ huynh:</strong> {student.ten_ph || 'N/A'}</p>
        <p><strong>SĐT phụ huynh:</strong> {student.sdt_ph1 || 'N/A'}</p>
        <p><strong>Email:</strong> {student.email_ph1 || 'N/A'}</p>
        <p><strong>Trạng thái:</strong> {student.trang_thai}</p>
      </div>
    </div>
  );

  const renderFinances = () => (
    <div>
      {finances.length > 0 ? (
        <DataTable
          data={finances}
          columns={[
            { header: 'Ngày', accessor: (row) => formatDate(row.ngay) },
            { header: 'Tên phí', accessor: 'ten_phi' },
            { header: 'Loại', accessor: 'loai_thu_chi' },
            { header: 'Tổng tiền', accessor: (row) => formatCurrency(row.tong_tien) },
            { header: 'Trạng thái', accessor: 'tinh_trang' },
          ]}
        />
      ) : (
        <p className="text-gray-500">Không có dữ liệu tài chính</p>
      )}
    </div>
  );

  const renderEvaluations = () => (
    <div>
      {evaluations.length > 0 ? (
        <DataTable
          data={evaluations}
          columns={[
            { header: 'Đánh giá', accessor: 'ten_danh_gia' },
            { header: 'Ngày', accessor: (row) => formatDate(row.ngay_dau_dot_danh_gia) },
            { header: 'Trạng thái', accessor: 'trang_thai' },
          ]}
        />
      ) : (
        <p className="text-gray-500">Không có đánh giá</p>
      )}
    </div>
  );

  const renderEvents = () => (
    <div>
      {events.length > 0 ? (
        <DataTable
          data={events}
          columns={[
            { header: 'Tên sự kiện', accessor: 'ten_su_kien' },
            { header: 'Ngày', accessor: (row) => formatDate(row.ngay_bat_dau) },
            { header: 'Loại', accessor: 'loai_su_kien' },
            { header: 'Trạng thái', accessor: 'trang_thai' },
          ]}
        />
      ) : (
        <p className="text-gray-500">Không có sự kiện</p>
      )}
    </div>
  );

  const handleEnrollmentComplete = () => {
    toast({
      title: "Thành công",
      description: "Học sinh đã được đăng ký vào lớp học thành công",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Thông tin học sinh</CardTitle>
        <EnrollStudentButton 
          student={student} 
          onEnrollmentComplete={handleEnrollmentComplete}
        />
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Thông tin chung</TabsTrigger>
            <TabsTrigger value="finances">Tài chính</TabsTrigger>
            <TabsTrigger value="evaluations">Đánh giá</TabsTrigger>
            <TabsTrigger value="events">Sự kiện</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            {renderBasicInfo()}
          </TabsContent>
          
          <TabsContent value="finances">
            {renderFinances()}
          </TabsContent>
          
          <TabsContent value="evaluations">
            {renderEvaluations()}
          </TabsContent>
          
          <TabsContent value="events">
            {renderEvents()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StudentDetail;
