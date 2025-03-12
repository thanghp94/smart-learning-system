import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, CheckCheck, User2, ListChecks, Timer, FileText, Users } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { employeeClockInService } from '@/lib/supabase/employee-clock-in-service';
import { formatDateNode } from '@/utils/date-utils';
import { Button } from '@/components/ui/button';

const EmployeeDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [attendance, setAttendance] = useState({ clockedIn: false, clockInTime: null, clockOutTime: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        const today = format(date, 'yyyy-MM-dd');
        const attendanceData = await employeeClockInService.getAttendanceForEmployee(today);
        if (attendanceData && attendanceData.length > 0) {
          const latestEntry = attendanceData[0];
          setAttendance({
            clockedIn: !!latestEntry.thoi_gian_bat_dau && !latestEntry.thoi_gian_ket_thuc,
            clockInTime: latestEntry.thoi_gian_bat_dau ? new Date(latestEntry.thoi_gian_bat_dau) : null,
            clockOutTime: latestEntry.thoi_gian_ket_thuc ? new Date(latestEntry.thoi_gian_ket_thuc) : null,
          });
        } else {
          setAttendance({ clockedIn: false, clockInTime: null, clockOutTime: null });
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [date]);

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Điểm danh hôm nay
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-4 w-[80px]" />
              ) : attendance.clockedIn ? (
                'Đã điểm danh'
              ) : (
                'Chưa điểm danh'
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              <time>{formatDateNode(date)}</time>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Công việc hoàn thành
            </CardTitle>
            <CheckCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+721</div>
            <p className="text-sm text-muted-foreground">
              Từ tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số nhân viên
            </CardTitle>
            <User2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+545</div>
            <p className="text-sm text-muted-foreground">
              Tổng số nhân viên
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số giờ làm
            </CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-sm text-muted-foreground">
              Trong tháng này
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Công việc</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ScrollArea className="h-[300px] w-full space-y-2">
              <div className="flex items-center justify-between rounded-md border p-3 shadow-sm">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Thiết kế lại trang web</p>
                  <p className="text-sm text-muted-foreground">Đến 20/1/2024</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Mở menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuItem>Sửa</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Xóa</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3 shadow-sm">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Tạo bản demo</p>
                  <p className="text-sm text-muted-foreground">Đến 28/1/2024</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Mở menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuItem>Sửa</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Xóa</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3 shadow-sm">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Thu thập thông tin</p>
                  <p className="text-sm text-muted-foreground">Đến 31/1/2024</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Mở menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuItem>Sửa</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Xóa</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-none pl-0">
              <li>
                <a href="#" className="flex items-center gap-2 p-2 hover:bg-secondary rounded-md">
                  <FileText className="w-4 h-4 opacity-75" />
                  Báo cáo tháng 12
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 p-2 hover:bg-secondary rounded-md">
                  <Users className="w-4 h-4 opacity-75" />
                  Danh sách nhân viên
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 p-2 hover:bg-secondary rounded-md">
                  <ListChecks className="w-4 h-4 opacity-75" />
                  Bảng chấm công tháng 1
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
