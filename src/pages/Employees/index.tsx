import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService, facilityService } from '@/lib/supabase';
import { Employee } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Plus, MoreHorizontal, FileText, Trash, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import EmployeeFilesTab from './components/EmployeeFilesTab';

const Employees = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFilesDialog, setShowFilesDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch employees
        const employeesData = await employeeService.getAll();
        setEmployees(employeesData);
        setFilteredEmployees(employeesData);
        
        // Fetch facilities
        const facilitiesData = await facilityService.getAll();
        setFacilities(facilitiesData);
        
        // Extract unique departments and positions
        const uniqueDepartments = [...new Set(employeesData.map(emp => emp.bo_phan).filter(Boolean))];
        const uniquePositions = [...new Set(employeesData.map(emp => emp.chuc_danh).filter(Boolean))];
        
        setDepartments(uniqueDepartments as string[]);
        setPositions(uniquePositions as string[]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách nhân viên',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  useEffect(() => {
    // Apply filters
    let filtered = [...employees];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        emp => 
          emp.ten_nhan_su?.toLowerCase().includes(query) || 
          emp.email?.toLowerCase().includes(query) ||
          emp.dien_thoai?.toLowerCase().includes(query)
      );
    }
    
    if (facilityFilter) {
      filtered = filtered.filter(emp => {
        // Handle both array and string cases for co_so_id
        if (Array.isArray(emp.co_so_id)) {
          return emp.co_so_id.includes(facilityFilter);
        } else if (typeof emp.co_so_id === 'string') {
          return emp.co_so_id === facilityFilter;
        }
        return false;
      });
    }
    
    if (departmentFilter) {
      filtered = filtered.filter(emp => emp.bo_phan === departmentFilter);
    }
    
    if (positionFilter) {
      filtered = filtered.filter(emp => emp.chuc_danh === positionFilter);
    }
    
    if (statusFilter) {
      filtered = filtered.filter(emp => emp.tinh_trang_lao_dong === statusFilter);
    }
    
    setFilteredEmployees(filtered);
  }, [employees, searchQuery, facilityFilter, departmentFilter, positionFilter, statusFilter]);
  
  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: 'hinh_anh',
      header: '',
      cell: ({ row }) => {
        const avatar = row.original.hinh_anh;
        return (
          <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-100">
            <img 
              src={avatar || '/placeholder.svg'} 
              alt={row.original.ten_nhan_su}
              className="w-full h-full object-cover"
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'ten_nhan_su',
      header: 'Tên nhân viên',
      cell: ({ row }) => {
        return (
          <div>
            <div className="font-medium">{row.original.ten_nhan_su}</div>
            <div className="text-sm text-muted-foreground">{row.original.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'bo_phan',
      header: 'Bộ phận',
    },
    {
      accessorKey: 'chuc_danh',
      header: 'Chức danh',
    },
    {
      accessorKey: 'dien_thoai',
      header: 'Điện thoại',
    },
    {
      accessorKey: 'tinh_trang_lao_dong',
      header: 'Tình trạng',
      cell: ({ row }) => {
        const status = row.original.tinh_trang_lao_dong || 'Không xác định';
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
        
        if (status === 'Đang làm việc') {
          variant = 'default';
        } else if (status === 'Đã nghỉ việc') {
          variant = 'destructive';
        } else if (status === 'Tạm nghỉ') {
          variant = 'outline';
        }
        
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/employees/${row.original.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShowFiles(row.original.id)}>
                <FileText className="mr-2 h-4 w-4" />
                Tài liệu
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(row.original.id)} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhân viên này không?')) return;
    
    try {
      await employeeService.delete(id);
      setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== id));
      toast({
        title: 'Thành công',
        description: 'Đã xóa nhân viên',
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa nhân viên',
        variant: 'destructive',
      });
    }
  };

  const handleShowFiles = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    setShowFilesDialog(true);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFacilityFilter('');
    setDepartmentFilter('');
    setPositionFilter('');
    setStatusFilter('');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý nhân viên</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm nhân viên
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Select value={facilityFilter} onValueChange={setFacilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Cơ sở" />
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
            </div>
            
            <div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Bộ phận" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả bộ phận</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chức danh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả chức danh</SelectItem>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tình trạng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả tình trạng</SelectItem>
                  <SelectItem value="Đang làm việc">Đang làm việc</SelectItem>
                  <SelectItem value="Đã nghỉ việc">Đã nghỉ việc</SelectItem>
                  <SelectItem value="Tạm nghỉ">Tạm nghỉ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2 flex justify-end">
              <Button variant="outline" onClick={resetFilters}>Đặt lại bộ lọc</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={filteredEmployees}
            isLoading={isLoading}
            onRowClick={(row) => navigate(`/employees/${row.id}`)}
          />
        </CardContent>
      </Card>
      
      {/* Add Employee Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Thêm nhân viên mới</DialogTitle>
          </DialogHeader>
          {/* Employee form will be added here */}
        </DialogContent>
      </Dialog>
      
      {/* Files Dialog */}
      <Dialog open={showFilesDialog} onOpenChange={setShowFilesDialog}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Tài liệu nhân viên</DialogTitle>
          </DialogHeader>
          {selectedEmployee && <EmployeeFilesTab employeeId={selectedEmployee} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;
