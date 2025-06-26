
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
      {/* Admin Login Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CalendarCheck className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Đăng nhập thành công
            </h3>
            <div className="mt-1 text-sm text-green-700">
              <p>Xin chào Admin - Hệ thống quản lý trường học PostgreSQL đã sẵn sàng</p>
            </div>
          </div>
        </div>
      </div>

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
