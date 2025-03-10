
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import { supabase } from '@/lib/supabase/client';
import { employeeClockInService } from '@/lib/supabase/employee-clock-in-service';
import { useToast } from '@/hooks/use-toast';
import DataTable from '@/components/ui/DataTable';
import ExportButton from '@/components/ui/ExportButton';
import { Link } from 'react-router-dom';

const EmployeeAttendance = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const { toast } = useToast();

  // Fetch all active employees
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoadingEmployees(true);
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('id, ten_nhan_su, hinh_anh, bo_phan, chuc_danh')
          .eq('tinh_trang_lao_dong', 'active')
          .order('ten_nhan_su', { ascending: true });
        
        if (error) throw error;
        
        setEmployees(data || []);
        if (data && data.length > 0 && !selectedEmployeeId) {
          setSelectedEmployeeId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách nhân viên',
          variant: 'destructive'
        });
      } finally {
        setIsLoadingEmployees(false);
      }
    };
    
    fetchEmployees();
  }, []);

  // Fetch attendance data when employee or month changes
  useEffect(() => {
    if (selectedEmployeeId) {
      fetchEmployeeAttendance();
    }
  }, [selectedEmployeeId, selectedMonth]);

  const fetchEmployeeAttendance = async () => {
    setIsLoading(true);
    try {
      const month = selectedMonth.getMonth() + 1;
      const year = selectedMonth.getFullYear();
      
      const data = await employeeClockInService.getEmployeeAttendanceSummary(
        selectedEmployeeId, 
        month, 
        year
      );
      
      setAttendanceData(data || []);
    } catch (error) {
      console.error('Error fetching employee attendance:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu chấm công nhân viên',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setSelectedMonth(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(addMonths(selectedMonth, 1));
  };

  const handleCurrentMonth = () => {
    setSelectedMonth(new Date());
  };

  const handleEmployeeChange = (value: string) => {
    setSelectedEmployeeId(value);
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

  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);

  const columns = [
    {
      title: 'Ngày',
      key: 'ngay',
      sortable: true,
      render: (value: string) => format(new Date(value), 'dd/MM/yyyy (EEEE)', { locale: vi }),
    },
    {
      title: 'Giờ vào',
      key: 'thoi_gian_bat_dau',
      sortable: true,
      render: (value: string) => value ? value.substring(0, 5) : 'N/A',
    },
    {
      title: 'Giờ ra',
      key: 'thoi_gian_ket_thuc',
      sortable: true,
      render: (value: string) => value ? value.substring(0, 5) : 'N/A',
    },
    {
      title: 'Trạng thái',
      key: 'trang_thai',
      sortable: true,
      render: (value: string) => getStatusBadge(value),
    },
    {
      title: 'Buổi dạy',
      key: 'buoi_day_id',
      render: (value: string) => value ? (
        <Link to={`/teaching-sessions/${value}`} className="hover:underline text-blue-500">
          Xem buổi dạy
        </Link>
      ) : 'Không có',
    },
    {
      title: 'Ghi chú',
      key: 'ghi_chu',
      render: (value: string) => value || 'Không có ghi chú',
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>Chấm công nhân viên</span>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedEmployeeId} onValueChange={handleEmployeeChange} disabled={isLoadingEmployees}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Chọn nhân viên..." />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.ten_nhan_su}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={handlePreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-2">
                  {format(selectedMonth, 'MM/yyyy')}
                </span>
                <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleCurrentMonth}>
                Tháng hiện tại
              </Button>
              
              <ExportButton
                data={attendanceData}
                filename={`Cham_cong_${selectedEmployee?.ten_nhan_su || 'nhan_vien'}_${format(selectedMonth, 'MM-yyyy')}`}
                label="Xuất Excel"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedEmployee && (
            <div className="mb-4 flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="flex-shrink-0">
                {selectedEmployee.hinh_anh ? (
                  <img 
                    src={selectedEmployee.hinh_anh} 
                    alt={selectedEmployee.ten_nhan_su} 
                    className="h-16 w-16 rounded-full object-cover" 
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-slate-500" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{selectedEmployee.ten_nhan_su}</h3>
                <p className="text-sm text-muted-foreground">{selectedEmployee.chuc_danh || 'Không có chức danh'}</p>
                <p className="text-sm">Bộ phận: {selectedEmployee.bo_phan || 'Chưa phân bộ phận'}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/employees/${selectedEmployee.id}`}>
                      Xem chi tiết
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm font-medium mb-1">Thống kê tháng {format(selectedMonth, 'MM/yyyy')}</div>
                <div className="grid grid-cols-3 gap-2">
                  <Badge variant="outline" className="justify-center">
                    <Clock className="h-3 w-3 mr-1" /> 
                    {attendanceData.length} ngày có mặt
                  </Badge>
                  <Badge variant="outline" className="justify-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {attendanceData.filter(d => d.trang_thai === 'late').length} lần đi muộn
                  </Badge>
                  <Badge variant="success" className="justify-center">
                    {attendanceData.filter(d => d.xac_nhan).length} ngày được xác nhận
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          <DataTable
            columns={columns}
            data={attendanceData}
            isLoading={isLoading || isLoadingEmployees}
            searchable
            searchPlaceholder="Tìm kiếm chấm công..."
            pagination
          />
          
          {!isLoading && !isLoadingEmployees && attendanceData.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Clock className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Không có dữ liệu chấm công</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Không có dữ liệu chấm công cho nhân viên này trong tháng {format(selectedMonth, 'MM/yyyy')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeAttendance;
