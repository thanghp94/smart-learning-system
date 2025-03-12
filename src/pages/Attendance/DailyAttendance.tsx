
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { employeeClockInService } from '@/lib/supabase/employee-clock-in-service';
import { useToast } from '@/hooks/use-toast';
import { DataTable } from '@/components/ui/DataTable';
import ExportButton from '@/components/ui/ExportButton';

const DailyAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDailyAttendance = async (date: Date) => {
    setIsLoading(true);
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      const data = await employeeClockInService.getDailyReport(dateString);
      setAttendanceData(data);

      // Process data to show morning/afternoon shifts in a compact way
      const groupedByEmployee = data.reduce((acc, item) => {
        const employeeId = item.nhan_vien_id || item.employee_id;
        if (!acc[employeeId]) {
          acc[employeeId] = {
            employee_id: employeeId,
            employee_name: item.employee_name,
            employee_image: item.employee_image,
            position: item.position,
            department: item.department,
            shifts: [],
            trang_thai: item.trang_thai
          };
        }
        
        const shiftTime = item.thoi_gian_bat_dau && item.thoi_gian_ket_thuc ? 
          `${item.thoi_gian_bat_dau.substring(0, 5)}-${item.thoi_gian_ket_thuc.substring(0, 5)}` :
          (item.thoi_gian_bat_dau ? `${item.thoi_gian_bat_dau.substring(0, 5)}-?` : 
           (item.thoi_gian_ket_thuc ? `?-${item.thoi_gian_ket_thuc.substring(0, 5)}` : 'N/A'));
        
        acc[employeeId].shifts.push({
          shift_time: shiftTime,
          class_name: item.class_name,
          ghi_chu: item.ghi_chu,
          trang_thai: item.trang_thai
        });
        
        return acc;
      }, {});
      
      const processed = Object.values(groupedByEmployee);
      setProcessedData(processed);
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
      title: 'Giờ làm việc',
      key: 'shifts',
      render: (value: any[], record: any) => (
        <div className="space-y-1">
          {value.map((shift, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-1 last:border-0 last:pb-0">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                <span className="text-sm">{shift.shift_time}</span>
              </div>
              {shift.class_name && (
                <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded ml-2">{shift.class_name}</span>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'trang_thai',
      sortable: true,
      render: (value: string) => getStatusBadge(value),
    },
    {
      title: 'Ghi chú',
      key: 'ghi_chu',
      render: (value: string, record: any) => {
        const allNotes = record.shifts.map(s => s.ghi_chu).filter(Boolean);
        return allNotes.length > 0 ? 
          allNotes.join(', ') : 
          'Không có ghi chú';
      },
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
          data={processedData}
          isLoading={isLoading}
          searchable
          searchPlaceholder="Tìm kiếm nhân viên..."
        />
        
        {!isLoading && processedData.length === 0 && (
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
