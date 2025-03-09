
import React from "react";
import { Check, X, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/ui/DataTable";

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
  onRowClick: (request: Request) => void;
}

const RequestsTable: React.FC<RequestsTableProps> = ({ 
  requests, 
  isLoading,
  onRowClick
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
        let variant;
        let icon;
        
        switch (value) {
          case "Approved":
            variant = "success";
            icon = <Check className="h-3 w-3 mr-1" />;
            break;
          case "Rejected":
            variant = "destructive";
            icon = <X className="h-3 w-3 mr-1" />;
            break;
          case "Pending":
            variant = "outline";
            icon = <Clock className="h-3 w-3 mr-1" />;
            break;
          default:
            variant = "secondary";
            icon = <AlertCircle className="h-3 w-3 mr-1" />;
        }
        
        return (
          <Badge variant={variant} className="flex items-center">
            {icon}
            {value}
          </Badge>
        );
      }
    },
    {
      title: "Độ ưu tiên",
      key: "priority",
      sortable: true,
      render: (value: string) => {
        let variant;
        
        switch (value) {
          case "High":
            variant = "destructive";
            break;
          case "Medium":
            variant = "warning";
            break;
          case "Low":
            variant = "outline";
            break;
          case "Critical":
            variant = "destructive-pill";
            break;
          default:
            variant = "secondary";
        }
        
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
    {
      title: "Ngày tạo",
      key: "created_at",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString("vi-VN")
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={requests}
      isLoading={isLoading}
      onRowClick={onRowClick}
      searchable={true}
      searchPlaceholder="Tìm kiếm đề xuất..."
    />
  );
};

export default RequestsTable;
