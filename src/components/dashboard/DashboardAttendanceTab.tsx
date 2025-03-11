
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DashboardAttendanceTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chấm công</CardTitle>
        <CardDescription>
          Thống kê chấm công nhân viên
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Tình hình chấm công</h3>
            <p>Xem báo cáo chi tiết tại trang chấm công</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Xem chi tiết</h3>
            <Button onClick={() => window.location.href = '/attendance'}>
              Quản lý chấm công
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardAttendanceTab;
