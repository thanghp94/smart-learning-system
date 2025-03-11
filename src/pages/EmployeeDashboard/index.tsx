
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TablePageLayout from '@/components/common/TablePageLayout';
import { employeeService } from '@/lib/supabase';
import { Employee } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import TodayClassesList from './components/TodayClassesList';
import TodayAttendance from './components/TodayAttendance';
import QuickTasks from './components/QuickTasks';

const EmployeeDashboard = () => {
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentEmployee = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Find employee by email
          const employees = await employeeService.getAll();
          const employee = employees.find(emp => emp.email === user.email);
          
          if (employee) {
            setCurrentEmployee(employee);
          }
        }
      } catch (error) {
        console.error('Error fetching current employee:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCurrentEmployee();
  }, []);

  if (isLoading) {
    return (
      <TablePageLayout
        title="Bảng điều khiển"
        description="Tổng quan thông tin và hoạt động"
      >
        <div className="flex items-center justify-center h-60">
          <p>Đang tải dữ liệu...</p>
        </div>
      </TablePageLayout>
    );
  }

  if (!currentEmployee) {
    return (
      <TablePageLayout
        title="Bảng điều khiển"
        description="Tổng quan thông tin và hoạt động"
      >
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-lg font-medium">Không tìm thấy thông tin nhân viên</h3>
              <p className="text-muted-foreground mt-2">
                Vui lòng liên hệ quản trị viên để được hỗ trợ.
              </p>
            </div>
          </CardContent>
        </Card>
      </TablePageLayout>
    );
  }

  return (
    <TablePageLayout
      title="Bảng điều khiển"
      description={`Xin chào, ${currentEmployee.ten_nhan_su || 'Nhân viên'}!`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Classes */}
        <div className="md:col-span-2">
          <TodayClassesList employee={currentEmployee} />
        </div>
        
        {/* Attendance Card */}
        <div>
          <TodayAttendance employee={currentEmployee} />
        </div>
        
        {/* Tasks */}
        <div className="md:col-span-3">
          <QuickTasks employeeId={currentEmployee.id} />
        </div>
      </div>
    </TablePageLayout>
  );
};

export default EmployeeDashboard;
