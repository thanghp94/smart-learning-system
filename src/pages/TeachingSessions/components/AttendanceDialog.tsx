import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast";
import { attendanceService, enrollmentService } from '@/lib/supabase';

interface StudentDetails {
  id: string;
  ten_hoc_sinh: string;
  hinh_anh_hoc_sinh?: string;
  ma_hoc_sinh?: string;
}

interface ProcessedStudent {
  id: string;
  ten_hoc_sinh: string;
  hinh_anh_hoc_sinh?: string;
  ma_hoc_sinh?: string;
  enrollmentId?: string;
  // Add other properties as needed
}

interface AttendanceDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  sessionId: string;
  onAttendanceUpdated: () => void;
}

const AttendanceDialog: React.FC<AttendanceDialogProps> = ({ open, setOpen, sessionId, onAttendanceUpdated }) => {
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const enrollments = await enrollmentService.getEnrollmentsBySessionId(sessionId);
        if (enrollments && enrollments.length > 0) {
          // Fetch student details for each enrollment
          const studentDetails = enrollments.map(enrollment => ({
            id: enrollment.hoc_sinh_id,
            ten_hoc_sinh: enrollment.students[0].ten_hoc_sinh,
            hinh_anh_hoc_sinh: enrollment.students[0].hinh_anh_hoc_sinh,
            ma_hoc_sinh: enrollment.students[0].ma_hoc_sinh,
          }));
          setStudentsData(studentDetails);

          // Initialize attendance data based on fetched enrollments
          const initialAttendance: Record<string, boolean> = {};
          studentDetails.forEach(student => {
            initialAttendance[student.id] = false; // Default to absent
          });
          setAttendanceData(initialAttendance);
        } else {
          setStudentsData([]);
          setAttendanceData({});
        }
      } catch (error) {
        console.error("Error fetching enrollments:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách học sinh đã đăng ký.",
          variant: "destructive",
        });
        setStudentsData([]);
        setAttendanceData({});
      }
    };

    if (open) {
      fetchEnrollments();
    }
  }, [open, sessionId, toast]);

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    setAttendanceData(prevData => ({
      ...prevData,
      [studentId]: isPresent,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Prepare attendance records to be saved
      const attendanceRecords = Object.keys(attendanceData).map(studentId => ({
        session_id: sessionId,
        student_id: studentId,
        is_present: attendanceData[studentId],
      }));

      // Save attendance records
      await attendanceService.saveAttendance(attendanceRecords);

      toast({
        title: "Thành công",
        description: "Điểm danh thành công!",
      });

      setOpen(false);
      onAttendanceUpdated();
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu điểm danh. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const processStudentData = (studentsData: any[]): ProcessedStudent[] => {
    if (!studentsData || !Array.isArray(studentsData)) {
      return [];
    }
    
    return studentsData.map(student => ({
      id: student.id,
      ten_hoc_sinh: student.ten_hoc_sinh,
      hinh_anh_hoc_sinh: student.hinh_anh_hoc_sinh,
      ma_hoc_sinh: student.ma_hoc_sinh
    }));
  };

  const processedStudents = processStudentData(studentsData);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Điểm danh</DialogTitle>
          <DialogDescription>
            Chọn học sinh có mặt trong buổi học.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {processedStudents.map((student) => (
            <div key={student.id} className="flex items-center space-x-2">
              <Checkbox
                id={`student-${student.id}`}
                checked={attendanceData[student.id] || false}
                onCheckedChange={(checked) => handleAttendanceChange(student.id, checked || false)}
              />
              <Label htmlFor={`student-${student.id}`}>{student.ten_hoc_sinh}</Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Lưu điểm danh
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceDialog;
