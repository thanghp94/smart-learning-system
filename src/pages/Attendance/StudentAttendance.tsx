
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, GraduationCap, BookOpen, Clock } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DataTable from '@/components/ui/DataTable';
import ExportButton from '@/components/ui/ExportButton';
import { Link } from 'react-router-dom';

const StudentAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchStudentAttendance = async (date: Date) => {
    setIsLoading(true);
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      
      // Fetch attendance records for the selected date
      const { data, error } = await supabase
        .from('attendances_with_details')
        .select('*')
        .eq('ngay_hoc', dateString);
      
      if (error) throw error;
      
      setAttendanceData(data || []);
    } catch (error) {
      console.error('Error fetching student attendance:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu điểm danh học sinh',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentAttendance(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handlePreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="success">Có mặt</Badge>;
      case 'absent':
        return <Badge variant="destructive">Vắng mặt</Badge>;
      case 'late':
        return <Badge variant="warning">Đi muộn</Badge>;
      default:
        return <Badge variant="outline">{status || 'Không xác định'}</Badge>;
    }
  };

  const columns = [
    {
      title: 'Học sinh',
      key: 'ten_hoc_sinh',
      sortable: true,
      render: (value: string, record: any) => (
        <Link to={`/students/${record.hoc_sinh_id}`} className="font-medium hover:underline">
          {value}
        </Link>
      ),
    },
    {
      title: 'Lớp học',
      key: 'ten_lop_full',
      sortable: true,
      render: (value: string, record: any) => (
        <Link to={`/classes/${record.lop_id}`} className="hover:underline">
          {value}
        </Link>
      ),
    },
    {
      title: 'Thời gian',
      key: 'thoi_gian_bat_dau',
      sortable: true,
      render: (value: string) => value ? value.substring(0, 5) : 'N/A',
    },
    {
      title: 'Điểm danh',
      key: 'status',
      sortable: true,
      render: (value: string) => getStatusBadge(value),
    },
    {
      title: 'Đi muộn',
      key: 'thoi_gian_tre',
      sortable: true,
      render: (value: number) => value ? `${value} phút` : '-',
    },
    {
      title: 'Ghi chú',
      key: 'ghi_chu',
      render: (value: string) => value || 'Không có ghi chú',
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            <span>Điểm danh học sinh ngày {format(selectedDate, 'dd/MM/yyyy', { locale: vi })}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Button variant="outline" size="sm" onClick={handlePreviousDay}>
                Trước
              </Button>
              <input
                type="date"
                className="border rounded px-2 py-1 mx-2"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={handleDateChange}
              />
              <Button variant="outline" size="sm" onClick={handleNextDay}>
                Sau
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleToday}>
              Hôm nay
            </Button>
            <ExportButton
              data={attendanceData}
              filename={`Diem_danh_hoc_sinh_${format(selectedDate, 'dd-MM-yyyy')}`}
              label="Xuất Excel"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={attendanceData}
          isLoading={isLoading}
          searchable
          searchPlaceholder="Tìm kiếm học sinh..."
          pagination
        />
        
        {!isLoading && attendanceData.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Không có dữ liệu điểm danh</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Không có dữ liệu điểm danh học sinh cho ngày {format(selectedDate, 'dd/MM/yyyy', { locale: vi })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentAttendance;
