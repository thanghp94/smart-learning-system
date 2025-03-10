
import React from "react";
import { FileSignature, Filter, Plus, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import ExportButton from "@/components/ui/ExportButton";

interface Request {
  id: string;
  title: string;
  description?: string;
  requester: string;
  status: string;
  priority?: string;
  created_at: string;
}

interface RequestsTableProps {
  requests: Request[];
  isLoading: boolean;
  onAddRequest: () => void;
  onRefresh: () => void;
}

const RequestsTable: React.FC<RequestsTableProps> = ({ 
  requests, 
  isLoading,
  onAddRequest,
  onRefresh
}) => {
  const columns = [
    {
      title: "Tiêu đề",
      key: "title",
      sortable: true,
    },
    {
      title: "Người yêu cầu",
      key: "requester",
      sortable: true,
    },
    {
      title: "Trạng thái",
      key: "status",
      sortable: true,
      render: (value: string) => {
        let color = "default";
        if (value === "approved") color = "success";
        if (value === "rejected") color = "destructive";
        if (value === "pending") color = "warning";
        
        const label = value === "approved" ? "Đã duyệt" : 
                     value === "rejected" ? "Từ chối" : 
                     value === "pending" ? "Chờ duyệt" : value;
        
        return <Badge variant={color as any}>{label}</Badge>;
      },
    },
    {
      title: "Mức độ ưu tiên",
      key: "priority",
      sortable: true,
      render: (value: string) => {
        let color = "secondary";
        if (value === "Critical") color = "destructive";
        if (value === "High") color = "warning";
        if (value === "Low") color = "outline";
        
        return <Badge variant={color as any}>{value || "Medium"}</Badge>;
      },
    },
    {
      title: "Ngày tạo",
      key: "created_at",
      sortable: true,
      render: (value: string) => formatDate(value),
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button size="sm" className="h-8" onClick={onAddRequest}>
        <Plus className="h-4 w-4 mr-1" /> Thêm mới
      </Button>
      <Button variant="outline" size="sm" className="h-8" onClick={onRefresh}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <ExportButton 
        data={requests} 
        filename="Danh_sach_de_xuat" 
        label="Xuất dữ liệu"
      />
    </div>
  );

  return (
    <TablePageLayout
      title="Đề Xuất"
      description="Quản lý các đề xuất xin phép"
      actions={tableActions}
    >
      <DataTable
        columns={columns}
        data={requests}
        isLoading={isLoading}
        searchable={true}
        searchPlaceholder="Tìm kiếm đề xuất..."
      />
    </TablePageLayout>
  );
};

export default RequestsTable;
