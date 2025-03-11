
import React, { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { enrollmentService, attendanceService } from '@/lib/supabase';

// Add or fix type definitions
interface StudentInfo {
  id: string;
  ten_hoc_sinh: string;
  hinh_anh_hoc_sinh?: string;
}

interface EnrollmentWithStudent {
  id: string;
  hoc_sinh_id: string;
  student: StudentInfo;
}

interface AttendanceStatus {
  enrollmentId: string;
  isPresent: boolean;
}

const AttendanceTab: React.FC = () => {
  const { id: sessionId } = useParams();
  const [attendanceStatuses, setAttendanceStatuses] = useState<AttendanceStatus[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        if (sessionId) {
          // Fetch enrollments by session ID
          const data = await enrollmentService.getBySession(sessionId);
          setEnrollments(data || []);
          
          // Process the enrollment data to match the expected structure
          const processedStatuses = (data || []).map(enrollment => {
            const processedEnrollment = processEnrollmentData(enrollment);
            return {
              enrollmentId: processedEnrollment.id,
              isPresent: false // Default to absent
            };
          });
          setAttendanceStatuses(processedStatuses);
        }
      } catch (error) {
        console.error("Error fetching enrollments:", error);
        toast.error("Không thể tải danh sách học sinh");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, [sessionId]);

  const toggleAttendance = (enrollmentId: string) => {
    setAttendanceStatuses(prevStatuses =>
      prevStatuses.map(status =>
        status.enrollmentId === enrollmentId ? { ...status, isPresent: !status.isPresent } : status
      )
    );
  };

  const saveAttendance = async () => {
    setIsLoading(true);
    setIsMarkingAttendance(true);
    try {
      if (sessionId) {
        // Convert attendanceStatuses to the format expected by the API
        const attendanceRecords = attendanceStatuses.map(status => ({
          teaching_session_id: sessionId,
          enrollment_id: status.enrollmentId,
          status: status.isPresent ? 'present' : 'absent'
        }));

        // Save attendance records
        await attendanceService.saveAttendance(attendanceRecords);
        
        toast.success("Điểm danh thành công!");
      } else {
        toast.error("Không tìm thấy ID buổi học.");
      }
    } catch (error) {
      console.error("Lỗi khi lưu điểm danh:", error);
      toast.error("Không thể lưu điểm danh. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
      setIsMarkingAttendance(false);
    }
  };

  // Process enrollment data to match the expected structure
  const processEnrollmentData = (enrollmentData: any): EnrollmentWithStudent => {
    if (!enrollmentData) {
      return {
        id: '',
        hoc_sinh_id: '',
        student: { id: '', ten_hoc_sinh: '' }
      };
    }
    
    // Extract the student data properly
    const studentData = enrollmentData.students && Array.isArray(enrollmentData.students) && enrollmentData.students.length > 0
      ? enrollmentData.students[0]  // Take the first student if it's an array
      : enrollmentData.student || { id: '', ten_hoc_sinh: '' };
    
    return {
      id: enrollmentData.id || '',
      hoc_sinh_id: enrollmentData.hoc_sinh_id || '',
      student: {
        id: studentData.id || '',
        ten_hoc_sinh: studentData.ten_hoc_sinh || '',
        hinh_anh_hoc_sinh: studentData.hinh_anh_hoc_sinh
      }
    };
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải danh sách học sinh...
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Không có học sinh nào trong lớp này</p>
            </div>
          ) : (
            <>
              {enrollments.map((enrollment) => {
                const processedEnrollment = processEnrollmentData(enrollment);
                const attendanceStatus = attendanceStatuses.find(status => status.enrollmentId === processedEnrollment.id);
                const isPresent = attendanceStatus ? attendanceStatus.isPresent : false;

                return (
                  <div key={processedEnrollment.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div>{processedEnrollment.student.ten_hoc_sinh}</div>
                    <Checkbox
                      checked={isPresent}
                      onCheckedChange={() => toggleAttendance(processedEnrollment.id)}
                      disabled={isLoading || isMarkingAttendance}
                    />
                  </div>
                );
              })}
              <Button
                onClick={saveAttendance}
                disabled={isLoading || isMarkingAttendance}
                className="w-full"
              >
                {isMarkingAttendance ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu Điểm Danh"
                )}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceTab;
