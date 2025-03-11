
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { EmployeeClockInOut } from '@/lib/types';
import { employeeClockInService } from '@/lib/supabase';
import { formatTime } from '@/lib/utils';

interface TodayAttendanceProps {
  employeeId: string;
}

const TodayAttendance: React.FC<TodayAttendanceProps> = ({ employeeId }) => {
  const [attendanceRecord, setAttendanceRecord] = useState<EmployeeClockInOut | null>(null);
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [isClockingOut, setIsClockingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  const fetchTodayAttendance = async () => {
    try {
      setIsLoading(true);
      const records = await employeeClockInService.getByEmployeeAndDate(employeeId, today);
      
      if (records && records.length > 0) {
        setAttendanceRecord(records[0]);
      } else {
        setAttendanceRecord(null);
      }
    } catch (error) {
      console.error('Error fetching attendance record:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin chấm công',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchTodayAttendance();
    }
  }, [employeeId]);

  const handleClockIn = async () => {
    try {
      setIsClockingIn(true);
      
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0];
      
      const clockInData: Partial<EmployeeClockInOut> = {
        nhan_vien_id: employeeId,
        ngay: today,
        thoi_gian_vao: timeString,
        nhan_su_id: employeeId,
      };
      
      await employeeClockInService.clockIn(clockInData);
      
      toast({
        title: 'Chấm công thành công',
        description: `Đã chấm công vào lúc ${timeString}`,
      });
      
      fetchTodayAttendance();
    } catch (error) {
      console.error('Error clocking in:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể chấm công vào',
        variant: 'destructive',
      });
    } finally {
      setIsClockingIn(false);
    }
  };

  const handleClockOut = async () => {
    try {
      if (!attendanceRecord) return;
      
      setIsClockingOut(true);
      
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0];
      
      const updatedData: Partial<EmployeeClockInOut> = {
        id: attendanceRecord.id,
        thoi_gian_ra: timeString,
      };
      
      await employeeClockInService.clockOut(updatedData);
      
      toast({
        title: 'Chấm công ra thành công',
        description: `Đã chấm công ra lúc ${timeString}`,
      });
      
      fetchTodayAttendance();
    } catch (error) {
      console.error('Error clocking out:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể chấm công ra',
        variant: 'destructive',
      });
    } finally {
      setIsClockingOut(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Chấm công hôm nay</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">Đang tải...</div>
        ) : attendanceRecord ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Trạng thái:</span>
              </div>
              <div className="flex items-center">
                {attendanceRecord.thoi_gian_ra ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Đã chấm công ra</span>
                  </div>
                ) : (
                  <div className="flex items-center text-blue-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Đang làm việc</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Giờ vào:</span>
              </div>
              <span>{formatTime(attendanceRecord.thoi_gian_vao)}</span>
            </div>

            {attendanceRecord.thoi_gian_ra && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Giờ ra:</span>
                </div>
                <span>{formatTime(attendanceRecord.thoi_gian_ra)}</span>
              </div>
            )}

            {!attendanceRecord.thoi_gian_ra && (
              <Button 
                className="w-full mt-2" 
                onClick={handleClockOut} 
                disabled={isClockingOut}
              >
                {isClockingOut ? 'Đang chấm công...' : 'Chấm công ra'}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <XCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Trạng thái:</span>
              </div>
              <div className="text-amber-600">Chưa chấm công</div>
            </div>
            <Button 
              className="w-full mt-2" 
              onClick={handleClockIn} 
              disabled={isClockingIn}
            >
              {isClockingIn ? 'Đang chấm công...' : 'Chấm công vào'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayAttendance;
