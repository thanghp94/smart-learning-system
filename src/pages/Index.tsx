
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { activityService } from "@/lib/supabase";
import { Activity } from "@/lib/types";
import { ArrowUp, ArrowDown, Users, Layers, School, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await activityService.getAll();
        setActivities(data.slice(0, 10)); // Get last 10 activities
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const stats = [
    {
      title: "Học Sinh",
      value: "124",
      description: "Tăng 14% so với tháng trước",
      trend: "up",
      icon: Users,
      onClick: () => navigate("/students"),
    },
    {
      title: "Lớp Học",
      value: "35",
      description: "Tăng 5% so với tháng trước",
      trend: "up", 
      icon: School,
      onClick: () => navigate("/classes"),
    },
    {
      title: "Nhân Viên",
      value: "48",
      description: "Không thay đổi so với tháng trước",
      trend: "neutral",
      icon: Briefcase,
      onClick: () => navigate("/employees"),
    },
    {
      title: "Cơ Sở",
      value: "5",
      description: "Tăng 1 cơ sở mới",
      trend: "up",
      icon: Layers,
      onClick: () => navigate("/facilities"),
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tổng quan</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card 
            key={i} 
            className="cursor-pointer hover:bg-accent/10 transition-colors"
            onClick={stat.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {stat.trend === "up" && <ArrowUp className="mr-1 h-4 w-4 text-green-500" />}
                {stat.trend === "down" && <ArrowDown className="mr-1 h-4 w-4 text-red-500" />}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Các hoạt động trong hệ thống 
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={activities} isLoading={isLoading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông báo</CardTitle>
            <CardDescription>
              Các thông báo mới nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-md bg-accent/10">
                <p className="font-medium">Sự kiện sắp tới</p>
                <p className="text-sm text-muted-foreground">
                  Buổi hội thảo phụ huynh ngày 25/10/2023
                </p>
              </div>
              <div className="p-3 border rounded-md bg-accent/10">
                <p className="font-medium">Deadline báo cáo</p>
                <p className="text-sm text-muted-foreground">
                  Nộp báo cáo tài chính quý 3 trước ngày 15/10/2023
                </p>
              </div>
              <div className="p-3 border rounded-md bg-accent/10">
                <p className="font-medium">Cập nhật hệ thống</p>
                <p className="text-sm text-muted-foreground">
                  Hệ thống sẽ bảo trì từ 22:00 - 23:00 ngày 18/10/2023
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
