
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Student, Finance, Event, Evaluation } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { financeService, eventService, evaluationService } from '@/lib/supabase';
import DataTable from '@/components/ui/DataTable';
import { format } from 'date-fns';

// Helper functions for formatting
const formatGender = (gender: string | undefined) => {
  if (!gender) return 'N/A';
  return gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : gender;
};

const formatStudentStatus = (status: string | undefined) => {
  if (!status) return 'N/A';
  switch (status) {
    case 'active': return 'Đang học';
    case 'graduated': return 'Đã tốt nghiệp';
    case 'on_hold': return 'Tạm dừng';
    case 'withdrawn': return 'Đã rút';
    default: return status;
  }
};

interface StudentDetailProps {
  student: Student;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student }) => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState({
    finances: true,
    events: true,
    evaluations: true
  });

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        // Get student finances
        const financeData = await financeService.getByEntity('student', student.id);
        setFinances(financeData);
        
        // Get student events
        const eventData = await eventService.getByEntity('student', student.id);
        setEvents(eventData);
        
        // Get student evaluations
        const evaluationData = await evaluationService.getByEntity('student', student.id);
        setEvaluations(evaluationData);
      } catch (error) {
        console.error('Error fetching student related data:', error);
      } finally {
        setLoading({
          finances: false,
          events: false,
          evaluations: false
        });
      }
    };
    
    fetchRelatedData();
  }, [student.id]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Mã học sinh</Label>
              <div className="text-xl font-semibold">{student.ma_hs || 'N/A'}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">Trạng thái</Label>
              <div>
                <Badge variant={student.trang_thai === 'active' ? 'success' : 'secondary'}>
                  {formatStudentStatus(student.trang_thai)}
                </Badge>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Họ tên</Label>
              <div className="font-medium">{student.ho_ten || 'N/A'}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">Giới tính</Label>
              <div className="font-medium">{formatGender(student.gioi_tinh)}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">Ngày sinh</Label>
              <div className="font-medium">
                {student.ngay_sinh ? format(new Date(student.ngay_sinh), 'dd/MM/yyyy') : 'N/A'}
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Tên phụ huynh</Label>
              <div className="font-medium">{student.ten_PH || 'N/A'}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">Số điện thoại phụ huynh</Label>
              <div className="font-medium">{student.so_dien_thoai || 'N/A'}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">Email phụ huynh</Label>
              <div className="font-medium">{student.email_PH || 'N/A'}</div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Trường học</Label>
              <div className="font-medium">{student.truong_hoc || 'N/A'}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">Lớp học</Label>
              <div className="font-medium">{student.lop_hoc || 'N/A'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="finances">
        <TabsList>
          <TabsTrigger value="finances">Tài chính</TabsTrigger>
          <TabsTrigger value="events">Sự kiện</TabsTrigger>
          <TabsTrigger value="evaluations">Đánh giá</TabsTrigger>
        </TabsList>
        
        <TabsContent value="finances">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lịch sử tài chính</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {/* Add functionality to add finance record */}}
              >
                Thêm giao dịch
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { title: "Ngày", key: "ngay", sortable: true },
                  { title: "Loại", key: "loai_thu_chi", sortable: true },
                  { title: "Diễn giải", key: "dien_giai" },
                  { title: "Số tiền", key: "tong_tien", sortable: true },
                  { title: "Tình trạng", key: "tinh_trang", sortable: true }
                ]}
                data={finances}
                isLoading={loading.finances}
                searchable={true}
                searchPlaceholder="Tìm kiếm giao dịch..."
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sự kiện</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {/* Add functionality to add event */}}
              >
                Thêm sự kiện
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { title: "Ngày", key: "ngay_bat_dau", sortable: true },
                  { title: "Tên sự kiện", key: "tieu_de", sortable: true },
                  { title: "Loại", key: "loai" }
                ]}
                data={events}
                isLoading={loading.events}
                searchable={true}
                searchPlaceholder="Tìm kiếm sự kiện..."
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="evaluations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Đánh giá</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {/* Add functionality to add evaluation */}}
              >
                Thêm đánh giá
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { title: "Ngày", key: "ngay", sortable: true },
                  { title: "Lớp", key: "lop_chi_tiet_id" },
                  { title: "Giáo viên", key: "giao_vien" },
                  { title: "Điểm", key: "diem", sortable: true }
                ]}
                data={evaluations}
                isLoading={loading.evaluations}
                searchable={true}
                searchPlaceholder="Tìm kiếm đánh giá..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Button 
        onClick={() => {/* Functionality to enroll student */}} 
        className="w-full"
      >
        Ghi danh vào lớp
      </Button>
    </div>
  );
};

export default StudentDetail;
