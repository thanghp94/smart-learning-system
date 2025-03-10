import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import StatsCard from '@/components/common/StatsCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, subDays } from 'date-fns';
import { Bell, BookOpen, Calendar, CheckCircle, ClipboardList, Clock, CreditCard, Users, User, UserPlus, Briefcase, Building } from 'lucide-react';
import { activityService, classService, enrollmentService, studentService, teachingSessionService } from '@/lib/supabase';
import { Class, Student, TeachingSession } from '@/lib/types';
import { Activity } from '@/lib/types';

const chartData = [
  { name: 'T2', students: 10 },
  { name: 'T3', students: 15 },
  { name: 'T4', students: 8 },
  { name: 'T5', students: 12 },
  { name: 'T6', students: 18 },
  { name: 'T7', students: 24 },
  { name: 'CN', students: 5 },
];

const IndexPage = () => {
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

  const studentCount = students.length;
  const classCount = classes.length;
  const employeeCount = 0; // Assuming this is a constant value
  const facilityCount = 0; // Assuming this is a constant value

  const activeClasses = classes.filter(c => c.tinh_trang === 'active').length;

  const todaySessions = sessions.filter(s => {
    try {
      const sessionDate = new Date(s.ngay_hoc);
      const today = new Date();
      return sessionDate.toDateString() === today.toDateString();
    } catch (e) {
      return false;
    }
  }).length;

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

  const studentsCount = students.length.toString();
  const activeClassesCount = activeClasses.toString();
  const todaySessionsCount = todaySessions.toString();
  const thisWeekSessionsCount = thisWeekSessions.toString();
  const activeClassesPercentage = `${((activeClasses / (classes.length || 1)) * 100).toFixed(0)}% tổng số lớp`;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tổng quan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Sinh viên" 
          value={studentCount.toString()} 
          icon={<User className="h-5 w-5" />} 
          description="Học sinh đang hoạt động" 
          trend="up"
          trendValue="5%"
        />
        <StatsCard 
          title="Lớp học" 
          value={classCount.toString()} 
          icon={<UserPlus className="h-5 w-5" />} 
          description="Lớp đang hoạt động" 
          trend="up"
          trendValue="2%"
        />
        <StatsCard 
          title="Nhân viên" 
          value={employeeCount.toString()} 
          icon={<Briefcase className="h-5 w-5" />} 
          description="Nhân viên đang làm việc" 
          trend="neutral"
          trendValue="0%"
        />
        <StatsCard 
          title="Cơ sở" 
          value={facilityCount.toString()} 
          icon={<Building className="h-5 w-5" />} 
          description="Cơ sở đang hoạt động" 
          trend="up"
          trendValue="10%"
        />
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivity activities={activities} isLoading={loading} />
        </CardContent>
      </Card>

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

export default IndexPage;
