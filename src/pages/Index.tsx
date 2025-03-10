
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Users, GraduationCap, School, Calendar } from "lucide-react";
import StatsCard from "@/components/common/StatsCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { studentService, classService, employeeService } from "@/lib/supabase";
import { Student, Class, Employee } from "@/lib/types";
import { activityService } from "@/lib/supabase/activity-service";

// Type for activity that matches the one used in RecentActivity component
interface DashboardActivity {
  id: string;
  action: string;
  entity_type: string;
  entity_name: string;
  actor: string;
  status: string;
  created_at: string;
  actor_id?: string;
  entity_id?: string;
  details?: string;
}

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsData, classesData, employeesData, activitiesData] = await Promise.all([
          studentService.getAll(),
          classService.getAll(),
          employeeService.getAll(),
          activityService.getRecent(10)
        ]);
        
        setStudents(studentsData);
        setClasses(classesData);
        setEmployees(employeesData);
        // Type assertion to DashboardActivity[]
        setActivities(activitiesData as unknown as DashboardActivity[]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const calculateUpcomingClasses = () => {
    const now = new Date();
    return classes.filter(c => {
      if (c.ngay_bat_dau) { // Using ngay_bat_dau instead of tu_ngay
        const startDate = new Date(c.ngay_bat_dau);
        return startDate > now;
      }
      return false;
    }).length;
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bảng Điều Khiển</h2>
        <div className="flex space-x-2">
          <Button asChild>
            <Link to="/classes/add">Tạo lớp mới</Link>
          </Button>
          <Button asChild>
            <Link to="/students/add">Thêm học sinh</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng Học Sinh"
          value={students.length.toString()}
          description="Học sinh đang theo học"
          icon={<Users className="h-5 w-5" />}
          iconClassName="bg-blue-500"
          href="/students"
        />
        <StatsCard
          title="Tổng Lớp Học"
          value={classes.length.toString()}
          description="Lớp học đang hoạt động"
          icon={<GraduationCap className="h-5 w-5" />}
          iconClassName="bg-green-500"
          href="/classes"
        />
        <StatsCard
          title="Lớp Sắp Mở"
          value={calculateUpcomingClasses().toString()}
          description="Lớp học sắp bắt đầu"
          icon={<Calendar className="h-5 w-5" />}
          iconClassName="bg-yellow-500"
          href="/classes"
        />
        <StatsCard
          title="Nhân viên"
          value={employees.length.toString()}
          description="Giáo viên và nhân viên"
          icon={<School className="h-5 w-5" />}
          iconClassName="bg-purple-500"
          href="/employees"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
          <TabsTrigger value="analytics">Thống Kê</TabsTrigger>
          <TabsTrigger value="reports">Báo Cáo</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Hoạt Động Gần Đây</CardTitle>
                <CardDescription>10 hoạt động gần đây nhất trong hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity activities={activities} isLoading={loading} />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Tổng Quan Lớp Học</CardTitle>
                <CardDescription>Phân bố lớp học theo trạng thái</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Biểu đồ sẽ hiển thị ở đây
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Thống Kê</CardTitle>
              <CardDescription>
                Hiển thị thống kê về học sinh, lớp học và tài chính
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Đang phát triển...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Báo Cáo</CardTitle>
              <CardDescription>
                Xem và xuất báo cáo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Đang phát triển...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
