
import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, UserCheck, Clock } from 'lucide-react';
import MonthlyAttendanceView from './MonthlyAttendanceView';
import DailyAttendance from './DailyAttendance';
import EmployeeAttendance from './EmployeeAttendance';

const AttendancePage = () => {
  const [activeTab, setActiveTab] = useState('monthly');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Chấm công"
        description="Quản lý thông tin chấm công nhân viên"
        icon={<UserCheck className="h-6 w-6" />}
      />

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="monthly">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Chấm công tháng
          </TabsTrigger>
          <TabsTrigger value="daily">
            <Clock className="h-4 w-4 mr-2" />
            Chấm công ngày
          </TabsTrigger>
          <TabsTrigger value="employee">
            <UserCheck className="h-4 w-4 mr-2" />
            Chấm công theo nhân viên
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-4">
          <MonthlyAttendanceView />
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <DailyAttendance />
        </TabsContent>

        <TabsContent value="employee" className="space-y-4">
          <EmployeeAttendance />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendancePage;
