
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { employeeClockInService } from '@/lib/supabase';
import { Clock } from 'lucide-react';
import { EmployeeClockInOut } from '@/lib/types/employee-clock-in-out';
import AttendanceHeader from './components/AttendanceHeader';
import AttendanceTable, { GroupedAttendance as AttendanceTableGroupedAttendance } from './components/AttendanceTable';

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

  // Transform our GroupedAttendance to AttendanceTable's GroupedAttendance format
  const transformGroupedAttendance = (groupedData: GroupedAttendance, dates: string[]): AttendanceTableGroupedAttendance => {
    const transformed: AttendanceTableGroupedAttendance = {};
    
    Object.entries(groupedData).forEach(([employeeId, data]) => {
      transformed[employeeId] = {
        employee: {
          id: employeeId,
          name: data.name,
        },
        dates: {}
      };
      
      // Initialize all dates with null/default values
      dates.forEach(date => {
        transformed[employeeId].dates[date] = {
          id: null,
          status: 'pending',
          note: null
        };
      });
      
      // Fill in actual data where available
      data.records.forEach(record => {
        if (record.ngay && dates.includes(record.ngay)) {
          transformed[employeeId].dates[record.ngay] = {
            id: record.id,
            status: record.trang_thai,
            note: record.ghi_chu || null
          };
        }
      });
    });
    
    return transformed;
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
  const transformedAttendance = transformGroupedAttendance(groupedAttendance, uniqueDates);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <AttendanceHeader 
            month={month}
            setMonth={setMonth}
            year={year}
            setYear={setYear}
            onFetch={fetchAttendanceData}
          />
        </CardHeader>
        <CardContent>
          <AttendanceTable 
            groupedAttendance={transformedAttendance}
            uniqueDates={uniqueDates}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeAttendance;
