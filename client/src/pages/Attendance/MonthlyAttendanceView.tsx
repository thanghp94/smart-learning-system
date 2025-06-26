
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import AddAttendanceForm from './AddAttendanceForm';

interface EmployeeAttendanceData {
  employee_id: string;
  employee_name: string;
  status: string;
  total_present: number;
  total_late: number;
  total_absent: number;
  daily_records: Record<number, {
    status: 'present' | 'absent' | 'late' | 'leave';
    clock_in_time?: string;
    clock_out_time?: string;
  }>;
}

const MonthlyAttendanceView = () => {
  const [attendanceData, setAttendanceData] = useState<EmployeeAttendanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const { toast } = useToast();

  useEffect(() => {
    fetchAttendanceData();

    // Calculate days in month
    const date = new Date(currentYear, currentMonth - 1, 1);
    const days = [];
    const lastDay = new Date(currentYear, currentMonth, 0).getDate();

    for (let i = 1; i <= lastDay; i++) {
      days.push(i);
    }

    setDaysInMonth(days);
  }, [currentMonth, currentYear]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      console.log("Fetching employee clock-in data for month:", currentMonth, "year:", currentYear);

      // Fetch employees first
      const employeesResponse = await fetch('/api/employees');
      if (!employeesResponse.ok) {
        throw new Error('Failed to fetch employees');
      }
      const employees = await employeesResponse.json();

      // Fetch clock-in data for the month
      const clockInResponse = await fetch(`/api/employee-clock-in?month=${currentMonth}&year=${currentYear}`);
      if (!clockInResponse.ok) {
        throw new Error('Failed to fetch clock-in data');
      }
      const clockInData = await clockInResponse.json();

      console.log("Received employees:", employees.length);
      console.log("Received clock-in data:", clockInData.length);

      // Process data for each employee
      const processedData: EmployeeAttendanceData[] = employees.map((employee: any) => {
        const employeeClockIns = clockInData.filter((record: any) => 
          record.employee_id === employee.id
        );

        const dailyRecords: Record<number, any> = {};
        let totalPresent = 0;
        let totalLate = 0;
        let totalAbsent = 0;

        // Process clock-in records
        employeeClockIns.forEach((record: any) => {
          const workDate = new Date(record.work_date);
          const day = workDate.getDate();
          
          if (day >= 1 && day <= 31) {
            let status: 'present' | 'absent' | 'late' | 'leave' = 'present';
            
            // Determine status based on clock-in time
            if (record.clock_in_time) {
              const clockInTime = new Date(`1970-01-01T${record.clock_in_time}`);
              const lateThreshold = new Date(`1970-01-01T09:00:00`); // 9 AM threshold
              
              if (clockInTime > lateThreshold) {
                status = 'late';
                totalLate++;
              } else {
                status = 'present';
                totalPresent++;
              }
            } else if (record.notes?.includes('nghỉ') || record.notes?.includes('leave')) {
              status = 'leave';
            } else {
              status = 'absent';
              totalAbsent++;
            }

            dailyRecords[day] = {
              status,
              clock_in_time: record.clock_in_time,
              clock_out_time: record.clock_out_time
            };
          }
        });

        // Fill in missing days as absent for working days
        for (let day = 1; day <= daysInMonth.length; day++) {
          if (!dailyRecords[day]) {
            const date = new Date(currentYear, currentMonth - 1, day);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            
            if (!isWeekend) {
              dailyRecords[day] = { status: 'absent' };
              totalAbsent++;
            }
          }
        }

        return {
          employee_id: employee.id,
          employee_name: employee.ten_nhan_su || employee.ho_va_ten || `Employee ${employee.id}`,
          status: `${totalPresent} ngày làm, ${totalLate} ngày trễ`,
          total_present: totalPresent,
          total_late: totalLate,
          total_absent: totalAbsent,
          daily_records: dailyRecords
        };
      });

      setAttendanceData(processedData);
    } catch (error) {
      console.error('Error fetching monthly attendance data:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu chấm công tháng',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttendance = async (formData: any) => {
    try {
      console.log("Adding attendance data:", formData);

      const response = await fetch('/api/employee-clock-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Error adding attendance:", error);
        throw new Error(error);
      }

      toast({
        title: 'Thành công',
        description: 'Đã thêm dữ liệu chấm công',
      });
      setShowDialog(false);
      await fetchAttendanceData(); // Refresh the data
    } catch (error: any) {
      console.error('Error adding attendance:', error);
      toast({
        title: 'Lỗi',
        description: `Không thể thêm dữ liệu chấm công: ${error.message || 'Đã xảy ra lỗi'}`,
        variant: 'destructive',
      });
    }
  };

  const getStatusCell = (record: any) => {
    if (!record) {
      return <span className="text-gray-300">-</span>;
    }

    switch (record.status) {
      case 'present':
        return (
          <div className="w-6 h-6 bg-green-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        );
      case 'late':
        return (
          <div className="w-6 h-6 bg-yellow-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        );
      case 'absent':
        return (
          <div className="w-6 h-6 bg-red-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">✗</span>
          </div>
        );
      case 'leave':
        return (
          <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
        );
      default:
        return <span className="text-gray-300">-</span>;
    }
  };

  const handleMonthChange = (value: string) => {
    setCurrentMonth(parseInt(value));
  };

  const handleYearChange = (value: string) => {
    setCurrentYear(parseInt(value));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h2 className="text-xl font-semibold">
            Chấm công tháng {currentMonth}/{currentYear}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <Select value={currentMonth.toString()} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Tháng" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <SelectItem key={month} value={month.toString()}>
                    Tháng {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={currentYear.toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Năm" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => setShowDialog(true)} className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Thêm chấm công
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
          <span>Có mặt</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
          <span>Muộn</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
          <span>Vắng</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
          <span>Nghỉ phép</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : attendanceData.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              Không có dữ liệu chấm công cho tháng này
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="sticky left-0 bg-gray-50 z-10 min-w-[150px] border-r">Tên nhân viên</TableHead>
                <TableHead className="min-w-[120px] border-r">Trạng thái</TableHead>
                <TableHead className="text-center min-w-[40px] border-r">Tổng giờ</TableHead>
                {daysInMonth.map(day => (
                  <TableHead key={day} className="text-center min-w-[30px] border-r text-xs">
                    {day}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map(employee => (
                <TableRow key={employee.employee_id} className="hover:bg-gray-50">
                  <TableCell className="font-medium sticky left-0 bg-white z-10 border-r">
                    {employee.employee_name}
                  </TableCell>
                  <TableCell className="text-xs border-r">
                    {employee.status}
                  </TableCell>
                  <TableCell className="text-center text-xs border-r">
                    {employee.total_present * 8}h
                  </TableCell>
                  {daysInMonth.map(day => (
                    <TableCell key={day} className="text-center p-1 border-r">
                      {getStatusCell(employee.daily_records[day])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm dữ liệu chấm công</DialogTitle>
          </DialogHeader>
          <AddAttendanceForm 
            onSubmit={handleAddAttendance} 
            onCancel={() => setShowDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonthlyAttendanceView;
