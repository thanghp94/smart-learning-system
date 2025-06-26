
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { employeeClockInService } from '@/lib/supabase';
import { EmployeeClockInOut } from '@/lib/types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface TodayAttendanceProps {
  employeeId: string;
}

const formatTime = (timeString: string | null): string => {
  if (!timeString) return '--:--';
  return timeString.substring(0, 5); // Get only HH:MM part
};

const TodayAttendance: React.FC<TodayAttendanceProps> = ({ employeeId }) => {
  const [attendance, setAttendance] = useState<EmployeeClockInOut | null>(null);
  const [todayAttendances, setTodayAttendances] = useState<EmployeeClockInOut[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isClockedOut, setIsClockedOut] = useState(false);
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!employeeId) return;
      
      try {
        setIsLoading(true);
        const todayRecords = await employeeClockInService.getByEmployeeAndDate(employeeId, today);
        setTodayAttendances(todayRecords);
        
        if (todayRecords.length > 0) {
          // Get the latest record
          const latestRecord = todayRecords[0];
          setAttendance(latestRecord);
          setIsClockedIn(!!latestRecord.thoi_gian_bat_dau);
          setIsClockedOut(!!latestRecord.thoi_gian_ket_thuc);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu chấm công',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttendance();
  }, [employeeId, today, toast]);
  
  const handleClockIn = async () => {
    try {
      setIsLoading(true);
      const now = new Date();
      const timeString = format(now, 'HH:mm:ss');
      
      let newAttendance;
      if (!attendance) {
        // Create new record
        newAttendance = await employeeClockInService.create({
          nhan_vien_id: employeeId,
          ngay: today,
          thoi_gian_bat_dau: timeString,
          trang_thai: 'present'
        });
      } else {
        // Update existing record
        newAttendance = await employeeClockInService.update(attendance.id, {
          thoi_gian_bat_dau: timeString
        });
      }
      
      setAttendance(newAttendance);
      setIsClockedIn(true);
      
      toast({
        title: 'Thành công',
        description: 'Đã chấm công vào ca làm việc',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error clocking in:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể chấm công vào ca',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClockOut = async () => {
    if (!attendance || !attendance.id) {
      toast({
        title: 'Lỗi',
        description: 'Bạn chưa chấm công vào ca',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const now = new Date();
      const timeString = format(now, 'HH:mm:ss');
      
      const updatedAttendance = await employeeClockInService.update(attendance.id, {
        thoi_gian_ket_thuc: timeString
      });
      
      setAttendance(updatedAttendance);
      setIsClockedOut(true);
      
      toast({
        title: 'Thành công',
        description: 'Đã chấm công ra ca làm việc',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error clocking out:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể chấm công ra ca',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Chấm công hôm nay ({format(new Date(), 'dd/MM/yyyy', { locale: vi })})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Giờ vào:</span>
              <span className="font-medium">{attendance?.thoi_gian_bat_dau ? formatTime(attendance.thoi_gian_bat_dau) : '--:--'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Giờ ra:</span>
              <span className="font-medium">{attendance?.thoi_gian_ket_thuc ? formatTime(attendance.thoi_gian_ket_thuc) : '--:--'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Trạng thái:</span>
              {attendance ? (
                <Badge variant={attendance.trang_thai === 'present' ? 'success' : 'destructive'}>
                  {attendance.trang_thai === 'present' ? 'Có mặt' : 'Vắng mặt'}
                </Badge>
              ) : (
                <Badge variant="outline">Chưa chấm công</Badge>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              className="flex-1" 
              onClick={handleClockIn} 
              disabled={isLoading || isClockedIn}
              variant={isClockedIn ? "outline" : "default"}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              {isClockedIn ? 'Đã chấm công vào' : 'Chấm công vào'}
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleClockOut} 
              disabled={isLoading || !isClockedIn || isClockedOut}
              variant={isClockedOut ? "outline" : "default"}
            >
              <XCircle className="h-4 w-4 mr-1" />
              {isClockedOut ? 'Đã chấm công ra' : 'Chấm công ra'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayAttendance;
