import React from 'react';
import { Request } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import TablePageLayout from '@/components/common/TablePageLayout';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import ExportButton from '@/components/ui/ExportButton';
import FilterButton, { FilterCategory } from '@/components/ui/FilterButton';

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
  const [filters, setFilters] = useState<Record<string, string>>({});
  
  const statusOptions = useMemo(() => {
    const statuses = [...new Set(requests.map(r => r.status))].map(status => ({
      label: status === "approved" ? "Đã duyệt" : 
             status === "rejected" ? "Từ chối" : 
             status === "pending" ? "Chờ duyệt" : status,
      value: status,
      type: 'status' as const
    }));
    return statuses;
  }, [requests]);
  
  const priorityOptions = useMemo(() => {
    const priorities = [...new Set(requests.map(r => r.priority || "Medium"))].map(priority => ({
      label: priority,
      value: priority,
      type: 'other' as const
    }));
    return priorities;
  }, [requests]);
  
  const filterCategories: FilterCategory[] = [
    {
      name: 'Trạng thái',
      type: 'status',
      options: statusOptions
    },
    {
      name: 'Mức độ ưu tiên',
      type: 'other',
      options: priorityOptions
    }
  ];
  
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      for (const [category, value] of Object.entries(filters)) {
        if (value) {
          if (category === 'Trạng thái' && request.status !== value) return false;
          if (category === 'Mức độ ưu tiên' && (request.priority || 'Medium') !== value) return false;
        }
      }
      return true;
    });
  }, [requests, filters]);

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
    </div>
  );

  const tableFilters = (
    <div className="flex items-center space-x-2">
      <FilterButton 
        categories={filterCategories} 
        onFilter={setFilters} 
      />
      <ExportButton 
        data={filteredRequests} 
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
      filters={tableFilters}
    >
      <DataTable
        columns={columns}
        data={filteredRequests}
        isLoading={isLoading}
        searchable={true}
        searchPlaceholder="Tìm kiếm đề xuất..."
      />
    </TablePageLayout>
  );
};

export default RequestsTable;
