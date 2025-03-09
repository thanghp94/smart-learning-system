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
import { useNavigate } from "react-router-dom";

const sampleClasses: Class[] = [
  {
    id: "1",
    Ten_lop_full: "Lớp Toán 10A",
    ten_lop: "T10A",
    ct_hoc: "Chương trình chuẩn",
    GV_chinh: "NV001",
    so_hs: 25,
    ngay_bat_dau: "2023-09-01",
    tinh_trang: "active",
    co_so: "CS001",
    ghi_chu: "Lớp học buổi sáng"
  },
  {
    id: "2",
    Ten_lop_full: "Lớp Văn 11B",
    ten_lop: "V11B",
    ct_hoc: "Chương trình nâng cao",
    GV_chinh: "NV002",
    so_hs: 20,
    ngay_bat_dau: "2023-09-05",
    tinh_trang: "active",
    co_so: "CS001",
    ghi_chu: "Lớp học buổi chiều"
  },
  {
    id: "3",
    Ten_lop_full: "Lớp Anh 12C",
    ten_lop: "A12C",
    ct_hoc: "Chương trình IELTS",
    GV_chinh: "NV003",
    so_hs: 15,
    ngay_bat_dau: "2023-08-15",
    tinh_trang: "inactive",
    co_so: "CS002",
    ghi_chu: "Lớp học tối"
  }
];

const Classes = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      
      if (isDemoMode) {
        setTimeout(() => {
          setClasses(sampleClasses);
          setIsLoading(false);
        }, 800);
        return;
      }
      
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
    navigate(`/classes/${classItem.id}`);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedClass(null);
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
      render: (value: number) => <span>{value || 0}</span>,
    },
    {
      title: "Ngày Bắt Đầu",
      key: "ngay_bat_dau",
      sortable: true,
      render: (value: string) => <span>{formatDate(value)}</span>,
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
      {isDemoMode && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          <strong>Chế độ demo:</strong> Hiển thị dữ liệu mẫu. Cấu hình Supabase để xem dữ liệu thực tế.
        </div>
      )}
      
      <DataTable
        columns={columns}
        data={classes}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        searchable={true}
        searchPlaceholder="Tìm kiếm lớp học..."
      />
    </TablePageLayout>
  );
};

export default Classes;
