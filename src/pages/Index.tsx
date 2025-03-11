
import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { CalendarCheck } from 'lucide-react';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import ActivitySection from '@/components/dashboard/ActivitySection';
import useDashboardData from '@/hooks/useDashboardData';
import useDashboardChartData from '@/hooks/useDashboardChartData';
import CommandInterface from '@/components/CommandInterface';

const Index = () => {
  const { countData, isLoading, activities } = useDashboardData();
  const { studentData, classesData } = useDashboardChartData();

  return (
    <div className="container mx-auto space-y-6 p-6">
      <PageHeader
        title="Tổng Quan"
        description="Xem thông tin tổng quan về trung tâm"
        icon={<CalendarCheck className="h-6 w-6" />}
      />

      <div className="hidden md:block mb-4">
        <CommandInterface />
      </div>

      <DashboardStats countData={countData} isLoading={isLoading} />

      <DashboardTabs 
        studentData={studentData} 
        classesData={classesData} 
        employeeCount={countData.employees} 
      />

      <ActivitySection activities={activities} />
    </div>
  );
};

export default Index;
