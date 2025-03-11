
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, CalendarDays, Clock8, Clock4 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { employeeClockInService } from '@/lib/supabase';
import { format, isToday, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

interface EmployeeAttendanceProps {
  // Add props if needed
}

interface AttendanceRecord {
  id: string;
  ngay: string;
  nhan_vien_id: string;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  trang_thai: string;
  ghi_chu?: string;
  xac_nhan: boolean;
  employee_name?: string;
  session?: string;
}

type GroupedAttendance = {
  [key: string]: {
    name: string;
    records: AttendanceRecord[];
  }
};

const EmployeeAttendance: React.FC<EmployeeAttendanceProps> = () => {
  const [month, setMonth] = useState<string>(String(new Date().getMonth() + 1));
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch attendance data when month or year changes
  useEffect(() => {
    fetchAttendanceData();
  }, [month, year]);

  const fetchAttendanceData = async () => {
    try {
      setIsLoading(true);
      const data = await employeeClockInService.getMonthlyAttendance(parseInt(month), parseInt(year));
      setAttendance(data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu chấm công',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Group attendance records by employee
  const groupAttendanceByEmployee = (records: AttendanceRecord[]): GroupedAttendance => {
    const grouped: GroupedAttendance = {};
    
    records.forEach(record => {
      const employeeId = record.nhan_vien_id;
      
      if (!grouped[employeeId]) {
        grouped[employeeId] = {
          name: record.employee_name || 'Nhân viên không xác định',
          records: []
        };
      }
      
      grouped[employeeId].records.push(record);
    });
    
    return grouped;
  };

  const groupedAttendance = groupAttendanceByEmployee(attendance);

  // Get unique dates from all records
  const getUniqueDates = (): string[] => {
    const dates = new Set<string>();
    
    attendance.forEach(record => {
      if (record.ngay) {
        dates.add(record.ngay);
      }
    });
    
    return Array.from(dates).sort();
  };

  const uniqueDates = getUniqueDates();

  // Get status badge for attendance record
  const getStatusBadge = (status: string, isVerified: boolean) => {
    if (!isVerified) {
      return <Badge variant="outline">Chưa xác nhận</Badge>;
    }
    
    switch (status) {
      case 'present':
        return <Badge variant="success">Có mặt</Badge>;
      case 'late':
        return <Badge variant="warning">Đi muộn</Badge>;
      case 'absent':
        return <Badge variant="destructive">Vắng mặt</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  // Format time for display
  const formatTime = (time?: string) => {
    if (!time) return '';
    return time.substring(0, 5); // Extract HH:MM
  };

  // Render attendance record for a specific employee and date
  const renderEmployeeAttendanceForDate = (employeeId: string, date: string) => {
    if (!groupedAttendance[employeeId]) return null;
    
    const recordsForDate = groupedAttendance[employeeId].records.filter(
      record => record.ngay === date
    );
    
    if (recordsForDate.length === 0) {
      return (
        <div className="text-center text-muted-foreground text-sm">
          -
        </div>
      );
    }
    
    // Sort records by start time
    recordsForDate.sort((a, b) => {
      if (!a.thoi_gian_bat_dau) return 1;
      if (!b.thoi_gian_bat_dau) return -1;
      return a.thoi_gian_bat_dau.localeCompare(b.thoi_gian_bat_dau);
    });
    
    return (
      <div className="space-y-1">
        {recordsForDate.map((record, index) => (
          <div key={record.id} className={index > 0 ? "pt-1 border-t text-sm" : "text-sm"}>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-muted-foreground">
                {index === 0 ? <Clock8 className="h-3 w-3 mr-1" /> : <Clock4 className="h-3 w-3 mr-1" />}
                <span>
                  {formatTime(record.thoi_gian_bat_dau)} 
                  {record.thoi_gian_ket_thuc ? ` - ${formatTime(record.thoi_gian_ket_thuc)}` : ''}
                </span>
              </div>
              <span className="text-xs">
                {getStatusBadge(record.trang_thai, record.xac_nhan)}
              </span>
            </div>
            {record.session && (
              <div className="text-xs text-muted-foreground mt-1">
                {record.session}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Chấm công nhân viên
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Select
                value={month}
                onValueChange={setMonth}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Tháng" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <SelectItem key={m} value={String(m)}>
                      Tháng {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={year}
                onValueChange={setYear}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Năm" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                    <SelectItem key={y} value={String(y)}>
                      Năm {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button size="sm" variant="outline" onClick={fetchAttendanceData}>
                <CalendarDays className="h-4 w-4 mr-1" />
                Xem
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-60 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">Đang tải dữ liệu...</span>
              </div>
            </div>
          ) : Object.keys(groupedAttendance).length === 0 ? (
            <div className="h-60 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Không có dữ liệu chấm công trong tháng này</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-40 sticky left-0 bg-background">Nhân viên</TableHead>
                    {uniqueDates.map(date => (
                      <TableHead key={date} className="text-center min-w-28">
                        <div className={`flex flex-col items-center ${isToday(parseISO(date)) ? 'text-primary font-bold' : ''}`}>
                          <span>{format(parseISO(date), 'dd/MM')}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(parseISO(date), 'EEEE', { locale: vi })}
                          </span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(groupedAttendance).map(([employeeId, { name, records }]) => (
                    <TableRow key={employeeId}>
                      <TableCell className="font-medium sticky left-0 bg-background">
                        <div className="flex flex-col">
                          <span>{name}</span>
                          <span className="text-xs text-muted-foreground">
                            {records.filter(r => r.trang_thai === 'present' && r.xac_nhan).length} ngày có mặt
                          </span>
                        </div>
                      </TableCell>
                      {uniqueDates.map(date => (
                        <TableCell key={`${employeeId}-${date}`} className="p-2">
                          {renderEmployeeAttendanceForDate(employeeId, date)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeAttendance;
