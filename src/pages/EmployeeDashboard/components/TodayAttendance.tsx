import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { employeeClockInService } from '@/lib/supabase';
import { EmployeeClockInOut } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface TodayAttendanceProps {
  employeeId: string;
}

const TodayAttendance: React.FC<TodayAttendanceProps> = ({ employeeId }) => {
  const [userAttendance, setUserAttendance] = useState<EmployeeClockInOut[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserAttendance();
  }, [employeeId]);

  const fetchUserAttendance = async () => {
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const attendanceData = await employeeClockInService.getTodayAttendance(employeeId, today);
      setUserAttendance(attendanceData ? [attendanceData] : []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu điểm danh",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      setIsLoading(true);
      const clockInData = await employeeClockInService.clockIn(employeeId);
      setUserAttendance([clockInData]);
      toast({
        title: "Thành công",
        description: "Đã điểm danh vào ca",
      });
    } catch (error) {
      console.error('Error clocking in:', error);
      toast({
        title: "Lỗi",
        description: "Không thể điểm danh vào ca",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setIsLoading(true);
      const clockOutData = await employeeClockInService.clockOut(employeeId);
      setUserAttendance([clockOutData]);
      toast({
        title: "Thành công",
        description: "Đã điểm danh ra ca",
      });
    } catch (error) {
      console.error('Error clocking out:', error);
      toast({
        title: "Lỗi",
        description: "Không thể điểm danh ra ca",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Điểm danh hôm nay</CardTitle>
      </CardHeader>
      <CardContent>
        {userAttendance.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Giờ vào:</p>
                <p className="text-lg font-semibold">
                  {userAttendance[0].gio_vao ? format(new Date(userAttendance[0].gio_vao), 'HH:mm') : '--:--'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Giờ ra:</p>
                <p className="text-lg font-semibold">
                  {userAttendance[0].gio_ra ? format(new Date(userAttendance[0].gio_ra), 'HH:mm') : '--:--'}
                </p>
              </div>
              <Badge variant={userAttendance[0].trang_thai === 'present' ? 'success' : 'secondary'}>
                {userAttendance[0].trang_thai === 'present' ? 'Có mặt' : 'Chưa điểm danh'}
              </Badge>
            </div>
            {!userAttendance[0].gio_ra && (
              <Button 
                className="w-full" 
                onClick={handleClockOut}
                disabled={isLoading}
              >
                Điểm danh ra ca
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Bạn chưa điểm danh hôm nay</p>
            <Button 
              className="w-full" 
              onClick={handleClockIn}
              disabled={isLoading}
            >
              Điểm danh vào ca
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayAttendance;
