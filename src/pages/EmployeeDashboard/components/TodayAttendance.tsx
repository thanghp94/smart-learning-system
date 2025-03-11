
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock, LogIn, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { employeeClockInService } from '@/lib/supabase/employee-clock-in-service';
import { format } from 'date-fns';
import { EmployeeClockInOut } from '@/lib/types';

interface TodayAttendanceProps {
  employeeId: string;
}

const TodayAttendance: React.FC<TodayAttendanceProps> = ({ employeeId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceRecord, setAttendanceRecord] = useState<EmployeeClockInOut | null>(null);
  const [note, setNote] = useState('');
  const { toast } = useToast();
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchTodayAttendance();
  }, [employeeId]);

  const handleClockIn = async () => {
    if (!employeeId) return;
    
    setIsLoading(true);
    try {
      const record = await employeeClockInService.create({
        nhan_vien_id: employeeId,
        ngay: today,
        thoi_gian_bat_dau: format(new Date(), 'HH:mm'),
        ghi_chu: note,
        trang_thai: 'present'
      });
      
      setAttendanceRecord(record);
      toast({
        title: 'Đã chấm công vào',
        description: `Thời gian: ${format(new Date(), 'HH:mm')}`,
      });
    } catch (error) {
      console.error('Error clocking in:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể chấm công vào. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!attendanceRecord) return;
    
    setIsLoading(true);
    try {
      const updatedRecord = await employeeClockInService.update(attendanceRecord.id, {
        thoi_gian_ket_thuc: format(new Date(), 'HH:mm'),
        ghi_chu: note || attendanceRecord.ghi_chu,
      });
      
      setAttendanceRecord(updatedRecord);
      toast({
        title: 'Đã chấm công ra',
        description: `Thời gian: ${format(new Date(), 'HH:mm')}`,
      });
    } catch (error) {
      console.error('Error clocking out:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể chấm công ra. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTodayAttendance = async () => {
    if (!employeeId) return;
    
    setIsLoading(true);
    try {
      const records = await employeeClockInService.getByDateRange(today, today);
      const employeeRecord = records.find(
        (record) => record.nhan_vien_id === employeeId
      );
      
      if (employeeRecord) {
        setAttendanceRecord(employeeRecord);
        setNote(employeeRecord.ghi_chu || '');
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Chấm công hôm nay
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="attendance-note">Ghi chú</Label>
            <Input
              id="attendance-note"
              placeholder="Nhập ghi chú"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          
          {attendanceRecord && (
            <div className="bg-muted p-3 rounded-md space-y-1">
              <p className="text-sm flex justify-between">
                <span>Ngày:</span>
                <span>{format(new Date(attendanceRecord.ngay), 'dd/MM/yyyy')}</span>
              </p>
              {attendanceRecord.thoi_gian_bat_dau && (
                <p className="text-sm flex justify-between">
                  <span>Giờ vào:</span>
                  <span>{attendanceRecord.thoi_gian_bat_dau}</span>
                </p>
              )}
              {attendanceRecord.thoi_gian_ket_thuc && (
                <p className="text-sm flex justify-between">
                  <span>Giờ ra:</span>
                  <span>{attendanceRecord.thoi_gian_ket_thuc}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handleClockIn}
          disabled={isLoading || !!attendanceRecord?.thoi_gian_bat_dau}
          className="w-1/2 mr-2"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Chấm công vào
        </Button>
        <Button
          onClick={handleClockOut}
          disabled={
            isLoading || 
            !attendanceRecord || 
            !attendanceRecord.thoi_gian_bat_dau || 
            !!attendanceRecord.thoi_gian_ket_thuc
          }
          className="w-1/2"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Chấm công ra
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TodayAttendance;
