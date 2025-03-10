
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, PlusCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { EmployeeClockInOut, MonthlyAttendanceSummary } from '@/lib/types/employee-clock-in-out';
import AddAttendanceForm from './AddAttendanceForm';

interface MonthlyAttendanceViewProps {
  month: number;
  year: number;
}

interface AttendanceRecord {
  employee_id: string;
  employee_name: string;
  records: {
    [day: number]: {
      status: string;
      time_in?: string;
      time_out?: string;
    };
  };
  summary: {
    present: number;
    absent: number;
    late: number;
  };
}

const MonthlyAttendanceView: React.FC<MonthlyAttendanceViewProps> = ({ month, year }) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAttendanceData();
    
    // Calculate days in month
    const date = new Date(year, month - 1, 1);
    const days = [];
    const lastDay = new Date(year, month, 0).getDate();
    
    for (let i = 1; i <= lastDay; i++) {
      days.push(i);
    }
    
    setDaysInMonth(days);
  }, [month, year]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      // Call the stored function to get monthly attendance data
      const { data, error } = await supabase.rpc(
        'get_monthly_attendance_summary',
        { p_month: month, p_year: year }
      );

      if (error) {
        throw error;
      }

      // Process data for component state
      const groupedData: Record<string, AttendanceRecord> = {};
      
      data.forEach((record: MonthlyAttendanceSummary) => {
        const employeeId = record.employee_id;
        
        if (!groupedData[employeeId]) {
          groupedData[employeeId] = {
            employee_id: employeeId,
            employee_name: record.employee_name,
            records: {},
            summary: {
              present: record.present_count || 0,
              absent: record.absent_count || 0,
              late: record.late_count || 0
            }
          };
        }
        
        groupedData[employeeId].records[record.day_of_month] = {
          status: record.status
        };
      });
      
      setAttendanceData(Object.values(groupedData));
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
      const { error } = await supabase
        .from('employee_clock_in_out')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã thêm dữ liệu chấm công',
      });
      setShowDialog(false);
      await fetchAttendanceData(); // Refresh the data
    } catch (error) {
      console.error('Error adding attendance:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm dữ liệu chấm công',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Có mặt</Badge>;
      case 'absent':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Vắng</Badge>;
      case 'late':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Muộn</Badge>;
      case 'leave':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Nghỉ phép</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100">-</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h2 className="text-xl font-semibold">
            Chấm công tháng {month}/{year}
          </h2>
        </div>
        
        <Button onClick={() => setShowDialog(true)} className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Thêm chấm công
        </Button>
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
        <div className="overflow-x-auto">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10">Nhân viên</TableHead>
                {daysInMonth.map(day => (
                  <TableHead key={day} className="text-center min-w-[60px]">
                    {day}
                  </TableHead>
                ))}
                <TableHead className="text-center">Tổng số</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map(employee => (
                <TableRow key={employee.employee_id}>
                  <TableCell className="font-medium sticky left-0 bg-background z-10">
                    {employee.employee_name}
                  </TableCell>
                  {daysInMonth.map(day => {
                    const record = employee.records[day];
                    return (
                      <TableCell key={day} className="text-center p-2">
                        {record ? getStatusBadge(record.status) : <span className="text-gray-300">-</span>}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center">
                    <div className="text-xs space-y-1">
                      <div className="text-green-600">Có mặt: {employee.summary.present}</div>
                      <div className="text-yellow-600">Muộn: {employee.summary.late}</div>
                      <div className="text-red-600">Vắng: {employee.summary.absent}</div>
                    </div>
                  </TableCell>
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
