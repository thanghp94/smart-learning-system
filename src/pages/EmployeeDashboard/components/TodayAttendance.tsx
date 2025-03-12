
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmployeeClockInOut } from '@/lib/types';
import { employeeClockInService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { formatTime } from '@/lib/utils';
import { Check, Clock, LogIn, LogOut } from 'lucide-react';

interface TodayAttendanceProps {
  employeeId: string;
  employeeName: string;
}

const TodayAttendance: React.FC<TodayAttendanceProps> = ({ employeeId, employeeName }) => {
  const [attendance, setAttendance] = useState<EmployeeClockInOut[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clockingIn, setClockingIn] = useState(false);
  const [clockingOut, setClockingOut] = useState(false);
  const { toast } = useToast();

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const data = await employeeClockInService.getTodayAttendance();
      // Filter for the current employee
      const employeeAttendance = data.filter(record => record.nhan_vien_id === employeeId);
      setAttendance(employeeAttendance);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu điểm danh',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchAttendance();
    }
  }, [employeeId]);

  const handleClockIn = async () => {
    setClockingIn(true);
    try {
      const result = await employeeClockInService.clockIn(employeeId);
      if (result) {
        toast({
          title: 'Điểm danh thành công',
          description: `Đã điểm danh vào lúc ${formatTime(new Date())}`,
        });
        fetchAttendance();
      }
    } catch (error) {
      console.error('Error clocking in:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể điểm danh',
        variant: 'destructive'
      });
    } finally {
      setClockingIn(false);
    }
  };

  const handleClockOut = async () => {
    setClockingOut(true);
    try {
      const result = await employeeClockInService.clockOut(employeeId);
      if (result) {
        toast({
          title: 'Đã đăng xuất',
          description: `Đã đăng xuất lúc ${formatTime(new Date())}`,
        });
        fetchAttendance();
      }
    } catch (error) {
      console.error('Error clocking out:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể đăng xuất',
        variant: 'destructive'
      });
    } finally {
      setClockingOut(false);
    }
  };

  const todayAttendance = attendance.length > 0 ? attendance[0] : null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Điểm danh hôm nay</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
              <Clock className="h-6 w-6 text-primary mb-1" />
              <p className="text-sm text-muted-foreground">Giờ vào</p>
              <p className="text-lg font-semibold">
                {todayAttendance && todayAttendance.gio_vao ? todayAttendance.gio_vao : '...'}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
              <Clock className="h-6 w-6 text-primary mb-1" />
              <p className="text-sm text-muted-foreground">Giờ ra</p>
              <p className="text-lg font-semibold">
                {todayAttendance && todayAttendance.gio_ra ? todayAttendance.gio_ra : '...'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button 
              onClick={handleClockIn} 
              disabled={isLoading || clockingIn || (todayAttendance && todayAttendance.gio_ra)}
              className="w-full"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {clockingIn ? 'Đang xử lý...' : 'Điểm danh'}
            </Button>
            <Button 
              onClick={handleClockOut} 
              disabled={isLoading || clockingOut || !todayAttendance || !todayAttendance.gio_vao}
              className="w-full"
              variant={todayAttendance && todayAttendance.gio_ra ? 'default' : 'secondary'}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {clockingOut ? 'Đang xử lý...' : 'Đăng xuất'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayAttendance;
