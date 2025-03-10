
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Download,
  Users,
  Plus,
  Clock
} from 'lucide-react';
import { format, addMonths, subMonths, getDaysInMonth, setDate, getMonth, getYear } from 'date-fns';
import { vi } from 'date-fns/locale';
import { employeeClockInService } from '@/lib/supabase/employee-clock-in-service';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { employeeService } from '@/lib/supabase/employee-service';

interface MonthlyAttendanceViewProps {
  // Add props if needed
}

const MonthlyAttendanceView: React.FC<MonthlyAttendanceViewProps> = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [newAttendance, setNewAttendance] = useState({
    nhan_vien_id: '',
    ngay: format(new Date(), 'yyyy-MM-dd'),
    thoi_gian_bat_dau: '',
    thoi_gian_ket_thuc: '',
    trang_thai: 'present',
    ghi_chu: ''
  });
  
  const { toast } = useToast();

  // Get days in month for the current date
  const daysInMonth = getDaysInMonth(currentDate);
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  useEffect(() => {
    fetchMonthlyAttendance();
    fetchEmployees();
  }, [currentDate]);

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getActive();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách nhân viên',
        variant: 'destructive'
      });
    }
  };

  const fetchMonthlyAttendance = async () => {
    setIsLoading(true);
    try {
      const month = getMonth(currentDate) + 1; // JavaScript months are 0-indexed
      const year = getYear(currentDate);
      
      const data = await employeeClockInService.getMonthlySummary(month, year);
      
      // Group data by employee
      const groupedData = data.reduce((acc: any, item: any) => {
        if (!acc[item.employee_id]) {
          acc[item.employee_id] = {
            employee_id: item.employee_id,
            employee_name: item.employee_name,
            days: {},
            present_count: item.present_count || 0,
            absent_count: item.absent_count || 0,
            late_count: item.late_count || 0
          };
        }
        
        // Set status for this day
        const dayOfMonth = item.day_of_month;
        acc[item.employee_id].days[dayOfMonth] = item.status;
        
        return acc;
      }, {});
      
      setAttendanceData(Object.values(groupedData));
    } catch (error) {
      console.error('Error fetching monthly attendance:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu chấm công tháng',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-100';
    
    switch (status.toLowerCase()) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'leave':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusText = (status: string | undefined) => {
    if (!status) return '';
    
    switch (status.toLowerCase()) {
      case 'present':
        return 'Có';
      case 'absent':
        return 'Vắng';
      case 'late':
        return 'Trễ';
      case 'leave':
        return 'Nghỉ';
      default:
        return '';
    }
  };

  const exportToExcel = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Format data for export
    const formattedData = attendanceData.map((employee) => {
      const employeeRow: any = {
        'Tên nhân viên': employee.employee_name,
        'Có mặt': employee.present_count,
        'Vắng mặt': employee.absent_count,
        'Đi trễ': employee.late_count
      };
      
      // Add day columns
      dayNumbers.forEach(day => {
        employeeRow[`Ngày ${day}`] = getStatusText(employee.days[day]);
      });
      
      return employeeRow;
    });
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(formattedData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Chấm công tháng');
    
    // Generate Excel file
    const filename = `Cham_cong_thang_${format(currentDate, 'MM-yyyy')}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    toast({
      title: 'Xuất dữ liệu thành công',
      description: `Đã tạo file ${filename}`
    });
  };

  const handleAddAttendance = async () => {
    try {
      if (!newAttendance.nhan_vien_id || !newAttendance.ngay) {
        toast({
          title: 'Lỗi',
          description: 'Vui lòng điền đầy đủ thông tin',
          variant: 'destructive'
        });
        return;
      }

      await employeeClockInService.create(newAttendance);
      
      toast({
        title: 'Thành công',
        description: 'Đã thêm dữ liệu chấm công mới',
      });
      
      setShowAddDialog(false);
      fetchMonthlyAttendance();
    } catch (error) {
      console.error('Error adding attendance:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm dữ liệu chấm công',
        variant: 'destructive'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAttendance(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewAttendance(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Calendar className="mr-2 h-6 w-6" />
          Chấm công tháng {format(currentDate, 'MM/yyyy', { locale: vi })}
        </h2>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
            Tháng trước
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            Tháng sau
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={exportToExcel}>
            <Download className="h-4 w-4 mr-1" />
            Xuất Excel
          </Button>
          <Button variant="default" size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Thêm chấm công
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Bảng chấm công nhân viên
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Đang tải dữ liệu...</div>
          ) : attendanceData.length === 0 ? (
            <div className="text-center py-8">Không có dữ liệu chấm công cho tháng này</div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                      Nhân viên
                    </th>
                    {dayNumbers.map(day => (
                      <th key={day} scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {day}
                      </th>
                    ))}
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Có mặt
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vắng
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đi trễ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.map((employee, index) => (
                    <tr key={employee.employee_id}>
                      <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
                        <div className="text-sm font-medium text-gray-900">{employee.employee_name}</div>
                      </td>
                      {dayNumbers.map(day => (
                        <td key={day} className="px-1 py-4">
                          <div className={`text-center text-xs ${getStatusColor(employee.days[day])} rounded-full w-8 h-8 flex items-center justify-center mx-auto`}>
                            {getStatusText(employee.days[day])}
                          </div>
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Badge variant="success">{employee.present_count || 0}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Badge variant="destructive">{employee.absent_count || 0}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Badge variant="warning">{employee.late_count || 0}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Attendance Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Thêm dữ liệu chấm công
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nhan_vien_id">Nhân viên</Label>
              <Select
                name="nhan_vien_id" 
                onValueChange={(value) => handleSelectChange('nhan_vien_id', value)}
                value={newAttendance.nhan_vien_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhân viên" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.ten_nhan_su}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ngay">Ngày</Label>
              <Input 
                id="ngay" 
                name="ngay" 
                type="date" 
                value={newAttendance.ngay}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="thoi_gian_bat_dau">Giờ vào</Label>
                <Input 
                  id="thoi_gian_bat_dau" 
                  name="thoi_gian_bat_dau" 
                  type="time" 
                  value={newAttendance.thoi_gian_bat_dau}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="thoi_gian_ket_thuc">Giờ ra</Label>
                <Input 
                  id="thoi_gian_ket_thuc" 
                  name="thoi_gian_ket_thuc" 
                  type="time" 
                  value={newAttendance.thoi_gian_ket_thuc}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="trang_thai">Trạng thái</Label>
              <Select
                name="trang_thai" 
                onValueChange={(value) => handleSelectChange('trang_thai', value)}
                value={newAttendance.trang_thai}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Có mặt</SelectItem>
                  <SelectItem value="absent">Vắng mặt</SelectItem>
                  <SelectItem value="late">Đi trễ</SelectItem>
                  <SelectItem value="leave">Xin nghỉ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ghi_chu">Ghi chú</Label>
              <Input 
                id="ghi_chu" 
                name="ghi_chu" 
                value={newAttendance.ghi_chu}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddAttendance}>
                Lưu
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonthlyAttendanceView;
