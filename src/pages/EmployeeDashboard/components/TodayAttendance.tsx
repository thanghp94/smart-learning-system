
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { employeeClockInService } from '@/lib/supabase';
import { Employee, EmployeeClockIn } from '@/lib/types';

interface TodayAttendanceProps {
  employee: Employee;
}

const TodayAttendance: React.FC<TodayAttendanceProps> = ({ employee }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [todayRecord, setTodayRecord] = useState<EmployeeClockIn | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTodayAttendance();
  }, [employee]);

  const handleClockIn = async () => {
    if (!employee) return;

    setIsLoading(true);
    try {
      const now = new Date();
      const clockInTime = format(now, 'HH:mm:ss');
      const today = format(now, 'yyyy-MM-dd');
      
      // Check if we already have a record for today
      if (todayRecord?.id) {
        // Update existing record
        await employeeClockInService.update(todayRecord.id, {
          thoi_gian_vao: clockInTime,
          ngay: today
        });
      } else {
        // Create new record
        await employeeClockInService.create({
          nhan_su_id: employee.id,
          ngay: today,
          thoi_gian_vao: clockInTime
        });
      }
      
      toast({
        title: 'Điểm danh thành công',
        description: `Bạn đã điểm danh lúc ${clockInTime}`,
      });
      
      await fetchTodayAttendance();
    } catch (error) {
      console.error('Error clocking in:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể điểm danh. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!employee || !todayRecord?.id) return;

    setIsLoading(true);
    try {
      const now = new Date();
      const clockOutTime = format(now, 'HH:mm:ss');
      
      await employeeClockInService.update(todayRecord.id, {
        thoi_gian_ra: clockOutTime
      });
      
      toast({
        title: 'Điểm danh ra thành công',
        description: `Bạn đã điểm danh ra lúc ${clockOutTime}`,
      });
      
      await fetchTodayAttendance();
    } catch (error) {
      console.error('Error clocking out:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể điểm danh ra. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTodayAttendance = async () => {
    if (!employee) return;
    
    try {
      // Get today's date in format yyyy-MM-dd
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Use employeeClockInService to fetch records
      const records = await employeeClockInService.getAll();
      const todayAttendance = records.find(
        (record) => 
          record.nhan_su_id === employee.id && 
          record.ngay === today
      );
      
      if (todayAttendance) {
        setTodayRecord(todayAttendance);
        setIsClockedIn(!!todayAttendance.thoi_gian_vao);
      } else {
        setTodayRecord(null);
        setIsClockedIn(false);
      }
    } catch (error) {
      console.error('Error fetching today attendance:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Điểm danh hôm nay
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {format(new Date(), 'EEEE, dd/MM/yyyy', { locale: vi })}
            </div>
            <div className="text-xl font-medium mt-1">
              {format(new Date(), 'HH:mm:ss')}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            {todayRecord?.thoi_gian_vao && (
              <div className="text-center text-sm text-muted-foreground">
                Điểm danh vào: {todayRecord.thoi_gian_vao.substring(0, 5)}
              </div>
            )}
            
            {todayRecord?.thoi_gian_ra && (
              <div className="text-center text-sm text-muted-foreground">
                Điểm danh ra: {todayRecord.thoi_gian_ra.substring(0, 5)}
              </div>
            )}
            
            <div className="flex justify-center space-x-2 mt-2">
              {!isClockedIn ? (
                <Button 
                  onClick={handleClockIn} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Điểm danh vào'
                  )}
                </Button>
              ) : !todayRecord?.thoi_gian_ra ? (
                <Button 
                  onClick={handleClockOut} 
                  disabled={isLoading}
                  className="w-full"
                  variant="outline"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Điểm danh ra'
                  )}
                </Button>
              ) : (
                <div className="text-center w-full px-4 py-2 bg-muted rounded-md">
                  Bạn đã điểm danh đủ hôm nay
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayAttendance;
