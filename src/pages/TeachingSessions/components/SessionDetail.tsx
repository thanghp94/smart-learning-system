
import React from "react";
import { TeachingSession } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface SessionDetailProps {
  session: TeachingSession;
}

const SessionDetail: React.FC<SessionDetailProps> = ({ session }) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (e) {
      return "N/A";
    }
  };
  
  const formatSessionTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Format HH:MM
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">
          {session.class_name || "N/A"}
        </h2>
        <p className="text-muted-foreground">
          Buổi học số: {session.session_id} | {formatDate(session.ngay_hoc)}
        </p>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm font-medium text-muted-foreground">Thời gian:</span>
          <p>
            {formatSessionTime(session.thoi_gian_bat_dau)} - {formatSessionTime(session.thoi_gian_ket_thuc)}
          </p>
        </div>
        
        <div>
          <span className="text-sm font-medium text-muted-foreground">Trạng thái:</span>
          <p>
            <Badge variant={session.completed === "true" ? "success" : "secondary"}>
              {session.completed === "true" ? "Hoàn thành" : "Chưa hoàn thành"}
            </Badge>
          </p>
        </div>
        
        <div>
          <span className="text-sm font-medium text-muted-foreground">Giáo viên:</span>
          <p>{session.teacher_name || "N/A"}</p>
        </div>
        
        {session.assistant_name && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Trợ giảng:</span>
            <p>{session.assistant_name}</p>
          </div>
        )}
        
        <div>
          <span className="text-sm font-medium text-muted-foreground">Loại bài học:</span>
          <p>{session.loai_bai_hoc || "Học mới"}</p>
        </div>
      </div>
      
      <Separator />
      
      {session.lesson_content && (
        <div>
          <h3 className="font-semibold mb-2">Nội dung bài học:</h3>
          <p className="whitespace-pre-line">{session.lesson_content}</p>
        </div>
      )}
      
      {session.nhan_xet_chung && (
        <div>
          <h3 className="font-semibold mb-2">Nhận xét chung:</h3>
          <p className="whitespace-pre-line">{session.nhan_xet_chung}</p>
        </div>
      )}
      
      {(session.nhan_xet_1 || session.nhan_xet_2 || session.nhan_xet_3 || 
        session.nhan_xet_4 || session.nhan_xet_5 || session.nhan_xet_6) && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Đánh giá chi tiết:</h3>
            <div className="space-y-2">
              {session.nhan_xet_1 && (
                <div>
                  <span className="text-sm font-medium">Tiêu chí 1:</span>
                  <p>{session.nhan_xet_1}</p>
                </div>
              )}
              {session.nhan_xet_2 && (
                <div>
                  <span className="text-sm font-medium">Tiêu chí 2:</span>
                  <p>{session.nhan_xet_2}</p>
                </div>
              )}
              {session.nhan_xet_3 && (
                <div>
                  <span className="text-sm font-medium">Tiêu chí 3:</span>
                  <p>{session.nhan_xet_3}</p>
                </div>
              )}
              {session.nhan_xet_4 && (
                <div>
                  <span className="text-sm font-medium">Tiêu chí 4:</span>
                  <p>{session.nhan_xet_4}</p>
                </div>
              )}
              {session.nhan_xet_5 && (
                <div>
                  <span className="text-sm font-medium">Tiêu chí 5:</span>
                  <p>{session.nhan_xet_5}</p>
                </div>
              )}
              {session.nhan_xet_6 && (
                <div>
                  <span className="text-sm font-medium">Tiêu chí 6:</span>
                  <p>{session.nhan_xet_6}</p>
                </div>
              )}
              {session.trung_binh && (
                <div>
                  <span className="text-sm font-medium">Điểm trung bình:</span>
                  <p className="font-semibold">{session.trung_binh.toFixed(1)}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      
      {session.ghi_chu && (
        <div>
          <h3 className="font-semibold mb-2">Ghi chú:</h3>
          <p className="whitespace-pre-line">{session.ghi_chu}</p>
        </div>
      )}
    </div>
  );
};

export default SessionDetail;
