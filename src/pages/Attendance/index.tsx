
import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ClockIcon, UserRound } from 'lucide-react';
import MonthlyAttendanceSummary from './MonthlyAttendanceSummary';
import MonthlyAttendanceView from './MonthlyAttendanceView';
import DailyAttendance from './DailyAttendance';
import StudentAttendance from './StudentAttendance';
import EmployeeAttendance from './EmployeeAttendance';

const Attendance = () => {
  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Chấm công"
        description="Quản lý và theo dõi chấm công nhân viên và học sinh"
        icon={<ClockIcon className="h-6 w-6" />}
      />

      <div className="mt-6">
        <Tabs defaultValue="monthly-view">
          <TabsList className="mb-6">
            <TabsTrigger value="monthly-view">Bảng chấm công tháng</TabsTrigger>
            <TabsTrigger value="summary">Thống kê tổng hợp</TabsTrigger>
            <TabsTrigger value="daily">Chấm công hằng ngày</TabsTrigger>
            <TabsTrigger value="employees">Nhân viên</TabsTrigger>
            <TabsTrigger value="students">Học sinh</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly-view" className="space-y-4">
            <MonthlyAttendanceView />
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <MonthlyAttendanceSummary />
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            <DailyAttendance />
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <EmployeeAttendance />
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <StudentAttendance />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Attendance;
