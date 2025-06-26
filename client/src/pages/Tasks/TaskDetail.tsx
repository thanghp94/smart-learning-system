
import React from "react";
import { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface TaskDetailProps {
  task: Task;
}

const priorityMap: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" | "success" }> = {
  low: { label: "Thấp", variant: "outline" },
  normal: { label: "Bình thường", variant: "secondary" },
  high: { label: "Cao", variant: "destructive" },
  urgent: { label: "Khẩn cấp", variant: "destructive" },
};

const statusMap: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" | "success" }> = {
  pending: { label: "Chờ xử lý", variant: "secondary" },
  processing: { label: "Đang thực hiện", variant: "default" },
  completed: { label: "Hoàn thành", variant: "success" },
  overdue: { label: "Quá hạn", variant: "destructive" },
  cancelled: { label: "Đã hủy", variant: "outline" },
};

const TaskDetail: React.FC<TaskDetailProps> = ({ task }) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  const priorityInfo = priorityMap[task.cap_do || "normal"] || { label: task.cap_do, variant: "secondary" };
  const statusInfo = statusMap[task.trang_thai || "pending"] || { label: task.trang_thai, variant: "secondary" };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">{task.ten_viec}</h2>
          {task.loai_viec && <p className="text-muted-foreground">{task.loai_viec}</p>}
        </div>
        <div className="flex space-x-2">
          <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Thông tin cơ bản</h3>
          <dl className="space-y-2">
            <div className="grid grid-cols-2">
              <dt className="text-muted-foreground">Ngày đến hạn:</dt>
              <dd>{formatDate(task.ngay_den_han)}</dd>
            </div>
            {task.ngay_hoan_thanh && (
              <div className="grid grid-cols-2">
                <dt className="text-muted-foreground">Ngày hoàn thành:</dt>
                <dd>{formatDate(task.ngay_hoan_thanh)}</dd>
              </div>
            )}
            {task.nguoi_phu_trach && (
              <div className="grid grid-cols-2">
                <dt className="text-muted-foreground">Người phụ trách:</dt>
                <dd>{task.nguoi_phu_trach}</dd>
              </div>
            )}
            {task.doi_tuong && (
              <div className="grid grid-cols-2">
                <dt className="text-muted-foreground">Đối tượng:</dt>
                <dd>{task.doi_tuong}</dd>
              </div>
            )}
            {task.tg_tao && (
              <div className="grid grid-cols-2">
                <dt className="text-muted-foreground">Ngày tạo:</dt>
                <dd>{formatDate(task.tg_tao)}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {task.dien_giai && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Diễn giải</h3>
            <p className="whitespace-pre-line">{task.dien_giai}</p>
          </div>
        </>
      )}

      {task.ghi_chu && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Ghi chú</h3>
            <p className="whitespace-pre-line">{task.ghi_chu}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskDetail;
