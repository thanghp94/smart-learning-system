
import React from "react";
import DataTable from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Enrollment } from "@/lib/types";

interface EnrollmentTableProps {
  enrollments: Enrollment[];
  isLoading: boolean;
  onRowClick: (enrollment: Enrollment) => void;
  onEditClick: (enrollment: Enrollment) => void;
}

const EnrollmentTable: React.FC<EnrollmentTableProps> = ({
  enrollments,
  isLoading,
  onRowClick,
  onEditClick,
}) => {
  const columns = [
    {
      title: "Học sinh",
      key: "ten_hoc_sinh",
      sortable: true,
      render: (value: string, record: Enrollment) => (
        <div>
          <span className="font-medium">{value}</span>
          {record.hoc_sinh_id && (
            <span className="text-xs text-muted-foreground block">ID: {record.hoc_sinh_id}</span>
          )}
        </div>
      )
    },
    {
      title: "Lớp",
      key: "ten_lop_full",
      sortable: true,
      render: (value: string, record: Enrollment) => (
        <div>
          <span>{value || record.class_name || "Không có thông tin"}</span>
          {record.ct_hoc && (
            <span className="text-xs text-muted-foreground block">CT: {record.ct_hoc}</span>
          )}
        </div>
      )
    },
    {
      title: "Chương trình học",
      key: "ct_hoc",
      sortable: true,
      render: (value: string) => <span>{value || "-"}</span>
    },
    {
      title: "Trạng thái điểm danh",
      key: "tinh_trang_diem_danh",
      sortable: true,
      render: (value: string) => (
        <Badge variant={
          value === "present" ? "success" : 
          value === "absent" ? "destructive" : 
          value === "late" ? "warning" : 
          "secondary"
        }>
          {value === "present" ? "Có mặt" : 
           value === "absent" ? "Vắng mặt" : 
           value === "late" ? "Đi trễ" : value || "Chưa điểm danh"}
        </Badge>
      )
    },
    {
      title: "Ghi chú",
      key: "ghi_chu",
      render: (value: string) => <span>{value || "-"}</span>
    },
    {
      title: "",
      key: "actions",
      width: "100px",
      render: (_: any, record: Enrollment) => (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEditClick(record);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={enrollments}
      isLoading={isLoading}
      searchable={true}
      searchPlaceholder="Tìm kiếm ghi danh..."
      onRowClick={onRowClick}
    />
  );
};

export default EnrollmentTable;
