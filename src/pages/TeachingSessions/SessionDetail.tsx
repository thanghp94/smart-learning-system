
import React, { useState, useEffect } from "react";
import { TeachingSession, Class, Employee, Enrollment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { enrollmentService } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface SessionDetailProps {
  session: TeachingSession;
  class?: Class;
  teacher?: Employee;
}

const SessionDetail = ({ session, class: classItem, teacher }: SessionDetailProps) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setIsLoading(true);
        const data = await enrollmentService.getBySession(session.id);
        setEnrollments(data);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu điểm danh",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEnrollments();
  }, [session.id]);

  const getScoreClassName = (score?: string | number) => {
    if (!score) return "bg-gray-300";
    const numScore = Number(score);
    if (numScore >= 8) return "bg-green-500";
    if (numScore >= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const enrollmentColumns = [
    {
      title: "Học sinh ID",
      key: "hoc_sinh_id",
      sortable: true,
    },
    {
      title: "Điểm danh",
      key: "tinh_trang_diem_danh",
      sortable: true,
      render: (value: string) => (
        <Badge variant={
          value === "present" ? "success" : 
          value === "absent" ? "destructive" : 
          "secondary"
        }>
          {value === "present" ? "Có mặt" : 
           value === "absent" ? "Vắng mặt" : 
           value === "late" ? "Đi muộn" : value}
        </Badge>
      ),
    },
    {
      title: "Ghi chú",
      key: "ghi_chu",
      render: (value: string) => <span>{value || "Không có"}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          {classItem?.Ten_lop_full} - Buổi {session.session_id}
        </h2>
        <p className="text-muted-foreground">Loại bài học: {session.loai_bai_hoc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Buổi Học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Lớp:</span>
              <span className="text-sm col-span-2">{classItem?.Ten_lop_full}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Ngày học:</span>
              <span className="text-sm col-span-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(session.ngay_hoc)}
                </div>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Thời gian:</span>
              <span className="text-sm col-span-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {session.thoi_gian_bat_dau.substring(0, 5)} - {session.thoi_gian_ket_thuc.substring(0, 5)}
                </div>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Giáo viên:</span>
              <span className="text-sm col-span-2">{teacher?.ten_nhan_su || session.giao_vien}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Trợ giảng:</span>
              <span className="text-sm col-span-2">{session.tro_giang || "Không có"}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Phòng học:</span>
              <span className="text-sm col-span-2">{session.phong_hoc_id || "Chưa chỉ định"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đánh Giá Buổi Học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Điểm trung bình:</span>
              <Badge variant="outline" className="text-lg">
                {session.trung_binh?.toFixed(1) || "N/A"}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Tiêu chí 1</span>
                  <span className="font-medium">{session.nhan_xet_1 || "N/A"}</span>
                </div>
                <Progress value={Number(session.nhan_xet_1) * 10 || 0} className={getScoreClassName(session.nhan_xet_1)} />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Tiêu chí 2</span>
                  <span className="font-medium">{session.nhan_xet_2 || "N/A"}</span>
                </div>
                <Progress value={Number(session.nhan_xet_2) * 10 || 0} className={getScoreClassName(session.nhan_xet_2)} />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Tiêu chí 3</span>
                  <span className="font-medium">{session.nhan_xet_3 || "N/A"}</span>
                </div>
                <Progress value={Number(session.nhan_xet_3) * 10 || 0} className={getScoreClassName(session.nhan_xet_3)} />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Tiêu chí 4</span>
                  <span className="font-medium">{session.nhan_xet_4 || "N/A"}</span>
                </div>
                <Progress value={Number(session.nhan_xet_4) * 10 || 0} className={getScoreClassName(session.nhan_xet_4)} />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Tiêu chí 5</span>
                  <span className="font-medium">{session.nhan_xet_5 || "N/A"}</span>
                </div>
                <Progress value={Number(session.nhan_xet_5) * 10 || 0} className={getScoreClassName(session.nhan_xet_5)} />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Tiêu chí 6</span>
                  <span className="font-medium">{session.nhan_xet_6 || "N/A"}</span>
                </div>
                <Progress value={Number(session.nhan_xet_6) * 10 || 0} className={getScoreClassName(session.nhan_xet_6)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Điểm Danh Học Sinh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={enrollmentColumns}
            data={enrollments}
            isLoading={isLoading}
            searchable={true}
            searchPlaceholder="Tìm kiếm học sinh..."
          />
        </CardContent>
      </Card>

      {session.nhan_xet_chung && (
        <Card>
          <CardHeader>
            <CardTitle>Nhận Xét Chung</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{session.nhan_xet_chung}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionDetail;
