
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { EmployeeClockInOut } from '@/lib/types';
import { employeeClockInService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface TodayAttendanceProps {
  employeeId: string;
  employeeName: string;
}

const TodayAttendance: React.FC<TodayAttendanceProps> = ({ employeeId, employeeName }) => {
  const [attendance, setAttendance] = useState<EmployeeClockInOut | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        setLoading(true);
        const data = await employeeClockInService.getTodayAttendance(employeeId);
        setAttendance(data);
      } catch (error) {
        console.error("Error fetching today's attendance:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu điểm danh hôm nay",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = async () => {
    try {
      setLoading(true);
      const data = await employeeClockInService.clockIn(employeeId, employeeName);
      setAttendance(data);
      toast({
        title: "Điểm danh thành công",
        description: `Bạn đã điểm danh vào lúc ${format(new Date(), 'HH:mm')}`,
      });
    } catch (error) {
      console.error("Error clocking in:", error);
      toast({
        title: "Lỗi",
        description: "Không thể điểm danh vào",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!attendance) return;
    
    try {
      setLoading(true);
      const data = await employeeClockInService.clockOut(attendance.id);
      setAttendance(data);
      toast({
        title: "Điểm danh ra thành công",
        description: `Bạn đã điểm danh ra lúc ${format(new Date(), 'HH:mm')}`,
      });
    } catch (error) {
      console.error("Error clocking out:", error);
      toast({
        title: "Lỗi",
        description: "Không thể điểm danh ra",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Điểm danh hôm nay</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="mb-4 text-center">
            <p className="text-xl font-bold">
              {format(currentTime, 'HH:mm:ss', { locale: vi })}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(currentTime, 'EEEE, dd/MM/yyyy', { locale: vi })}
            </p>
          </div>

          <div className="w-full grid grid-cols-2 gap-4 mb-4">
            {attendance && attendance.gio_vao && (
              <div className="p-3 bg-muted rounded-md text-center">
                <p className="text-sm font-medium">Giờ vào</p>
                <p className="text-base">{attendance.gio_vao || '--:--'}</p>
              </div>
            )}
            
            {attendance && attendance.gio_ra && (
              <div className="p-3 bg-muted rounded-md text-center">
                <p className="text-sm font-medium">Giờ ra</p>
                <p className="text-base">{attendance.gio_ra || '--:--'}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full">
            {!attendance && (
              <Button 
                className="w-full" 
                onClick={handleClockIn} 
                disabled={loading || !!attendance?.gio_ra}
              >
                <Clock className="mr-2 h-4 w-4" />
                Điểm danh vào
              </Button>
            )}
            
            {attendance && !attendance.gio_ra && (
              <Button 
                className="w-full"
                onClick={handleClockOut} 
                disabled={loading || !!attendance?.gio_ra === true}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Điểm danh ra
              </Button>
            )}
            
            {attendance && attendance.gio_vao && attendance.gio_ra && (
              <Button disabled className="w-full bg-green-500">
                <CheckCircle className="mr-2 h-4 w-4" />
                Đã điểm danh đủ
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayAttendance;
