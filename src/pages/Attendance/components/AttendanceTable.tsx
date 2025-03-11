
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock8, Clock4 } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

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

interface GroupedAttendance {
  [key: string]: {
    name: string;
    records: AttendanceRecord[];
  }
}

interface AttendanceTableProps {
  groupedAttendance: GroupedAttendance;
  uniqueDates: string[];
  isLoading: boolean;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  groupedAttendance,
  uniqueDates,
  isLoading
}) => {
  // Format time for display
  const formatTime = (time?: string) => {
    if (!time) return '';
    return time.substring(0, 5); // Extract HH:MM
  };

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

  if (isLoading) {
    return (
      <div className="h-60 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (Object.keys(groupedAttendance).length === 0) {
    return (
      <div className="h-60 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Không có dữ liệu chấm công trong tháng này</p>
        </div>
      </div>
    );
  }

  return (
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
  );
};

export default AttendanceTable;
