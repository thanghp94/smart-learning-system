
import React from "react";
import { FileSignature, FileDown, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface Request {
  id: string;
  title: string;
  description?: string;
  requester: string;
  status: string;
  priority: string;
  created_at: string;
}

interface RequestsTableProps {
  requests: Request[];
  isLoading: boolean;
  onAddRequest: () => void;
}

const RequestsTable: React.FC<RequestsTableProps> = ({ 
  requests, 
  isLoading,
  onAddRequest 
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
        if (value === "Approved") color = "success";
        if (value === "Rejected") color = "destructive";
        if (value === "Pending") color = "warning";
        
        return <Badge variant={color as any}>{value}</Badge>;
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
        
        return <Badge variant={color as any}>{value}</Badge>;
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
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
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
