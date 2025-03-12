
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CheckCircle, Clock, FileText, Users } from 'lucide-react';
import TodayAttendance from '@/pages/EmployeeDashboard/components/TodayAttendance';

const PersonalDashboard = () => {
  const mockEmployee = {
    id: '123',
    name: 'Nguyễn Văn A',
    position: 'Giáo viên',
    department: 'Tiếng Anh',
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Xin chào, {mockEmployee.name}</h1>
          <p className="text-muted-foreground">{mockEmployee.position} • {mockEmployee.department}</p>
        </div>
        <div className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lớp học hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Lớp học đang chờ bạn</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Học sinh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Học sinh đang học với bạn</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nhiệm vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Nhiệm vụ đang chờ hoàn thành</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đánh giá</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Đánh giá buổi học cần hoàn thành</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="classes">Lớp học</TabsTrigger>
          <TabsTrigger value="students">Học sinh</TabsTrigger>
          <TabsTrigger value="schedule">Lịch dạy</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TodayAttendance 
              employeeId={mockEmployee.id} 
              employeeName={mockEmployee.name}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Lịch dạy hôm nay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Lớp Tiếng Anh Giao Tiếp 1</p>
                      <p className="text-sm text-muted-foreground">09:00 - 10:30</p>
                    </div>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                      Đang diễn ra
                    </span>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Lớp Tiếng Anh IELTS</p>
                      <p className="text-sm text-muted-foreground">13:30 - 15:00</p>
                    </div>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      Sắp diễn ra
                    </span>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Lớp Tiếng Anh Cấp Tốc</p>
                      <p className="text-sm text-muted-foreground">18:00 - 19:30</p>
                    </div>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      Sắp diễn ra
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Nhiệm vụ hôm nay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                    <span>Chuẩn bị tài liệu cho lớp IELTS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                    <span>Đánh giá bài tập học sinh lớp Giao Tiếp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                    <span>Họp với phụ huynh học sinh Nguyễn Văn B</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                    <span>Tham gia buổi họp nhóm giáo viên</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Hoạt động gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-4 mt-0.5">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Buổi học Tiếng Anh Giao Tiếp đã hoàn thành</p>
                      <p className="text-xs text-muted-foreground">2 giờ trước</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 mt-0.5">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Đã đánh giá 5 bài tập của học sinh</p>
                      <p className="text-xs text-muted-foreground">3 giờ trước</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 mt-0.5">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Đã tham gia buổi họp nhóm giáo viên</p>
                      <p className="text-xs text-muted-foreground">Hôm qua</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 mt-0.5">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Đã điểm danh đầy đủ</p>
                      <p className="text-xs text-muted-foreground">Hôm qua</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="classes">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Đang phát triển nội dung về lớp học...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="students">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Đang phát triển nội dung về học sinh...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="schedule">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Đang phát triển nội dung về lịch dạy...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalDashboard;
