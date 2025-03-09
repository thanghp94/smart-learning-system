
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import TablePageLayout from "@/components/common/TablePageLayout";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Session {
  id: string;
  unit_id: string;
  buoi_hoc_so: string;
  noi_dung_bai_hoc: string;
  tsi_lesson_plan?: string;
  rep_lesson_plan?: string;
  bai_tap?: string;
  created_at?: string;
  updated_at?: string;
}

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('sessions')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      setSessions(data || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu bài học",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSession = () => {
    toast({
      title: "Chức năng đang phát triển",
      description: "Tính năng thêm bài học mới sẽ sớm được cập nhật",
    });
  };

  const columns = [
    {
      title: "Buổi Học Số",
      key: "buoi_hoc_so",
      sortable: true,
    },
    {
      title: "Nội Dung",
      key: "noi_dung_bai_hoc",
      sortable: true,
    },
    {
      title: "Bài Tập",
      key: "bai_tap",
      sortable: true,
    },
    {
      title: "Unit ID",
      key: "unit_id",
      sortable: true,
    },
    {
      title: "Ngày Tạo",
      key: "created_at",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('vi-VN'),
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddSession}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Bài Học
      </Button>
    </div>
  );

  return (
    <TablePageLayout
      title="Bài Học"
      description="Quản lý nội dung và tài liệu bài giảng trong hệ thống"
      actions={tableActions}
    >
      <DataTable
        columns={columns}
        data={sessions}
        isLoading={isLoading}
        searchable={true}
        searchPlaceholder="Tìm kiếm bài học..."
      />
    </TablePageLayout>
  );
};

export default Sessions;
