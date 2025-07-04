
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, FileText } from "lucide-react";
import DetailPanel from "@/components/ui/DetailPanel";
import { Enrollment } from "@/lib/types";
import { Link } from "react-router-dom";

interface EnrollmentDetailPanelProps {
  enrollment: Enrollment | null;
  isOpen: boolean;
  onClose: () => void;
  onEditClick: () => void;
}

const EnrollmentDetailPanel: React.FC<EnrollmentDetailPanelProps> = ({
  enrollment,
  isOpen,
  onClose,
  onEditClick,
}) => {
  if (!enrollment) return null;

  return (
    <DetailPanel
      title="Chi tiết ghi danh"
      isOpen={isOpen}
      onClose={onClose}
      footerContent={
        <div className="flex justify-between space-x-2">
          {enrollment.hoc_sinh_id && (
            <Link to={`/students/${enrollment.hoc_sinh_id}`}>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-1" /> Xem học sinh
              </Button>
            </Link>
          )}
          <Button 
            variant="outline" 
            onClick={onEditClick}
          >
            <Edit className="h-4 w-4 mr-1" /> Sửa thông tin
          </Button>
        </div>
      }
      items={[
        { 
          label: "Học sinh", 
          value: enrollment.ten_hoc_sinh || enrollment.hoc_sinh_id 
        },
        { 
          label: "ID Học sinh", 
          value: enrollment.hoc_sinh_id || "-"
        },
        { 
          label: "Lớp học", 
          value: enrollment.ten_lop_full || enrollment.lop_chi_tiet_id 
        },
        { 
          label: "ID Lớp", 
          value: enrollment.lop_chi_tiet_id || "-"
        },
        { 
          label: "Chương trình học", 
          value: enrollment.ct_hoc || "-" 
        },
        { 
          label: "Trạng thái điểm danh", 
          value: (
            <Badge variant={
              enrollment.tinh_trang_diem_danh === "present" ? "success" : 
              enrollment.tinh_trang_diem_danh === "absent" ? "destructive" : 
              enrollment.tinh_trang_diem_danh === "late" ? "warning" : 
              "secondary"
            }>
              {enrollment.tinh_trang_diem_danh === "present" ? "Có mặt" : 
                enrollment.tinh_trang_diem_danh === "absent" ? "Vắng mặt" : 
                enrollment.tinh_trang_diem_danh === "late" ? "Đi trễ" : 
                enrollment.tinh_trang_diem_danh || "Chưa điểm danh"}
            </Badge>
          )
        },
        { 
          label: "Ghi chú", 
          value: enrollment.ghi_chu || "-" 
        },
        { 
          label: "Ngày tạo", 
          value: enrollment.created_at ? new Date(enrollment.created_at).toLocaleDateString('vi-VN') : "-" 
        },
      ]}
    />
  );
};

export default EnrollmentDetailPanel;
