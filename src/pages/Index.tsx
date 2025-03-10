
import React, { useState, useEffect } from 'react';
import { PlusCircle, Briefcase, Users, Calendar, Activity } from 'lucide-react';
import { classService, studentService, eventService, facilityService } from '@/lib/supabase';
import StatsCard from '@/components/common/StatsCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Types for dashboard data
interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  upcomingEvents: number;
  totalFacilities: number;
}

interface DashboardActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  action: string;
  entity?: string;
}

const Index = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalClasses: 0,
    upcomingEvents: 0,
    totalFacilities: 0
  });
  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch stats
        const [students, classes, events, facilities] = await Promise.all([
          studentService.getAll(),
          classService.getAll(),
          eventService.getAll(),
          facilityService.getAll()
        ]);
        
        setStats({
          totalStudents: students.length,
          totalClasses: classes.length,
          upcomingEvents: events.filter(e => new Date(e.ngay_bat_dau) > new Date()).length,
          totalFacilities: facilities.length
        });
        
        // Set dummy activities for now
        setActivities([
          {
            id: '1',
            title: 'New Student Enrolled',
            description: 'Nguyen Van A enrolled in Math 101',
            date: new Date().toISOString(),
            action: 'enrolled',
            entity: 'student'
          },
          {
            id: '2',
            title: 'Class Started',
            description: 'English 202 class started today',
            date: new Date().toISOString(),
            action: 'started',
            entity: 'class'
          },
          {
            id: '3',
            title: 'New Event Created',
            description: 'Summer Festival event was created',
            date: new Date().toISOString(),
            action: 'created',
            entity: 'event'
          }
        ]);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Could not load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);

  return (
    <div className="space-y-4 p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Học Sinh" 
          value={stats.totalStudents.toString()}
          icon={<Users className="h-5 w-5" />}
          description="Tổng số học sinh"
          trend={{ 
            value: "+5%", 
            direction: "up",
            text: "từ tháng trước" 
          }}
          iconComponent={<Users className="h-5 w-5" />}
        />
        
        <StatsCard 
          title="Lớp Học" 
          value={stats.totalClasses.toString()}
          icon={<Briefcase className="h-5 w-5" />}
          description="Tổng số lớp học"
          trend={{ 
            value: "+2", 
            direction: "up",
            text: "lớp mới trong tháng" 
          }}
          iconComponent={<Briefcase className="h-5 w-5" />}
        />
        
        <StatsCard 
          title="Sự Kiện" 
          value={stats.upcomingEvents.toString()}
          icon={<Calendar className="h-5 w-5" />}
          description="Sự kiện sắp tới"
          trend={{ 
            value: "0", 
            direction: "none",
            text: "mới tạo hôm nay" 
          }}
          iconComponent={<Calendar className="h-5 w-5" />}
        />
        
        <StatsCard 
          title="Cơ Sở" 
          value={stats.totalFacilities.toString()}
          icon={<Activity className="h-5 w-5" />}
          description="Tổng số cơ sở"
          trend={{ 
            value: "0", 
            direction: "none",
            text: "không thay đổi" 
          }}
          iconComponent={<Activity className="h-5 w-5" />}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Hoạt Động Gần Đây</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={activities as any} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Truy Cập Nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm học sinh mới
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <PlusCircle className="mr-2 h-4 w-4" />
                Tạo lớp học mới
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <PlusCircle className="mr-2 h-4 w-4" />
                Lên lịch sự kiện mới
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Sắp Diễn Ra</TabsTrigger>
          <TabsTrigger value="recent">Gần Đây</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Các Sự Kiện Sắp Tới</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-muted-foreground">
                <p>Không có sự kiện nào sắp diễn ra</p>
                <Button variant="outline" className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tạo Sự Kiện Mới
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lớp Học Gần Đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-muted-foreground">
                <p>Không có dữ liệu lớp học gần đây</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
