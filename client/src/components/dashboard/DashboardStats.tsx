
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, Book, CalendarCheck } from 'lucide-react';

interface CountData {
  students: number;
  classes: number;
  employees: number;
  sessions: number;
}

interface DashboardStatsProps {
  countData: CountData;
  isLoading: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ countData, isLoading }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Học sinh</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '...' : countData.students}</div>
          <p className="text-xs text-muted-foreground">
            Tổng số học sinh đăng ký
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lớp học</CardTitle>
          <Book className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '...' : countData.classes}</div>
          <p className="text-xs text-muted-foreground">
            Tổng số lớp học hiện có
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nhân viên</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '...' : countData.employees}</div>
          <p className="text-xs text-muted-foreground">
            Tổng số nhân viên
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Buổi dạy</CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '...' : countData.sessions}</div>
          <p className="text-xs text-muted-foreground">
            Tổng số buổi dạy
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
