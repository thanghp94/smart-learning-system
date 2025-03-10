
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, BookOpen, Plus } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';

interface StudentsListProps {
  data: Student[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddStudent?: () => void;
}

const StudentsList: React.FC<StudentsListProps> = ({ 
  data, 
  isLoading, 
  onRefresh,
  onAddStudent 
}) => {
  const navigate = useNavigate();

  const handleView = (id: string) => {
    navigate(`/students/${id}`);
  };

  const handleEdit = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    navigate(`/students/edit/${id}`);
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;

    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inactive</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns = [
    {
      title: "Tên học sinh",
      key: "ten_hoc_sinh",
      sortable: true,
    },
    {
      title: "Giới tính",
      key: "gioi_tinh",
      sortable: true,
      render: (value: string) => <span>{value || "-"}</span>,
    },
    {
      title: "Parent",
      key: "ten_PH",
      sortable: true,
      render: (value: string) => <span>{value || "-"}</span>,
    },
    {
      title: "SDT",
      key: "sdt_ph1",
      sortable: true,
      render: (value: string) => <span>{value || "-"}</span>,
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      sortable: true,
      render: (value: string) => getStatusBadge(value),
    },
    {
      title: "",
      key: "actions",
      width: "100px",
      render: (_: any, record: Student) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => handleEdit(e, record.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/enrollments?student=${record.id}`);
            }}
          >
            <BookOpen className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Danh sách học sinh</h2>
        {onAddStudent && (
          <Button size="sm" onClick={onAddStudent}>
            <Plus className="h-4 w-4 mr-1" /> Thêm học sinh
          </Button>
        )}
      </div>
      
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchable={true}
        searchPlaceholder="Tìm kiếm học sinh..."
        onRowClick={(record) => handleView(record.id)}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default StudentsList;
