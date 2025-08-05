
import React, { useState, useEffect } from 'react';
import { format, getDaysInMonth, getMonth, getYear, isWeekend } from 'date-fns';
import { vi } from 'date-fns/locale';
import { employeeClockInService } from "@/lib/database";
import { EmployeeClockInOut } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import TablePageLayout from '@/components/common/TablePageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import * as XLSX from 'xlsx';

interface EmployeeAttendance {
  id: string;
  name: string;
  dailyStatus: Record<number, string>;
  presentCount: number;
  absentCount: number;
  lateCount: number;
}

const MonthlyAttendanceSummary = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceSummary, setAttendanceSummary] = useState<EmployeeAttendance[]>([]);
  const { toast } = useToast();
  
  const currentMonth = getMonth(selectedDate);
  const currentYear = getYear(selectedDate);
  const daysInMonth = getDaysInMonth(selectedDate);
  
  useEffect(() => {
    fetchMonthlyAttendance();
  }, [selectedDate]);
  
  const fetchMonthlyAttendance = async () => {
    setIsLoading(true);
    try {
      // Fetch all clock in/out records
      const allRecords = await employeeClockInService.getEmployeeClockIns();
      
      if (!allRecords || !Array.isArray(allRecords)) {
        toast({
          title: "Lỗi dữ liệu",
          description: "Không thể tải dữ liệu chấm công",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Filter records for the selected month
      const monthStart = new Date(currentYear, currentMonth, 1);
      const monthEnd = new Date(currentYear, currentMonth, daysInMonth);
      
      const monthRecords = allRecords.filter((record: EmployeeClockInOut) => {
        const recordDate = new Date(record.ngay);
        return recordDate >= monthStart && recordDate <= monthEnd;
      });
      
      // Group by employee
      const employeeMap = new Map<string, EmployeeClockInOut[]>();
      
      monthRecords.forEach((record: EmployeeClockInOut) => {
        if (!employeeMap.has(record.nhan_vien_id)) {
          employeeMap.set(record.nhan_vien_id, []);
        }
        employeeMap.get(record.nhan_vien_id)?.push(record);
      });
      
      // Create summary data
      const summary: EmployeeAttendance[] = [];
      
      employeeMap.forEach((records, employeeId) => {
        const dailyStatus: Record<number, string> = {};
        let presentCount = 0;
        let absentCount = 0;
        let lateCount = 0;
        
        // Initialize all days to empty
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(currentYear, currentMonth, day);
          if (isWeekend(date)) {
            dailyStatus[day] = 'weekend';
          } else {
            dailyStatus[day] = 'unknown';
          }
        }
        
        // Fill in status for days with records
        records.forEach(record => {
          const day = new Date(record.ngay).getDate();
          
          if (record.trang_thai === 'present') {
            dailyStatus[day] = 'present';
            presentCount++;
          } else if (record.trang_thai === 'absent') {
            dailyStatus[day] = 'absent';
            absentCount++;
          } else if (record.trang_thai === 'late') {
            dailyStatus[day] = 'late';
            lateCount++;
          } else {
            dailyStatus[day] = record.trang_thai || 'unknown';
          }
        });
        
        // Get the employee name
        const employeeName = records[0]?.employee_name || `Nhân viên ${employeeId.substring(0, 5)}`;
        
        summary.push({
          id: employeeId,
          name: employeeName,
          dailyStatus,
          presentCount,
          absentCount,
          lateCount
        });
      });
      
      setAttendanceSummary(summary);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu chấm công:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu chấm công. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'weekend':
        return 'bg-gray-100 text-gray-500';
      default:
        return 'bg-gray-50 text-gray-400';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'C';
      case 'absent':
        return 'V';
      case 'late':
        return 'M';
      case 'weekend':
        return '-';
      default:
        return '?';
    }
  };
  
  const exportToExcel = () => {
    // Prepare data for export
    const exportData = attendanceSummary.map(employee => {
      const row: Record<string, any> = {
        'Nhân viên': employee.name,
      };
      
      // Add day columns
      for (let day = 1; day <= daysInMonth; day++) {
        row[`${day}`] = getStatusLabel(employee.dailyStatus[day]);
      }
      
      // Add summary columns
      row['Có mặt'] = employee.presentCount;
      row['Vắng'] = employee.absentCount;
      row['Muộn'] = employee.lateCount;
      
      return row;
    });
    
    // Create workbook
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Chấm công tháng');
    
    // Generate and download file
    XLSX.writeFile(wb, `Chấm công tháng ${currentMonth + 1}-${currentYear}.xlsx`);
    
    toast({
      title: "Xuất báo cáo thành công",
      description: `Đã xuất báo cáo chấm công tháng ${currentMonth + 1}-${currentYear}`,
    });
  };
  
  return (
    <TablePageLayout
      title="Tổng hợp chấm công tháng"
      description={`Báo cáo chấm công tháng ${currentMonth + 1}/${currentYear}`}
      actions={
        <Button onClick={exportToExcel} className="h-9">
          <Download className="h-4 w-4 mr-2" /> Xuất Excel
        </Button>
      }
      filters={
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {format(selectedDate, 'MMMM yyyy', { locale: vi })}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      }
    >
      <Card>
        <CardContent className="p-0 overflow-auto">
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="h-64 w-full" />
            </div>
          ) : attendanceSummary.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Không có dữ liệu chấm công cho tháng này
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-muted sticky left-0 z-10">Nhân viên</TableHead>
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const date = new Date(currentYear, currentMonth, day);
                      const isWeekendDay = isWeekend(date);
                      
                      return (
                        <TableHead 
                          key={day} 
                          className={`text-center w-10 ${isWeekendDay ? 'bg-muted/50' : ''}`}
                        >
                          {day}
                        </TableHead>
                      );
                    })}
                    <TableHead className="text-center bg-muted/30">Có mặt</TableHead>
                    <TableHead className="text-center bg-muted/30">Vắng</TableHead>
                    <TableHead className="text-center bg-muted/30">Muộn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceSummary.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium sticky left-0 bg-white z-10">
                        {employee.name}
                      </TableCell>
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const status = employee.dailyStatus[day];
                        
                        return (
                          <TableCell key={day} className="p-1 text-center">
                            <div 
                              className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-medium ${getStatusColor(status)}`}
                              title={status}
                            >
                              {getStatusLabel(status)}
                            </div>
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center">
                        <Badge variant="success">{employee.presentCount}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="destructive">{employee.absentCount}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="warning">{employee.lateCount}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-1">C</div>
            <span>Có mặt</span>
          </div>
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-1">V</div>
            <span>Vắng mặt</span>
          </div>
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-1">M</div>
            <span>Đi muộn</span>
          </div>
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 mr-1">-</div>
            <span>Cuối tuần</span>
          </div>
        </div>
      </div>
    </TablePageLayout>
  );
};

export default MonthlyAttendanceSummary;
