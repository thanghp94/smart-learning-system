
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { classService } from "@/lib/supabase";
import { Class } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import DetailPanel from "@/components/ui/DetailPanel";
import ClassDetail from "./ClassDetail";

const Classes = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const data = await classService.getAll();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách lớp học",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const columns = [
    {
      title: "Tên Lớp",
      key: "Ten_lop_full",
      sortable: true,
    },
    {
      title: "Mã Lớp",
      key: "ten_lop",
      sortable: true,
    },
    {
      title: "Chương Trình",
      key: "ct_hoc",
      sortable: true,
    },
    {
      title: "Giáo Viên",
      key: "GV_chinh",
      sortable: true,
    },
    {
      title: "Số Học Sinh",
      key: "so_hs",
      sortable: true,
      render: (value: number) => value || 0,
    },
    {
      title: "Ngày Bắt Đầu",
      key: "ngay_bat_dau",
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      title: "Tình Trạng",
      key: "tinh_trang",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "active" ? "success" : "secondary"}>
          {value === "active" ? "Đang hoạt động" : value}
        </Badge>
      ),
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
      <Button size="sm" className="h-8">
        <Plus className="h-4 w-4 mr-1" /> Thêm Lớp Học
      </Button>
    </div>
  );

  return (
    <TablePageLayout
      title="Lớp Học"
      description="Quản lý thông tin lớp học trong hệ thống"
      actions={tableActions}
    >
      <DataTable
        columns={columns}
        data={classes}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        searchable={true}
        searchPlaceholder="Tìm kiếm lớp học..."
      />

      {selectedClass && (
        <DetailPanel
          title="Thông Tin Lớp Học"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <ClassDetail classItem={selectedClass} />
        </DetailPanel>
      )}
    </TablePageLayout>
  );
};

export default Classes;
