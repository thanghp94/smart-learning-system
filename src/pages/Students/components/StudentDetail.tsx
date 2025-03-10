import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Student, Finance } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Calendar, User, Mail, Phone, Book, Edit, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { financeService } from '@/lib/supabase';
import FinanceTable from '@/pages/Finance/components/FinanceTable';
import EnrollStudentButton from './EnrollStudentButton';

interface StudentDetailProps {
  student: Student;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student }) => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFinances = async () => {
      setIsLoading(true);
      try {
        const data = await financeService.getByEntity('student', student.id);
        setFinances(data);
      } catch (error) {
        console.error("Error fetching finances:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách tài chính",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (student?.id) {
      fetchFinances();
    }
  }, [student?.id, toast]);

  const handleEnrollmentCreated = async () => {
    // Refresh finances after enrollment
    setIsLoading(true);
    try {
      const data = await financeService.getByEntity('student', student.id);
      setFinances(data);
    } catch (error) {
      console.error("Error refreshing finances:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách tài chính",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!student) {
    return <div>Không tìm thấy thông tin học sinh</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{student.ho_va_ten}</h2>
        </div>
        <p className="text-muted-foreground">Mã học sinh: {student.ma_hoc_sinh}</p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Ngày sinh:</span>
          <span>{student.ngay_sinh ? format(parseISO(student.ngay_sinh), 'dd/MM/yyyy') : 'Chưa có'}</span>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Giới tính:</span>
          <span>{student.gioi_tinh || 'Chưa có'}</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Email:</span>
          <span>{student.email_ph1 || 'Chưa có'}</span>
        </div>

        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Điện thoại:</span>
          <span>{student.so_dien_thoai || 'Chưa có'}</span>
        </div>

        <div className="flex items-center gap-2">
          <Book className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Lớp:</span>
          <span>{student.lop || 'Chưa có'}</span>
        </div>
      </div>

      {student.ghi_chu && (
        <div className="mt-4">
          <h3 className="font-medium">Ghi chú:</h3>
          <p className="text-sm text-muted-foreground mt-1">{student.ghi_chu}</p>
        </div>
      )}

      <Tabs defaultValue="finances" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="finances">Tài chính</TabsTrigger>
          <TabsTrigger value="enrollments">Ghi danh</TabsTrigger>
        </TabsList>

        <TabsContent value="finances" className="space-y-4">
          <div className="flex justify-between items-center my-4">
            <h3 className="text-lg font-medium">Lịch sử giao dịch</h3>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Sửa
            </Button>
          </div>

          {finances.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground">Chưa có giao dịch nào</p>
              </CardContent>
            </Card>
          ) : (
            <FinanceTable finances={finances} isLoading={isLoading} />
          )}
        </TabsContent>

        <TabsContent value="enrollments" className="space-y-4">
          <div className="flex justify-between items-center my-4">
            <h3 className="text-lg font-medium">Thông tin ghi danh</h3>
          </div>

          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground">Chưa có thông tin ghi danh</p>
              <EnrollStudentButton 
                student={student}
                onEnrollmentCreated={handleEnrollmentCreated}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetail;
