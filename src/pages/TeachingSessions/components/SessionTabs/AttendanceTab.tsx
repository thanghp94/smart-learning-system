import React, { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { api } from '@/convex/_generated/api';
import { useQuery, useMutation } from 'convex/react';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

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
  const enrollments = useQuery(api.enrollments.getEnrollmentsWithStudents);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (enrollments) {
      // Process the enrollment data to match the expected structure
      const processedStatuses = enrollments.map(enrollment => {
        const processedEnrollment = processEnrollmentData(enrollment);
        return {
          enrollmentId: processedEnrollment.id,
          isPresent: false // Default to absent
        };
      });
      setAttendanceStatuses(processedStatuses);
      setIsLoading(false);
    }
  }, [enrollments]);

  const [markAttendance, { pending: isMarkingAttendance }] = useMutation(api.teachingSessions.markAttendance);

  const toggleAttendance = (enrollmentId: string) => {
    setAttendanceStatuses(prevStatuses =>
      prevStatuses.map(status =>
        status.enrollmentId === enrollmentId ? { ...status, isPresent: !status.isPresent } : status
      )
    );
  };

  const saveAttendance = async () => {
    setIsLoading(true);
    try {
      if (sessionId) {
        await markAttendance({
          session_id: sessionId,
          attendanceData: attendanceStatuses.map(status => ({
            enrollment_id: status.enrollmentId,
            is_present: status.isPresent,
          })),
        });
        toast.success("Điểm danh thành công!");
      } else {
        toast.error("Không tìm thấy ID buổi học.");
      }
    } catch (error) {
      console.error("Lỗi khi lưu điểm danh:", error);
      toast.error("Không thể lưu điểm danh. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fix the type conversion in the component where the error occurs
  // Find and replace the code that's causing the error with this:
  const processEnrollmentData = (enrollmentData: any): EnrollmentWithStudent => {
    if (!enrollmentData) {
      return {
        id: '',
        hoc_sinh_id: '',
        student: { id: '', ten_hoc_sinh: '' }
      };
    }
    
    // Extract the student data properly
    const studentData = Array.isArray(enrollmentData.students) && enrollmentData.students.length > 0
      ? enrollmentData.students[0]  // Take the first student if it's an array
      : enrollmentData.student || { id: '', ten_hoc_sinh: '' };
    
    return {
      id: enrollmentData.id,
      hoc_sinh_id: enrollmentData.hoc_sinh_id,
      student: {
        id: studentData.id,
        ten_hoc_sinh: studentData.ten_hoc_sinh,
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
          {enrollments?.map((enrollment) => {
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
          <button
            onClick={saveAttendance}
            disabled={isLoading || isMarkingAttendance}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isMarkingAttendance ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu Điểm Danh"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceTab;
