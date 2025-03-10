
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { employeeClockInService } from '@/lib/supabase/employee-clock-in-service';
import { useToast } from '@/hooks/use-toast';
import DataTable from '@/components/ui/DataTable';
import ExportButton from '@/components/ui/ExportButton';

const DailyAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDailyAttendance = async (date: Date) => {
    setIsLoading(true);
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      const data = await employeeClockInService.getDailyReport(dateString);
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching daily attendance:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu chấm công ngày',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyAttendance(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
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
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns = [
    {
      title: 'Nhân viên',
      key: 'employee_name',
      sortable: true,
      render: (value: string, record: any) => (
        <div className="flex items-center gap-2">
          {record.employee_image ? (
            <img 
              src={record.employee_image} 
              alt={value} 
              className="h-8 w-8 rounded-full object-cover" 
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
              <User className="h-4 w-4 text-slate-500" />
            </div>
          )}
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-muted-foreground">{record.position}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Bộ phận',
      key: 'department',
      sortable: true,
    },
    {
      title: 'Giờ vào',
      key: 'thoi_gian_bat_dau',
      sortable: true,
      render: (value: string) => value ? value.substring(0, 5) : 'N/A',
    },
    {
      title: 'Giờ ra',
      key: 'thoi_gian_ket_thuc',
      sortable: true,
      render: (value: string) => value ? value.substring(0, 5) : 'N/A',
    },
    {
      title: 'Trạng thái',
      key: 'trang_thai',
      sortable: true,
      render: (value: string) => getStatusBadge(value),
    },
    {
      title: 'Lớp học (nếu có)',
      key: 'class_name',
      sortable: true,
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
            <Calendar className="h-5 w-5" />
            <span>Chấm công ngày {format(selectedDate, 'dd/MM/yyyy', { locale: vi })}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={handleDateChange}
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleToday}>
              Hôm nay
            </Button>
            <ExportButton
              data={attendanceData}
              filename={`Cham_cong_ngay_${format(selectedDate, 'dd-MM-yyyy')}`}
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
          searchPlaceholder="Tìm kiếm nhân viên..."
          pagination
        />
        
        {!isLoading && attendanceData.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <UserCheck className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Không có dữ liệu chấm công</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Không có dữ liệu chấm công cho ngày {format(selectedDate, 'dd/MM/yyyy', { locale: vi })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyAttendance;
