
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Users, BookOpen, Bookmark, CalendarClock, School } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" 
                onClick={() => navigate("/students")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Học sinh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Quản lý thông tin học sinh</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate("/classes")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Lớp học
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Quản lý thông tin lớp học</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate("/enrollments")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Bookmark className="h-5 w-5 mr-2" />
                Ghi danh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Quản lý thông tin ghi danh</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate("/teaching-sessions")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CalendarClock className="h-5 w-5 mr-2" />
                Buổi học
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Quản lý thông tin buổi học</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <School className="h-5 w-5 mr-2" />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Tác vụ nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/students/add")}
              >
                <Users className="h-4 w-4 mr-2" />
                Thêm học sinh mới
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/classes/add")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Thêm lớp học mới
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/teaching-sessions")}
              >
                <CalendarClock className="h-4 w-4 mr-2" />
                Quản lý buổi học
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
