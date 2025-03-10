
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, UserCheck, Clock, Filter, RotateCw } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { employeeClockInService } from '@/lib/supabase';
import { EmployeeClockIn } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/common/PageHeader';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

const AttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<EmployeeClockIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      setIsLoading(true);
      const data = await employeeClockInService.getAll();
      console.log("Attendance data received:", data);
      
      if (Array.isArray(data)) {
        // Make sure data is properly typed as EmployeeClockIn[]
        setAttendanceRecords(data);
      } else {
        console.error("Invalid attendance data format:", data);
        setAttendanceRecords([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu chấm công:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu chấm công. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      setAttendanceRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (record: EmployeeClockIn) => {
    // Navigate to detail or show detail panel
    toast({
      title: "Chi tiết chấm công",
      description: `Xem chi tiết chấm công của ${record.employee_name || 'nhân viên'}`,
    });
  };

  // Format time string to display format
  const formatTime = (timeString?: string) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const columns = [
    {
      title: "Nhân viên",
      key: "employee_name",
      sortable: true,
    },
    {
      title: "Ngày",
      key: "ngay_cham_cong",
      sortable: true,
      render: (value: string) => value ? format(new Date(value), 'dd/MM/yyyy') : 'N/A',
    },
    {
      title: "Giờ vào",
      key: "thoi_gian_vao",
      render: (value: string) => formatTime(value),
    },
    {
      title: "Giờ ra",
      key: "thoi_gian_ra",
      render: (value: string) => formatTime(value),
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      render: (value: string) => (
        <Badge variant={
          value === "present" ? "success" : 
          value === "late" ? "warning" : 
          value === "absent" ? "destructive" : 
          "outline"
        }>
          {value === "present" ? "Có mặt" : 
           value === "late" ? "Đi muộn" : 
           value === "absent" ? "Vắng mặt" : 
           value || "N/A"}
        </Badge>
      ),
    },
    {
      title: "Ghi chú",
      key: "ghi_chu",
    },
  ];
  
  // Responsive columns for mobile
  const mobileColumns = isMobile 
    ? columns.filter(col => ['employee_name', 'ngay_cham_cong', 'trang_thai'].includes(col.key)) 
    : columns;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chấm công"
        description="Quản lý thông tin chấm công của nhân viên"
        action={{
          label: "Thêm chấm công",
          onClick: () => toast({ title: "Chức năng đang phát triển", description: "Tính năng thêm chấm công sẽ sớm được triển khai." })
        }}
      />
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={fetchAttendanceRecords}>
          <RotateCw className="h-4 w-4 mr-2" /> Làm mới
        </Button>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" /> Chọn ngày
        </Button>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" /> Lọc
        </Button>
      </div>

      <DataTable
        columns={mobileColumns}
        data={attendanceRecords}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        searchable={true}
        searchPlaceholder="Tìm kiếm nhân viên..."
      />
    </div>
  );
};

export default AttendancePage;
