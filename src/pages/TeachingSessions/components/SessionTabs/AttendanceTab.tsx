import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Clock, Info, User, Calendar, AlertCircle, UserPlus } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import { attendanceService } from '@/lib/supabase/attendance-service';
import { Attendance, AttendanceWithDetails } from '@/lib/types';
import { format } from 'date-fns';
import AttendanceDialog from '../AttendanceDialog';
import EnrollStudentButton from '@/pages/Students/components/EnrollStudentButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AttendanceData {
  id: string;
  studentId: string;
  name: string;
  status: string;
  image?: string;
  time?: string;
  notes?: string;
  lateMinutes?: number;
}

interface AttendanceTabProps {
  sessionId?: string;
  classId?: string;
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({ sessionId, classId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (sessionId) {
      fetchAttendanceData();
    }
  }, [sessionId]);

  const fetchAttendanceData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch attendance records
      const attendanceRecords = await attendanceService.getByTeachingSession(sessionId || '');
      
      if (!attendanceRecords.length) {
        setAttendanceData([]);
        setIsLoading(false);
        return;
      }
      
      // Get all enrollment IDs from attendance records
      const enrollmentIds = attendanceRecords.map(record => record.enrollment_id);
      
      // Fetch enrollments with student details
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          id,
          hoc_sinh_id,
          students:hoc_sinh_id (
            id,
            ten_hoc_sinh,
            hinh_anh_hoc_sinh
          )
        `)
        .in('id', enrollmentIds);
      
      if (enrollmentsError) throw enrollmentsError;
      
      // Process and format attendance data - properly accessing the student object for each enrollment
      const formattedData: AttendanceData[] = attendanceRecords.map(attendance => {
        const enrollment = enrollmentsData?.find(e => e.id === attendance.enrollment_id);
        const student = enrollment?.students;
        
        return {
          id: attendance.id,
          studentId: student?.id || '',
          name: student?.ten_hoc_sinh || 'Học sinh không xác định',
          image: student?.hinh_anh_hoc_sinh || undefined,
          status: attendance.status,
          time: attendance.created_at ? format(new Date(attendance.created_at), 'HH:mm') : '-',
          notes: attendance.ghi_chu || '',
          lateMinutes: attendance.thoi_gian_tre
        };
      });
      
      setAttendanceData(formattedData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu điểm danh.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAttendanceStatus = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="success">Có mặt</Badge>;
      case 'late':
        return <Badge variant="warning">Đi muộn</Badge>;
      case 'absent':
        return <Badge variant="destructive">Vắng mặt</Badge>;
      case 'pending':
        return <Badge variant="outline">Chưa điểm danh</Badge>;
      default:
        return <Badge variant="outline">Chưa điểm danh</Badge>;
    }
  };

  const handleAttendanceDialogClose = () => {
    setIsDialogOpen(false);
    fetchAttendanceData(); // Refresh data after dialog closes
  };

  const handleEnrollmentComplete = async () => {
    setIsEnrollDialogOpen(false);
    toast({
      title: 'Thành công',
      description: 'Đã thêm học sinh vào lớp',
    });
    // Refresh attendance data after new enrollment
    await fetchAttendanceData();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Điểm danh</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[200px]">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Điểm danh</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEnrollDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" /> Thêm học sinh
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            Điểm danh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {attendanceData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Học sinh</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {record.image ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={record.image} alt={record.name} />
                          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                      )}
                      <span>{record.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getAttendanceStatus(record.status)}
                    {record.status === 'late' && record.lateMinutes && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {record.lateMinutes} phút
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.time !== '-' && (
                      <div className="flex items-center text-sm">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>{record.time}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.notes && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Info className="h-3 w-3 mr-1" />
                        <span>{record.notes}</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground">
            <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
            <p>Chưa có dữ liệu điểm danh cho buổi học này</p>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(true)}
              className="mt-4"
            >
              Điểm danh ngay
            </Button>
          </div>
        )}
      </CardContent>
      
      {isDialogOpen && (
        <AttendanceDialog
          isOpen={isDialogOpen}
          onClose={handleAttendanceDialogClose}
          sessionId={sessionId || ''}
          classId={classId}
        />
      )}

      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm học sinh vào lớp</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {classId ? (
              <EnrollStudentButton
                studentId=""
                onEnrollmentCreated={handleEnrollmentComplete}
                classId={classId}
              />
            ) : (
              <p className="text-center text-muted-foreground">
                Không thể thêm học sinh vì không có thông tin lớp học
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AttendanceTab;
