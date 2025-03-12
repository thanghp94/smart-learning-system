import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { useToast } from '@/hooks/use-toast';
import { attendanceService } from '@/lib/supabase';
import { format } from 'date-fns';

const StudentAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const data = await attendanceService.getDailyAttendance(formattedDate);
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu điểm danh',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };

  const columns = [
    {
      title: 'Học sinh',
      key: 'student_name',
      sortable: true,
    },
    {
      title: 'Lớp',
      key: 'class_name',
      sortable: true,
    },
    {
      title: 'Thời gian',
      key: 'attendance_time',
      sortable: true,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'present' ? 'success' : 'destructive'}>
          {value === 'present' ? 'Có mặt' : 'Vắng'}
        </Badge>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-semibold">
          Điểm danh học sinh
        </CardTitle>
        <div className="space-x-2">
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={handleDateChange}
          />
          <Button onClick={fetchAttendance} disabled={isLoading}>
            {isLoading ? 'Đang tải...' : 'Tải lại'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={attendanceData} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
};

export default StudentAttendance;
