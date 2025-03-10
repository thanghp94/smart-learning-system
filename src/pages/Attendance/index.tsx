
import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ClockIcon } from 'lucide-react';
import MonthlyAttendanceSummary from './MonthlyAttendanceSummary';
import MonthlyAttendanceView from './MonthlyAttendanceView';

const Attendance = () => {
  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Chấm công"
        description="Quản lý và theo dõi chấm công nhân viên"
        icon={<ClockIcon className="h-6 w-6" />}
      />

      <div className="mt-6">
        <Tabs defaultValue="monthly-view">
          <TabsList className="mb-6">
            <TabsTrigger value="monthly-view">Bảng chấm công tháng</TabsTrigger>
            <TabsTrigger value="summary">Thống kê tổng hợp</TabsTrigger>
            <TabsTrigger value="daily">Chấm công hàng ngày</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly-view" className="space-y-4">
            <MonthlyAttendanceView />
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <MonthlyAttendanceSummary />
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground">Chức năng chấm công hàng ngày đang được phát triển.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Attendance;
