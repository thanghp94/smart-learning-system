
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Student } from "@/lib/types";
import { formatDate } from "@/utils/format";
import DataTable from "@/components/ui/DataTable";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, RefreshCw } from "lucide-react";
import { studentService } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export interface StudentsListProps {
  data: Student[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddStudent: () => void;
}

const StudentsList: React.FC<StudentsListProps> = ({ 
  data, 
  isLoading, 
  onRefresh,
  onAddStudent 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const handleView = (id: string) => {
    navigate(`/students/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/students/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(id);
      await studentService.delete(id);
      toast({
        title: "Xóa thành công",
        description: "Học sinh đã được xóa khỏi hệ thống",
      });
      onRefresh();
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        title: "Lỗi xóa học sinh",
        description: "Không thể xóa học sinh. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(null);
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
    },
    {
      title: "Ngày sinh",
      key: "ngay_sinh",
      sortable: true,
      render: (value: string) => <span>{formatDate(value)}</span>,
    },
    {
      title: "Phụ huynh",
      key: "ten_ph",
      sortable: true,
    },
    {
      title: "Liên hệ",
      key: "sdt_ph1",
      sortable: true,
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      sortable: true,
      width: "120px",
      render: (value: string) => (
        <span
          className={`inline-block px-2 py-1 text-xs rounded-full ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {value === "active" ? "Hoạt động" : value}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: "50px",
      render: (_, record: Student) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              disabled={deleteLoading === record.id}
            >
              {deleteLoading === record.id ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <MoreHorizontal className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(record.id)}>
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(record.id)}>
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => handleDelete(record.id)}
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="flex justify-between p-4 border-b">
        <h3 className="text-lg font-medium">Danh sách học sinh</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button size="sm" onClick={onAddStudent}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm học sinh
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        onRowClick={(record) => handleView(record.id)}
      />
    </Card>
  );
};

export default StudentsList;
