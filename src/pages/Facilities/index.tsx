import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { facilityService } from "@/lib/supabase";
import { Facility } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import DetailPanel from "@/components/ui/DetailPanel";
import FacilityDetail from "./FacilityDetail";
import FacilityForm from "./FacilityForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import { useDatabase } from "@/contexts/DatabaseContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Facilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const { isDemoMode, initializeDatabase } = useDatabase();

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setIsLoading(true);
      const data = await facilityService.getAll();
      setFacilities(data);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách cơ sở",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (facility: Facility) => {
    setSelectedFacility(facility);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const handleAddClick = () => {
    setShowAddDialog(true);
  };

  const handleAddFacility = async (data: any) => {
    try {
      if (isDemoMode) {
        await initializeDatabase();
        toast({
          title: "Chế độ Demo",
          description: "Đã khởi tạo dữ liệu demo. Vui lòng thử lại thao tác của bạn.",
        });
        fetchFacilities();
        setShowAddDialog(false);
        return;
      }

      console.log("Adding facility with data:", data);
      const newFacility = await facilityService.create(data);
      
      if (newFacility) {
        setFacilities([...facilities, newFacility]);
        toast({
          title: "Thành công",
          description: "Đã thêm cơ sở mới vào hệ thống",
        });
        setShowAddDialog(false);
      }
    } catch (error: any) {
      console.error("Error adding facility:", error);
      
      if (error.code === '42501' || (error.message && error.message.includes('row-level security policy'))) {
        setErrorMessage("Bạn không có quyền thêm cơ sở mới. Vui lòng kiểm tra quyền truy cập hoặc đăng nhập với tài khoản có quyền quản trị.");
        setShowErrorDialog(true);
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể thêm cơ sở mới: " + (error.message || "Lỗi không xác định"),
          variant: "destructive"
        });
      }
    }
  };

  const handleInitDatabase = async () => {
    try {
      setIsLoading(true);
      await initializeDatabase();
      toast({
        title: "Thành công",
        description: "Đã khởi tạo lại cơ sở dữ liệu và quyền truy cập",
      });
      fetchFacilities();
      setShowErrorDialog(false);
    } catch (error) {
      console.error("Error initializing database:", error);
      toast({
        title: "Lỗi",
        description: "Không thể khởi tạo lại cơ sở dữ liệu",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Tên cơ sở",
      key: "ten_co_so",
      sortable: true,
    },
    {
      title: "Loại cơ sở",
      key: "loai_co_so",
      sortable: true,
    },
    {
      title: "Địa chỉ",
      key: "dia_chi_co_so",
    },
    {
      title: "Số điện thoại",
      key: "phone",
    },
    {
      title: "Email",
      key: "email",
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "active" ? "success" : "destructive"}>
          {value === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
        </Badge>
      ),
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchFacilities}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Cơ Sở
      </Button>
    </div>
  );

  return (
    <>
      {facilities.length === 0 && !isLoading ? (
        <PlaceholderPage
          title="Cơ Sở"
          description="Quản lý thông tin cơ sở trong hệ thống"
          icon={<Plus className="h-16 w-16 text-muted-foreground/40" />}
          addButtonAction={handleAddClick}
        />
      ) : (
        <TablePageLayout
          title="Cơ Sở"
          description="Quản lý thông tin cơ sở trong hệ thống"
          actions={tableActions}
        >
          <DataTable
            columns={columns}
            data={facilities}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            searchable={true}
            searchPlaceholder="Tìm kiếm cơ sở..."
          />
        </TablePageLayout>
      )}

      {selectedFacility && (
        <DetailPanel
          title="Thông Tin Cơ Sở"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <FacilityDetail facilityId={selectedFacility.id} />
        </DetailPanel>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Cơ Sở Mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin cơ sở mới vào mẫu dưới đây
            </DialogDescription>
          </DialogHeader>
          <FacilityForm 
            onSubmit={handleAddFacility}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Lỗi bảo mật</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
            <AlertDialogAction onClick={handleInitDatabase}>
              Khởi tạo lại cơ sở dữ liệu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Facilities;
