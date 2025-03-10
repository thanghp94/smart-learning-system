
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Building, RotateCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { employeeClockInService } from '@/lib/supabase/employee-clock-in-service';
import { EmployeeClockInOut } from '@/lib/types/employee-clock-in-out';
import { useToast } from '@/hooks/use-toast';
import DataTable from '@/components/ui/DataTable';
import PageHeader from '@/components/common/PageHeader';
import FilterButton, { FilterCategory } from '@/components/ui/FilterButton';
import ExportButton from '@/components/ui/ExportButton';

const AttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<EmployeeClockInOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      setIsLoading(true);
      const records = await employeeClockInService.getAll();
      setAttendanceRecords(records);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu chấm công:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu chấm công. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { label: 'Chờ xử lý', value: 'pending', type: 'status' as const },
    { label: 'Đã xác nhận', value: 'approved', type: 'status' as const },
    { label: 'Từ chối', value: 'rejected', type: 'status' as const },
  ];

  const filterCategories: FilterCategory[] = [
    {
      name: 'Trạng thái',
      type: 'status',
      options: statusOptions,
    }
  ];

  // Apply filters
  const filteredRecords = attendanceRecords.filter(record => {
    for (const [category, value] of Object.entries(filters)) {
      if (value && category === 'Trạng thái' && record.trang_thai !== value) {
        return false;
      }
    }
    return true;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const columns = [
    {
      title: 'Ngày',
      key: 'ngay',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {formatDate(value)}
        </div>
      ),
    },
    {
      title: 'Nhân viên',
      key: 'nhan_vien_id',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          {value}
        </div>
      ),
    },
    {
      title: 'Giờ vào',
      key: 'thoi_gian_bat_dau',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {value || 'Chưa ghi nhận'}
        </div>
      ),
    },
    {
      title: 'Giờ ra',
      key: 'thoi_gian_ket_thuc',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {value || 'Chưa ghi nhận'}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'trang_thai',
      sortable: true,
      render: (value: string) => {
        let variant: 'default' | 'success' | 'destructive' | 'warning' = 'default';
        
        if (value === 'approved') variant = 'success';
        else if (value === 'rejected') variant = 'destructive';
        else if (value === 'pending') variant = 'warning';
        
        return (
          <Badge variant={variant}>
            {value === 'approved' ? 'Đã xác nhận' : 
             value === 'rejected' ? 'Từ chối' : 
             value === 'pending' ? 'Chờ xử lý' : value || 'Chờ xử lý'}
          </Badge>
        );
      },
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <FilterButton 
        categories={filterCategories} 
        onFilter={setFilters} 
      />
      <ExportButton 
        data={filteredRecords}
        filename="du_lieu_cham_cong"
        label="Xuất dữ liệu"
      />
      <Button variant="outline" size="sm" className="h-8" onClick={fetchAttendanceRecords}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm mới
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chấm công"
        description="Quản lý dữ liệu chấm công của nhân viên"
        action={{
          label: "Tạo mới",
          onClick: () => {
            toast({
              title: "Thông báo",
              description: "Tính năng đang được phát triển",
            });
          }
        }}
      />

      <div className="grid gap-4">
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
              <TabsTrigger value="approved">Đã xác nhận</TabsTrigger>
            </TabsList>
            {tableActions}
          </div>

          <TabsContent value="all" className="mt-4">
            <DataTable
              columns={columns}
              data={filteredRecords}
              isLoading={isLoading}
              searchable={true}
              searchPlaceholder="Tìm kiếm chấm công..."
            />
          </TabsContent>
          
          <TabsContent value="pending" className="mt-4">
            <DataTable
              columns={columns}
              data={filteredRecords.filter(r => r.trang_thai === 'pending')}
              isLoading={isLoading}
              searchable={true}
              searchPlaceholder="Tìm kiếm chấm công..."
            />
          </TabsContent>
          
          <TabsContent value="approved" className="mt-4">
            <DataTable
              columns={columns}
              data={filteredRecords.filter(r => r.trang_thai === 'approved')}
              isLoading={isLoading}
              searchable={true}
              searchPlaceholder="Tìm kiếm chấm công..."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AttendancePage;
