
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { employeeClockInService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';

const TodayAttendanceCard = () => {
  const [attendance, setAttendance] = useState<any>(null);
  const { toast } = useToast();

  const handleClockIn = async () => {
    try {
      const newAttendance = await employeeClockInService.create({
        ngay: new Date().toISOString().split('T')[0],
        thoi_gian_bat_dau: new Date().toTimeString().split(' ')[0],
        trang_thai: 'present'
      });
      
      setAttendance(newAttendance);
      toast({
        title: 'Thành công',
        description: 'Đã chấm công thành công',
      });
    } catch (error) {
      console.error('Error clocking in:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể chấm công. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-4">
      {attendance ? (
        <div className="text-sm">
          <p>Đã chấm công lúc: {attendance.thoi_gian_bat_dau}</p>
          <p>Trạng thái: {attendance.trang_thai}</p>
        </div>
      ) : (
        <Button onClick={handleClockIn} className="w-full">
          <Clock className="mr-2 h-4 w-4" />
          Chấm công
        </Button>
      )}
    </div>
  );
};

export default TodayAttendanceCard;
