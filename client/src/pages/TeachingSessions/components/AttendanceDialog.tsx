
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { attendanceService } from "@/lib/database";

export interface AttendanceDialogProps {
  open: boolean;
  onClose: () => void;
  sessionId: string;
  classId: string;
}

interface StudentType {
  id: string;
  ten_hoc_sinh: string;
  hinh_anh_hoc_sinh?: string;
  ma_hoc_sinh?: string;
}

const AttendanceDialog: React.FC<AttendanceDialogProps> = ({
  open,
  onClose,
  sessionId,
  classId
}) => {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [attendanceStatus, setAttendanceStatus] = useState<{ [key: string]: boolean }>({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Fetch students in this class
  useEffect(() => {
    const fetchStudents = async () => {
      if (!open) return;
      setLoading(true);
      try {
        // Fetch students from the API
        const enrolledStudents = await fetch(`/api/classes/${classId}/students`).then(res => res.json());
        
        // Process data to have the format we need
        const processedStudents: StudentType[] = enrolledStudents.map((student: any) => ({
          id: student.id,
          ten_hoc_sinh: student.ten_hoc_sinh || student.name || '',
          hinh_anh_hoc_sinh: student.hinh_anh_hoc_sinh || student.image || '',
          ma_hoc_sinh: student.ma_hoc_sinh || student.code || ''
        }));
        
        setStudents(processedStudents);
        
        // Initialize all students as absent
        const initialStatus: { [key: string]: boolean } = {};
        processedStudents.forEach((student: StudentType) => {
          initialStatus[student.id] = false;
        });
        setAttendanceStatus(initialStatus);
      } catch (error) {
        console.error('Failed to fetch students:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách học sinh',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [open, classId, toast]);

  // Toggle attendance status for a student
  const toggleAttendance = (studentId: string) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  // Save attendance
  const saveAttendance = async () => {
    setSaving(true);
    try {
      // Convert attendance status to the format expected by the API
      const attendanceRecords = Object.entries(attendanceStatus).map(([studentId, isPresent]) => ({
        teaching_session_id: sessionId,
        student_id: studentId,
        status: isPresent ? 'present' : 'absent',
        created_at: new Date().toISOString()
      }));

      // Send data to the API
      await attendanceService.saveAttendance(attendanceRecords);
      
      toast({
        title: 'Thành công',
        description: 'Đã lưu điểm danh'
      });
      onClose();
    } catch (error) {
      console.error('Failed to save attendance:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu điểm danh',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Điểm danh học sinh</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Đang tải danh sách học sinh...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {students.length === 0 ? (
              <p className="text-center text-muted-foreground">Không có học sinh nào trong lớp này</p>
            ) : (
              <>
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="font-medium">{student.ten_hoc_sinh}</div>
                      <Checkbox 
                        checked={attendanceStatus[student.id] || false}
                        onCheckedChange={() => toggleAttendance(student.id)}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={onClose} disabled={saving}>
                    Hủy
                  </Button>
                  <Button onClick={saveAttendance} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : 'Lưu điểm danh'}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceDialog;
