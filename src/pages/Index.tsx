
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCard from '@/components/common/StatsCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, GraduationCap, Home, BookOpen } from 'lucide-react';
import { studentService } from '@/lib/supabase/student-service';
import { classService } from '@/lib/supabase/services/class';
import { facilityService } from '@/lib/supabase/facility-service';
import { teachingSessionService } from '@/lib/supabase/teaching-session-service';
import { activityService } from '@/lib/supabase/activity-service';
import { formatDate } from '@/utils/format';

interface ChartData {
  name: string;
  total: number;
}

const Index = () => {
  const [studentCount, setStudentCount] = useState<number>(0);
  const [classCount, setClassCount] = useState<number>(0);
  const [facilityCount, setFacilityCount] = useState<number>(0);
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch counts for stats cards
        const students = await studentService.getAll();
        const classes = await classService.classBaseService.getAll();
        const facilities = await facilityService.getAll();
        const sessions = await teachingSessionService.getAll();
        
        setStudentCount(students.length);
        setClassCount(classes.length);
        setFacilityCount(facilities.length);
        setSessionCount(sessions.length);
        
        // Generate chart data
        const now = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        
        const monthData: { [key: string]: number } = {};
        for (let i = 0; i < 6; i++) {
          const month = new Date();
          month.setMonth(now.getMonth() - i);
          const monthName = month.toLocaleString('vi-VN', { month: 'short' });
          monthData[monthName] = 0;
        }
        
        // Count students by creation month
        students.forEach(student => {
          if (!student.created_at) return;
          
          const createdAt = new Date(student.created_at);
          if (createdAt >= sixMonthsAgo) {
            const monthName = createdAt.toLocaleString('vi-VN', { month: 'short' });
            if (monthData[monthName] !== undefined) {
              monthData[monthName] += 1;
            }
          }
        });
        
        // Convert to chart data format
        const chartData = Object.entries(monthData).map(([name, total]) => ({
          name,
          total
        })).reverse();
        
        setChartData(chartData);
        
        // Fetch recent activities
        const recentActivities = await activityService.getRecent(10);
        setActivities(recentActivities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng số học sinh"
          value={loading ? '...' : studentCount.toString()}
          description="Học sinh đang học"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Lớp học"
          value={loading ? '...' : classCount.toString()}
          description="Tổng số lớp"
          icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Cơ sở"
          value={loading ? '...' : facilityCount.toString()}
          description="Cơ sở đang hoạt động"
          icon={<Home className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Buổi dạy"
          value={loading ? '...' : sessionCount.toString()}
          description="Tổng số buổi dạy"
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7 lg:col-span-4">
          <CardHeader>
            <CardTitle>Học sinh mới (6 tháng gần đây)</CardTitle>
            <CardDescription>
              Số lượng học sinh đăng ký mới theo tháng
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-80 flex items-center justify-center">
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-7 lg:col-span-3">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Các hoạt động mới nhất trên hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity 
              activities={activities} 
              isLoading={loading} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
