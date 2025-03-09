
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { classService } from "@/lib/supabase";
import { Class } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import DetailPanel from "@/components/ui/DetailPanel";
import ClassDetail from "./ClassDetail";
import ClassForm from "./ClassForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import PlaceholderPage from "@/components/common/PlaceholderPage";

const Classes = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
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

  const handleRowClick = (classData: Class) => {
    setSelectedClass(classData);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddFormCancel = () => {
    setShowAddForm(false);
  };

  const handleAddFormSubmit = async (formData: Partial<Class>) => {
    try {
      console.log("Submitting class data:", formData);
      const newClass = await classService.create(formData);
      setClasses([...classes, newClass]);
      toast({
        title: "Thành công",
        description: "Thêm lớp học mới thành công",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding class:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm lớp học mới",
        variant: "destructive"
      });
    }
  };

  const columns = [
    {
      title: "Tên Lớp Đầy Đủ",
      key: "Ten_lop_full",
      sortable: true,
    },
    {
      title: "Tên Lớp",
      key: "ten_lop",
      sortable: true,
    },
    {
      title: "Chương Trình",
      key: "ct_hoc",
    },
    {
      title: "Ngày Bắt Đầu",
      key: "ngay_bat_dau",
      sortable: true,
      render: (value: string) => value ? new Date(value).toLocaleDateString('vi-VN') : '',
    },
    {
      title: "Tình Trạng",
      key: "tinh_trang",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "active" ? "success" : value === "inactive" ? "destructive" : "secondary"}>
          {value === "active" ? "Đang hoạt động" : value === "inactive" ? "Ngừng hoạt động" : "Chờ xử lý"}
        </Badge>
      ),
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchClasses}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Lớp Học
      </Button>
    </div>
  );

  return (
    <>
      {classes.length === 0 && !isLoading ? (
        <PlaceholderPage
          title="Lớp Học"
          description="Quản lý thông tin lớp học"
          addButtonAction={handleAddClick}
        />
      ) : (
        <TablePageLayout
          title="Lớp Học"
          description="Quản lý thông tin lớp học"
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
        </TablePageLayout>
      )}

      {selectedClass && (
        <DetailPanel
          title="Thông Tin Lớp Học"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <ClassDetail classItem={selectedClass} />
        </DetailPanel>
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Lớp Học Mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin lớp học mới vào mẫu dưới đây
            </DialogDescription>
          </DialogHeader>
          <ClassForm 
            onSubmit={handleAddFormSubmit}
            onCancel={handleAddFormCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Classes;
