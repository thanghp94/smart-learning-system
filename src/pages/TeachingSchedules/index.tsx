
import React, { useState, useEffect } from 'react';
import { Calendar, RotateCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/DataTable';
import { teachingSessionService } from '@/pages/TeachingSessions/TeachingSessionService';
import { employeeService, facilityService } from '@/lib/supabase';
import { TeachingSession, Employee, Facility } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import TablePageLayout from '@/components/common/TablePageLayout';

const TeachingSchedule = () => {
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getAll();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchFacilities = async () => {
      try {
        const data = await facilityService.getAll();
        setFacilities(data);
      } catch (error) {
        console.error('Error fetching facilities:', error);
      }
    };

    fetchEmployees();
    fetchFacilities();
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        let data: TeachingSession[] = [];
        
        if (selectedEmployee) {
          data = await teachingSessionService.getByTeacher(selectedEmployee);
        } else if (selectedFacility) {
          data = await teachingSessionService.getByFacility(selectedFacility);
        } else {
          data = await teachingSessionService.getAll();
        }
        
        setSessions(data);
      } catch (error) {
        console.error('Error fetching teaching sessions:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách lịch dạy',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [selectedEmployee, selectedFacility, toast]);

  const handleRowClick = (session: TeachingSession) => {
    navigate(`/teaching-sessions/${session.id}`);
  };

  const handleRefresh = () => {
    setSelectedEmployee('');
    setSelectedFacility('');
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const date = new Date(`2000-01-01T${timeString}`);
    return format(date, 'HH:mm');
  };

  const columns = [
    {
      title: 'Ngày',
      key: 'ngay_hoc',
      sortable: true,
      render: (value: string) => format(new Date(value), 'dd/MM/yyyy'),
    },
    {
      title: 'Lớp',
      key: 'class_name',
      sortable: true,
    },
    {
      title: 'Thời gian',
      key: 'thoi_gian_bat_dau',
      render: (value: string, record: TeachingSession) =>
        `${formatTime(record.thoi_gian_bat_dau)} - ${formatTime(
          record.thoi_gian_ket_thuc
        )}`,
    },
    {
      title: 'Giáo viên',
      key: 'teacher_name',
      sortable: true,
    },
    {
      title: 'Trợ giảng',
      key: 'assistant_name',
      render: (value: string) => value || '--',
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Card className="border-dashed">
        <CardContent className="p-2">
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Chọn giáo viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả giáo viên</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.ten_nhan_su}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedFacility} onValueChange={setSelectedFacility}>
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Chọn cơ sở" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả cơ sở</SelectItem>
                {facilities.map((facility) => (
                  <SelectItem key={facility.id} value={facility.id}>
                    {facility.ten_co_so}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleRefresh}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <TablePageLayout
      title="Lịch dạy"
      description="Quản lý lịch dạy và thời khóa biểu"
      icon={<Calendar className="h-6 w-6" />}
      actions={tableActions}
    >
      <DataTable
        columns={columns}
        data={sessions}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        searchable={true}
        searchPlaceholder="Tìm kiếm lịch dạy..."
      />
    </TablePageLayout>
  );
};

export default TeachingSchedule;
