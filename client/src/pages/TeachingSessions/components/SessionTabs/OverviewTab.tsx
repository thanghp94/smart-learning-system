
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList, 
  Star, 
  Clock, 
  Calendar,
  Pencil,
  Building
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { TeachingSession } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SessionEvaluationForm from "../SessionEvaluationForm";

interface OverviewTabProps {
  session: TeachingSession;
  teacherName: string;
  assistantName?: string;
  className: string;
  onRefresh: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  session,
  teacherName,
  assistantName,
  className,
  onRefresh,
}) => {
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  
  const formatTime = (time: string | undefined) => {
    if (!time) return "";
    return time.substring(0, 5);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5" />
              Thông tin buổi học
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Lớp</p>
              <p className="font-medium">{className}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Buổi số</p>
              <p className="font-medium">{session.session_id}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Loại buổi học</p>
              <p className="font-medium">
                {session.loai_bai_hoc === "normal" && "Bình thường"}
                {session.loai_bai_hoc === "review" && "Ôn tập"}
                {session.loai_bai_hoc === "test" && "Kiểm tra"}
                {session.loai_bai_hoc === "special" && "Đặc biệt"}
                {!session.loai_bai_hoc && "N/A"}
              </p>
            </div>

            {session.co_so_id && (
              <div>
                <p className="text-sm text-muted-foreground">Cơ sở</p>
                <p className="font-medium flex items-center">
                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                  {session.co_so_id}
                </p>
              </div>
            )}
            
            {session.phong_hoc_id && (
              <div>
                <p className="text-sm text-muted-foreground">Phòng học</p>
                <p className="font-medium">{session.phong_hoc_id}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Thời gian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Ngày học</p>
              <p className="font-medium">
                {session.ngay_hoc && format(new Date(session.ngay_hoc), "EEEE, dd/MM/yyyy", { locale: vi })}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Thời gian</p>
              <p className="font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                {formatTime(session.thoi_gian_bat_dau)} - {formatTime(session.thoi_gian_ket_thuc)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Giáo viên</p>
              <p className="font-medium">{teacherName}</p>
            </div>
            
            {assistantName && (
              <div>
                <p className="text-sm text-muted-foreground">Trợ giảng</p>
                <p className="font-medium">{assistantName}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5" />
            Đánh giá buổi học
          </CardTitle>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowEvaluationForm(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Đánh giá
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {session.danh_gia_buoi_hoc ? (
            <>
              <div>
                <p className="text-sm text-muted-foreground">Đánh giá chung</p>
                <p className="whitespace-pre-line">{session.danh_gia_buoi_hoc}</p>
              </div>
              
              {(session.diem_manh || session.diem_yeu) && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {session.diem_manh && (
                      <div>
                        <p className="text-sm text-muted-foreground">Điểm mạnh</p>
                        <p className="whitespace-pre-line">{session.diem_manh}</p>
                      </div>
                    )}
                    
                    {session.diem_yeu && (
                      <div>
                        <p className="text-sm text-muted-foreground">Điểm cần cải thiện</p>
                        <p className="whitespace-pre-line">{session.diem_yeu}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {session.ghi_chu_danh_gia && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Ghi chú</p>
                    <p className="whitespace-pre-line">{session.ghi_chu_danh_gia}</p>
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">Chưa có đánh giá cho buổi học này</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="mr-2 h-5 w-5" />
            Nội dung buổi học
          </CardTitle>
        </CardHeader>
        <CardContent>
          {session.noi_dung ? (
            <div className="whitespace-pre-line">{session.noi_dung}</div>
          ) : (
            <p className="text-muted-foreground">Chưa có nội dung</p>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showEvaluationForm} onOpenChange={setShowEvaluationForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Đánh giá buổi học</DialogTitle>
          </DialogHeader>
          <SessionEvaluationForm 
            session={session} 
            onSuccess={() => {
              setShowEvaluationForm(false);
              onRefresh();
            }}
            onCancel={() => setShowEvaluationForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OverviewTab;
