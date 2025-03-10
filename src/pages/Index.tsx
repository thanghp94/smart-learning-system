
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import StatsCard from '@/components/common/StatsCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, subDays } from 'date-fns';
import { Bell, BookOpen, Calendar, CheckCircle, ClipboardList, Clock, CreditCard, Users } from 'lucide-react';
import { activityService, classService, enrollmentService, studentService, teachingSessionService } from '@/lib/supabase';
import { Class, Student, TeachingSession } from '@/lib/types';
import { Activity } from '@/lib/types/activity';

// Example chart data
const chartData = [
  { name: 'T2', students: 10 },
  { name: 'T3', students: 15 },
  { name: 'T4', students: 8 },
  { name: 'T5', students: 12 },
  { name: 'T6', students: 18 },
  { name: 'T7', students: 24 },
  { name: 'CN', students: 5 },
];

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, classesData, sessionsData, activitiesData] = await Promise.all([
          studentService.getAll(),
          classService.getAll(),
          teachingSessionService.getAll(),
          activityService.getRecent(10)
        ]);

        setStudents(studentsData);
        setClasses(classesData);
        setSessions(sessionsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate active classes
  const activeClasses = classes.filter(c => c.tinh_trang === 'active').length;

  // Calculate sessions for today
  const todaySessions = sessions.filter(s => {
    try {
      const sessionDate = new Date(s.ngay_hoc);
      const today = new Date();
      return sessionDate.toDateString() === today.toDateString();
    } catch (e) {
      return false;
    }
  }).length;

  // Calculate sessions for this week
  const thisWeekSessions = sessions.filter(s => {
    try {
      const sessionDate = new Date(s.ngay_hoc);
      const today = new Date();
      const sevenDaysAgo = subDays(today, 7);
      return sessionDate >= sevenDaysAgo && sessionDate <= today;
    } catch (e) {
      return false;
    }
  }).length;

  // Helper function to render icons in a consistent way
  const renderIcon = (icon: React.ReactNode) => icon;

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Tổng Học Sinh" 
          value={students.length.toString()} 
          description="Học sinh đã đăng ký"
          icon={renderIcon(<Users className="h-8 w-8 text-blue-600" />)}
        />
        <StatsCard 
          title="Lớp Đang Hoạt Động" 
          value={activeClasses.toString()} 
          description={`${((activeClasses / classes.length) * 100).toFixed(0)}% tổng số lớp`}
          icon={renderIcon(<BookOpen className="h-8 w-8 text-green-600" />)}
        />
        <StatsCard 
          title="Buổi Học Hôm Nay" 
          value={todaySessions.toString()} 
          description="Lịch trình hôm nay"
          icon={renderIcon(<Calendar className="h-8 w-8 text-yellow-600" />)}
        />
        <StatsCard 
          title="Buổi Học Tuần Này" 
          value={thisWeekSessions.toString()} 
          description="7 ngày qua"
          icon={renderIcon(<ClipboardList className="h-8 w-8 text-purple-600" />)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Học Sinh Theo Ngày</CardTitle>
            <CardDescription>Số lượng học sinh tham gia các buổi học</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt Động Gần Đây</CardTitle>
            <CardDescription>10 hoạt động mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={activities} isLoading={loading} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Buổi Học</CardTitle>
            <CardDescription>Quản lý buổi học</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <Calendar className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/teaching-sessions" className="w-full">
              <Button className="w-full">Xem Buổi Học</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Lịch Dạy</CardTitle>
            <CardDescription>Lịch dạy của giáo viên</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <Clock className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/teacher-schedule" className="w-full">
              <Button className="w-full">Xem Lịch Dạy</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Điểm Danh</CardTitle>
            <CardDescription>Quản lý điểm danh học sinh</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/attendances" className="w-full">
              <Button className="w-full">Quản Lý Điểm Danh</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Học Phí</CardTitle>
            <CardDescription>Quản lý học phí</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <CreditCard className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/finance" className="w-full">
              <Button className="w-full">Quản Lý Học Phí</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Tiến Độ Hoàn Thành Mục Tiêu</CardTitle>
            <CardDescription>Tiến độ hoàn thành các mục tiêu trong tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Học sinh mới</div>
                  <div className="text-sm text-muted-foreground">75%</div>
                </div>
                <Progress value={75} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Buổi học đã hoàn thành</div>
                  <div className="text-sm text-muted-foreground">60%</div>
                </div>
                <Progress value={60} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Thu học phí</div>
                  <div className="text-sm text-muted-foreground">90%</div>
                </div>
                <Progress value={90} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
