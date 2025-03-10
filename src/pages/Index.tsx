
import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, AreaChart } from '@/components/ui/chart';
import { CalendarCheck, GraduationCap, Users, Book } from 'lucide-react';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { supabase } from '@/lib/supabase/client';

interface CountData {
  students: number;
  classes: number;
  employees: number;
  sessions: number;
}

const Index = () => {
  const [countData, setCountData] = useState<CountData>({
    students: 0,
    classes: 0,
    employees: 0,
    sessions: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        // Fetch students count
        const { count: studentsCount, error: studentsError } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true });

        // Fetch classes count
        const { count: classesCount, error: classesError } = await supabase
          .from('classes')
          .select('*', { count: 'exact', head: true });

        // Fetch employees count
        const { count: employeesCount, error: employeesError } = await supabase
          .from('employees')
          .select('*', { count: 'exact', head: true });

        // Fetch sessions count
        const { count: sessionsCount, error: sessionsError } = await supabase
          .from('teaching_sessions')
          .select('*', { count: 'exact', head: true });

        if (studentsError || classesError || employeesError || sessionsError) {
          console.error("Error fetching counts");
        } else {
          setCountData({
            students: studentsCount || 0,
            classes: classesCount || 0,
            employees: employeesCount || 0,
            sessions: sessionsCount || 0
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const studentData = [
    { name: 'Tháng 1', total: 53 },
    { name: 'Tháng 2', total: 55 },
    { name: 'Tháng 3', total: 59 },
    { name: 'Tháng 4', total: 62 },
    { name: 'Tháng 5', total: 65 },
    { name: 'Tháng 6', total: 72 },
    { name: 'Tháng 7', total: 78 },
    { name: 'Tháng 8', total: 82 },
    { name: 'Tháng 9', total: 88 },
    { name: 'Tháng 10', total: 91 },
    { name: 'Tháng 11', total: 94 },
    { name: 'Tháng 12', total: 98 },
  ];

  const classesData = [
    { name: 'Tháng 1', total: 12 },
    { name: 'Tháng 2', total: 13 },
    { name: 'Tháng 3', total: 15 },
    { name: 'Tháng 4', total: 15 },
    { name: 'Tháng 5', total: 16 },
    { name: 'Tháng 6', total: 17 },
    { name: 'Tháng 7', total: 18 },
    { name: 'Tháng 8', total: 19 },
    { name: 'Tháng 9', total: 20 },
    { name: 'Tháng 10', total: 21 },
    { name: 'Tháng 11', total: 22 },
    { name: 'Tháng 12', total: 24 },
  ];

  return (
    <div className="container mx-auto space-y-6 p-6">
      <PageHeader
        title="Tổng Quan"
        description="Xem thông tin tổng quan về trung tâm"
        icon={<CalendarCheck className="h-6 w-6" />}
      />

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

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Học sinh</TabsTrigger>
          <TabsTrigger value="classes">Lớp học</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tăng trưởng học sinh</CardTitle>
              <CardDescription>
                Số lượng học sinh theo tháng trong năm
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <BarChart data={studentData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tăng trưởng lớp học</CardTitle>
              <CardDescription>
                Số lượng lớp học theo tháng trong năm
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <AreaChart data={classesData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>
            Các hoạt động mới nhất trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivity />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
