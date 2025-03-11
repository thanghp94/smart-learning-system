
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { employeeService, supabase } from '@/lib/supabase';
import { Employee } from '@/lib/types';

interface TodayAttendanceProps {
  employee: Employee;
}

const TodayAttendance: React.FC<TodayAttendanceProps> = ({ employee }) => {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [attendanceRecord, setAttendanceRecord] = useState<any | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchTodayAttendance();
  }, [employee.id]);

  const handleClockIn = async () => {
    if (!employee.id) return;
    
    setIsClockingIn(true);
    try {
      // Manual clock in using the supabase client since the method doesn't exist
      const clockInData = {
        nhan_vien_id: employee.id,
        ngay: format(new Date(), 'yyyy-MM-dd'),
        thoi_gian_bat_dau: format(new Date(), 'HH:mm:ss'),
        trang_thai: 'active'
      };
      
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .insert(clockInData)
        .select()
        .single();
      
      if (error) throw error;
      
      setAttendanceRecord(data);
      toast({
        title: 'Đã chấm công vào',
        description: `Thời gian: ${format(new Date(), 'HH:mm:ss')}`,
      });
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
    if (!attendanceRecord?.id) return;
    
    setIsClockingIn(true);
    try {
      // Update the record with clock out time
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .update({
          thoi_gian_ket_thuc: format(new Date(), 'HH:mm:ss'),
          trang_thai: 'completed'
        })
        .eq('id', attendanceRecord.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setAttendanceRecord(data);
      toast({
        title: 'Đã chấm công ra',
        description: `Thời gian: ${format(new Date(), 'HH:mm:ss')}`,
      });
    } catch (error) {
      console.error('Error clocking out:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể chấm công ra',
        variant: 'destructive',
      });
    } finally {
      setIsClockingIn(false);
    }
  };

  const fetchTodayAttendance = async () => {
    if (!employee.id) return;
    
    try {
      // Get today's date in YYYY-MM-DD format
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Query the employee_clock_in_out table for today's record
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .select('*')
        .eq('nhan_vien_id', employee.id)
        .eq('ngay', today)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is code for "no rows returned"
        console.error('Error fetching attendance:', error);
        return;
      }
      
      if (data) {
        setAttendanceRecord(data);
      }
    } catch (error) {
      console.error('Error fetching today attendance:', error);
    }
  };

  const formatTimeForDisplay = (time: Date) => {
    return format(time, 'HH:mm:ss', { locale: vi });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Chấm công hôm nay</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-bold">{formatTimeForDisplay(currentTime)}</p>
          <p className="text-sm text-muted-foreground">
            {format(currentTime, 'EEEE, dd/MM/yyyy', { locale: vi })}
          </p>
        </div>
        
        <div className="space-y-2">
          {!attendanceRecord || attendanceRecord.trang_thai !== 'active' ? (
            <Button 
              className="w-full" 
              onClick={handleClockIn} 
              disabled={isClockingIn || (attendanceRecord && attendanceRecord.trang_thai === 'completed')}
            >
              <Clock className="h-4 w-4 mr-2" />
              Chấm công vào
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={handleClockOut} 
              disabled={isClockingIn}
              variant="outline"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Chấm công ra
            </Button>
          )}
        </div>
        
        {attendanceRecord && (
          <div className="text-sm space-y-1 border rounded p-2">
            <p className="font-medium">Trạng thái: 
              <span className={attendanceRecord.trang_thai === 'completed' ? 'text-green-500' : 'text-blue-500'} style={{marginLeft: '5px'}}>
                {attendanceRecord.trang_thai === 'completed' ? 'Đã hoàn thành' : 'Đang làm việc'}
              </span>
            </p>
            {attendanceRecord.thoi_gian_bat_dau && (
              <p>Giờ vào: {attendanceRecord.thoi_gian_bat_dau}</p>
            )}
            {attendanceRecord.thoi_gian_ket_thuc && (
              <p>Giờ ra: {attendanceRecord.thoi_gian_ket_thuc}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayAttendance;
