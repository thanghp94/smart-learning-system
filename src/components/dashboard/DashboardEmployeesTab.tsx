
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardEmployeesTabProps {
  employeeCount: number;
}

const DashboardEmployeesTab: React.FC<DashboardEmployeesTabProps> = ({ employeeCount }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nhân viên</CardTitle>
        <CardDescription>
          Thông tin nhân viên
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Thống kê nhân viên</h3>
            <p>Tổng số: {employeeCount}</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Xem chi tiết</h3>
            <Button onClick={() => window.location.href = '/employees'}>
              Quản lý nhân viên
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardEmployeesTab;
