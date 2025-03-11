
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
import { EmployeeClockInOut } from '@/lib/types/employee-clock-in-out';

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
      
      // Convert EmployeeClockInOut[] to AttendanceRecord[]
      const convertedData: AttendanceRecord[] = data.map((record: EmployeeClockInOut) => ({
        id: record.id,
        ngay: record.ngay,
        nhan_vien_id: record.nhan_vien_id,
        thoi_gian_bat_dau: record.thoi_gian_bat_dau,
        thoi_gian_ket_thuc: record.thoi_gian_ket_thuc,
        trang_thai: record.trang_thai || 'pending', // Set default value for required property
        ghi_chu: record.ghi_chu,
        xac_nhan: record.xac_nhan || false,
        employee_name: record.employee_name,
      }));
      
      setAttendance(convertedData);
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
      return <Badge variant="outline" className="text-xs px-1 py-0">Chưa xác nhận</Badge>;
    }
    
    switch (status) {
      case 'present':
        return <Badge variant="success" className="text-xs px-1 py-0">Có mặt</Badge>;
      case 'late':
        return <Badge variant="warning" className="text-xs px-1 py-0">Đi muộn</Badge>;
      case 'absent':
        return <Badge variant="destructive" className="text-xs px-1 py-0">Vắng mặt</Badge>;
      default:
        return <Badge variant="outline" className="text-xs px-1 py-0">Không xác định</Badge>;
    }
  };

  // Format time for display
  const formatTime = (time?: string) => {
    if (!time) return '';
    return time.substring(0, 5); // Extract HH:MM
  };

  // Group records for a specific employee and date by session (morning/afternoon)
  const groupRecordsBySession = (employeeId: string, date: string) => {
    if (!groupedAttendance[employeeId]) return null;
    
    const recordsForDate = groupedAttendance[employeeId].records.filter(
      record => record.ngay === date
    );
    
    if (recordsForDate.length === 0) return null;
    
    // Group into morning (before 12:00) and afternoon (after 12:00)
    const result = {
      morning: [] as AttendanceRecord[],
      afternoon: [] as AttendanceRecord[],
    };
    
    recordsForDate.forEach(record => {
      if (record.thoi_gian_bat_dau) {
        // Parse time to determine if it's morning or afternoon
        const hour = parseInt(record.thoi_gian_bat_dau.split(':')[0], 10);
        if (hour < 12) {
          result.morning.push(record);
        } else {
          result.afternoon.push(record);
        }
      }
    });
    
    return result;
  };

  // Render attendance record for a specific employee and date
  const renderEmployeeAttendanceForDate = (employeeId: string, date: string) => {
    const groupedRecords = groupRecordsBySession(employeeId, date);
    
    if (!groupedRecords) {
      return (
        <div className="text-center text-muted-foreground text-sm">
          -
        </div>
      );
    }
    
    return (
      <div className="space-y-1 p-1">
        {/* Morning records */}
        {groupedRecords.morning.length > 0 && (
          <div className="text-xs">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-muted-foreground">
                <Clock8 className="h-3 w-3 mr-1" />
                <span>
                  {groupedRecords.morning.map(record => 
                    `${formatTime(record.thoi_gian_bat_dau)} - ${formatTime(record.thoi_gian_ket_thuc)}`
                  ).join(', ')}
                </span>
              </div>
              <span>
                {getStatusBadge(
                  groupedRecords.morning[0].trang_thai, 
                  groupedRecords.morning[0].xac_nhan
                )}
              </span>
            </div>
          </div>
        )}
        
        {/* Afternoon records */}
        {groupedRecords.afternoon.length > 0 && (
          <div className={`text-xs ${groupedRecords.morning.length > 0 ? 'pt-1 border-t' : ''}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-muted-foreground">
                <Clock4 className="h-3 w-3 mr-1" />
                <span>
                  {groupedRecords.afternoon.map(record => 
                    `${formatTime(record.thoi_gian_bat_dau)} - ${formatTime(record.thoi_gian_ket_thuc)}`
                  ).join(', ')}
                </span>
              </div>
              <span>
                {getStatusBadge(
                  groupedRecords.afternoon[0].trang_thai, 
                  groupedRecords.afternoon[0].xac_nhan
                )}
              </span>
            </div>
          </div>
        )}
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
                    <TableHead className="min-w-40 sticky left-0 bg-background z-10">Nhân viên</TableHead>
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
                      <TableCell className="font-medium sticky left-0 bg-background z-10">
                        <div className="flex flex-col">
                          <span>{name}</span>
                          <span className="text-xs text-muted-foreground">
                            {records.filter(r => r.trang_thai === 'present' && r.xac_nhan).length} ngày có mặt
                          </span>
                        </div>
                      </TableCell>
                      {uniqueDates.map(date => (
                        <TableCell key={`${employeeId}-${date}`} className="p-1">
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
