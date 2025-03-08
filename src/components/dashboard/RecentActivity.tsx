
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";

interface RecentActivityProps {
  activities: ActivityItem[];
}

// Mock data for recent activities
const mockActivities: ActivityItem[] = [
  {
    id: "1",
    action: "Thêm mới",
    type: "Học sinh",
    name: "Nguyễn Văn A",
    user: "Admin",
    timestamp: "2023-06-01T09:30:00",
    status: "completed"
  },
  {
    id: "2",
    action: "Cập nhật",
    type: "Lớp học",
    name: "Lớp Toán 10A",
    user: "Giáo viên",
    timestamp: "2023-06-01T10:15:00",
    status: "completed"
  },
  {
    id: "3",
    action: "Đặt lịch",
    type: "Buổi dạy",
    name: "Toán học cơ bản",
    user: "Quản lý",
    timestamp: "2023-06-01T11:00:00",
    status: "pending"
  },
  {
    id: "4",
    action: "Hủy",
    type: "Buổi dạy",
    name: "Tiếng Anh nâng cao",
    user: "Giáo viên",
    timestamp: "2023-06-01T13:45:00",
    status: "inactive"
  },
  {
    id: "5",
    action: "Thanh toán",
    type: "Học phí",
    name: "Nguyễn Văn B",
    user: "Kế toán",
    timestamp: "2023-06-01T14:30:00",
    status: "active"
  }
];

const RecentActivity: React.FC<RecentActivityProps> = ({ 
  activities = mockActivities 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
        <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div 
              key={activity.id}
              className={cn(
                "flex justify-between items-start pb-4", 
                index !== activities.length - 1 && "border-b border-border"
              )}
            >
              <div>
                <div className="font-medium">
                  {activity.action} {activity.type}: {activity.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Bởi {activity.user} • {formatDate(activity.timestamp)}
                </div>
              </div>
              {activity.status && (
                <Badge className={cn(STATUS_COLORS[activity.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default)}>
                  {activity.status === "active" && "Hoạt động"}
                  {activity.status === "pending" && "Đang chờ"}
                  {activity.status === "inactive" && "Đã hủy"}
                  {activity.status === "completed" && "Hoàn thành"}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
