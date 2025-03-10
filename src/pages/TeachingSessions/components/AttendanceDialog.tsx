
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, Clock, AlertCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { attendanceService } from '@/lib/supabase/attendance-service';
import { supabase } from '@/lib/supabase/client';
import { Attendance, TeachingSession } from '@/lib/types';
import { ProcessedStudent } from '../types/student';

interface AttendanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  classId?: string;
}

const AttendanceDialog: React.FC<AttendanceDialogProps> = ({ isOpen, onClose, sessionId, classId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<ProcessedStudent[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: string; notes: string; lateMinutes?: number }>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && sessionId) {
      fetchStudentsAndAttendance();
    }
  }, [isOpen, sessionId, classId]);

  const fetchStudentsAndAttendance = async () => {
    try {
      setIsLoading(true);
      
      // Fetch class details to get the lop_chi_tiet_id if not provided
      let classDetailId = classId;
      if (!classDetailId) {
        const { data: sessionData } = await supabase
          .from('teaching_sessions')
          .select('lop_chi_tiet_id')
          .eq('id', sessionId)
          .single();
        
        if (sessionData) {
          classDetailId = sessionData.lop_chi_tiet_id;
        }
      }

      if (!classDetailId) {
        throw new Error('Class ID not found');
      }

      // Get enrollments with student details
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          id,
          hoc_sinh_id,
          students:hoc_sinh_id (
            id,
            ten_hoc_sinh,
            hinh_anh_hoc_sinh,
            ma_hoc_sinh
          )
        `)
        .eq('lop_chi_tiet_id', classDetailId);

      if (enrollmentsError) throw enrollmentsError;

      // Get existing attendance records
      const attendanceRecords = await attendanceService.getByTeachingSession(sessionId);

      // Process students data
      const processedStudents: ProcessedStudent[] = enrollmentsData?.map(enrollment => ({
        id: enrollment.students.id,
        name: enrollment.students.ten_hoc_sinh,
        image: enrollment.students.hinh_anh_hoc_sinh,
        code: enrollment.students.ma_hoc_sinh || '',
        enrollmentId: enrollment.id
      })) || [];

      // Initialize attendance data
      const initialAttendanceData: Record<string, { status: string; notes: string; lateMinutes?: number }> = {};
      
      processedStudents.forEach(student => {
        const existingRecord = attendanceRecords.find(record => 
          record.enrollment_id === student.enrollmentId);
        
        if (existingRecord) {
          initialAttendanceData[student.enrollmentId] = {
            status: existingRecord.status,
            notes: existingRecord.ghi_chu || '',
            lateMinutes: existingRecord.thoi_gian_tre || 0
          };
        } else {
          initialAttendanceData[student.enrollmentId] = {
            status: 'present',
            notes: '',
            lateMinutes: 0
          };
        }
      });

      setStudents(processedStudents);
      setAttendanceData(initialAttendanceData);
    } catch (error) {
      console.error('Error fetching students and attendance:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách học sinh',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (enrollmentId: string, status: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [enrollmentId]: { 
        ...prev[enrollmentId], 
        status 
      }
    }));
  };

  const handleNotesChange = (enrollmentId: string, notes: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [enrollmentId]: { 
        ...prev[enrollmentId], 
        notes 
      }
    }));
  };

  const handleLateMinutesChange = (enrollmentId: string, minutes: string) => {
    const lateMinutes = parseInt(minutes) || 0;
    setAttendanceData(prev => ({
      ...prev,
      [enrollmentId]: { 
        ...prev[enrollmentId], 
        lateMinutes 
      }
    }));
  };

  const saveAttendance = async () => {
    try {
      setIsSaving(true);
      
      // Convert attendance data to an array of records to save
      const attendancePromises = students.map(async (student) => {
        const data = attendanceData[student.enrollmentId];
        
        if (!data) return null;
        
        const attendanceRecord: Partial<Attendance> = {
          teaching_session_id: sessionId,
          enrollment_id: student.enrollmentId,
          status: data.status,
          ghi_chu: data.notes,
          thoi_gian_tre: data.status === 'late' ? data.lateMinutes : 0
        };
        
        // Check if record already exists
        const existingRecords = await attendanceService.getByTeachingSession(sessionId);
        const existingRecord = existingRecords.find(record => record.enrollment_id === student.enrollmentId);
        
        if (existingRecord) {
          // Update existing record
          return attendanceService.update(existingRecord.id, attendanceRecord);
        } else {
          // Create new record
          return attendanceService.create(attendanceRecord);
        }
      });
      
      await Promise.all(attendancePromises.filter(Boolean));
      
      toast({
        title: 'Thành công',
        description: 'Đã lưu điểm danh thành công',
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu thông tin điểm danh',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="success">Có mặt</Badge>;
      case 'absent':
        return <Badge variant="destructive">Vắng mặt</Badge>;
      case 'late':
        return <Badge variant="warning">Đi trễ</Badge>;
      default:
        return <Badge variant="outline">Chưa điểm danh</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Điểm Danh Học Sinh</DialogTitle>
          <DialogDescription>
            Ghi nhận trạng thái điểm danh của học sinh trong buổi học
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Học sinh</TableHead>
                  <TableHead className="w-[200px]">Trạng thái</TableHead>
                  <TableHead className="w-[100px]">Đi trễ (phút)</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.enrollmentId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {student.image ? (
                          <img 
                            src={student.image} 
                            alt={student.name} 
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-8 w-8 p-1 rounded-full bg-muted" />
                        )}
                        <div>
                          <p className="font-medium">{student.name}</p>
                          {student.code && <p className="text-xs text-muted-foreground">{student.code}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant={attendanceData[student.enrollmentId]?.status === 'present' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange(student.enrollmentId, 'present')}
                          className="w-20"
                        >
                          Có mặt
                        </Button>
                        <Button
                          size="sm"
                          variant={attendanceData[student.enrollmentId]?.status === 'late' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange(student.enrollmentId, 'late')}
                          className="w-20"
                        >
                          Đi trễ
                        </Button>
                        <Button
                          size="sm"
                          variant={attendanceData[student.enrollmentId]?.status === 'absent' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange(student.enrollmentId, 'absent')}
                          className="w-20"
                        >
                          Vắng
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        disabled={attendanceData[student.enrollmentId]?.status !== 'late'}
                        value={attendanceData[student.enrollmentId]?.lateMinutes || 0}
                        onChange={(e) => handleLateMinutesChange(student.enrollmentId, e.target.value)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea
                        placeholder="Ghi chú điểm danh"
                        value={attendanceData[student.enrollmentId]?.notes || ''}
                        onChange={(e) => handleNotesChange(student.enrollmentId, e.target.value)}
                        className="min-h-9 h-9"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {students.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Chưa có học sinh ghi danh vào lớp này</p>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button 
                onClick={saveAttendance} 
                disabled={isSaving || students.length === 0}
              >
                {isSaving && <Spinner className="mr-2 h-4 w-4" />}
                Lưu điểm danh
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceDialog;
