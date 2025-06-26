
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardStudentsTab from './DashboardStudentsTab';
import DashboardClassesTab from './DashboardClassesTab';
import DashboardEmployeesTab from './DashboardEmployeesTab';
import DashboardAttendanceTab from './DashboardAttendanceTab';

interface DashboardTabsProps {
  studentData: any[];
  classesData: any[];
  employeeCount: number;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  studentData, 
  classesData, 
  employeeCount 
}) => {
  return (
    <Tabs defaultValue="students" className="space-y-4">
      <TabsList>
        <TabsTrigger value="students">Học sinh</TabsTrigger>
        <TabsTrigger value="classes">Lớp học</TabsTrigger>
        <TabsTrigger value="employees">Nhân viên</TabsTrigger>
        <TabsTrigger value="attendance">Chấm công</TabsTrigger>
      </TabsList>
      
      <TabsContent value="students" className="space-y-4">
        <DashboardStudentsTab studentData={studentData} />
      </TabsContent>
      
      <TabsContent value="classes" className="space-y-4">
        <DashboardClassesTab classesData={classesData} />
      </TabsContent>

      <TabsContent value="employees" className="space-y-4">
        <DashboardEmployeesTab employeeCount={employeeCount} />
      </TabsContent>

      <TabsContent value="attendance" className="space-y-4">
        <DashboardAttendanceTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
