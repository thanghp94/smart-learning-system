import React, { useState, useEffect } from "react";
import { Plus, FileDown, RotateCw } from "lucide-react";
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
import { useDatabase } from "@/contexts/DatabaseContext";
import ClassFilters from "./components/ClassFilters";

const Classes = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const { initializeDatabase, reinitializePolicies } = useDatabase();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching classes...");
      const data = await classService.getAll();
      console.log("Classes data received:", data);
      
      if (data && Array.isArray(data)) {
        setClasses(data as unknown as Class[]);
        setFilteredClasses(data as unknown as Class[]);
        console.log("Classes set to state:", data.length);
      } else {
        console.error("Invalid classes data:", data);
        setClasses([]);
        setFilteredClasses([]);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách lớp học",
        variant: "destructive"
      });
      setClasses([]);
      setFilteredClasses([]);
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

  const handleFilterChange = ({ facility, program }: { facility?: string, program?: string }) => {
    if (!facility && !program) {
      setFilteredClasses(classes);
      return;
    }

    const filtered = classes.filter(cls => {
      let matchesFacility = true;
      let matchesProgram = true;

      if (facility) {
        matchesFacility = cls.co_so === facility;
      }

      if (program) {
        matchesProgram = cls.ct_hoc === program;
      }

      return matchesFacility && matchesProgram;
    });

    setFilteredClasses(filtered);
  };

  const handleResetFilters = () => {
    setFilteredClasses(classes);
  };

  const handleAddFormSubmit = async (formData: Partial<Class>) => {
    try {
      console.log("Submitting class data:", formData);
      const classDataToSubmit = {
        ...formData,
        ten_lop_full: formData.ten_lop_full || '',
        ten_lop: formData.ten_lop || '',
        ct_hoc: formData.ct_hoc || ''
      };
      
      const newClass = await classService.create(classDataToSubmit as any);
      console.log("New class created successfully:", newClass);
      
      toast({
        title: "Thành công",
        description: "Thêm lớp học mới thành công",
      });
      setShowAddForm(false);
      await fetchClasses();
    } catch (error: any) {
      console.error("Error adding class:", error);
      
      await reinitializePolicies();
      
      let errorMsg = "Không thể thêm lớp học mới";
      if (error && error.message) {
        errorMsg += `: ${error.message}`;
      }
      
      if (error && error.code === 'PGRST204') {
        setErrorMessage("Có vấn đề với cấu trúc cơ sở dữ liệu. Bạn có muốn khởi tạo lại cấu trúc cơ sở dữ liệu không?");
        setShowErrorDialog(true);
      } else {
        toast({
          title: "Lỗi",
          description: errorMsg,
          variant: "destructive"
        });
      }
    }
  };

  const handleInitializeDatabase = async () => {
    try {
      await initializeDatabase();
      setShowErrorDialog(false);
      toast({
        title: "Thành công",
        description: "Đã khởi tạo lại cơ sở dữ liệu. Vui lòng thử lại.",
      });
      await fetchClasses();
    } catch (error) {
      console.error("Error initializing database:", error);
      toast({
        title: "Lỗi",
        description: "Không thể khởi tạo lại cơ sở dữ liệu",
        variant: "destructive"
      });
    }
  };

  const columns = [
    {
      title: "Tên Lớp Đầy Đủ",
      key: "ten_lop_full",
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
      <ClassFilters 
        onFilterChange={handleFilterChange} 
        onReset={handleResetFilters} 
      />
      
      <Button variant="outline" size="sm" className="h-8" onClick={fetchClasses}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
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
      {(classes.length === 0 && !isLoading) ? (
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
            data={filteredClasses}
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
          {selectedClass && <ClassDetail classItem={selectedClass} />}
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

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Lỗi</DialogTitle>
            <DialogDescription>
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowErrorDialog(false)}>Hủy</Button>
            <Button onClick={handleInitializeDatabase}>Khởi tạo lại cơ sở dữ liệu</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Classes;
