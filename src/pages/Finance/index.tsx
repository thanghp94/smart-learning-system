
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, RotateCw, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { financeService, facilityService } from "@/lib/supabase";
import { Finance, Facility } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import FinanceForm from "./FinanceForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

const FinancePage = () => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFinances();
    fetchFacilities();
  }, []);

  const fetchFinances = async () => {
    try {
      setIsLoading(true);
      const data = await financeService.getAll();
      setFinances(data);
    } catch (error) {
      console.error("Error fetching finances:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu tài chính",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      const data = await facilityService.getAll();
      setFacilities(data);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddFormCancel = () => {
    setShowAddForm(false);
  };

  const handleAddFormSubmit = async (formData: Partial<Finance>) => {
    try {
      console.log("Submitting finance data:", formData);
      await financeService.create(formData);
      toast({
        title: "Thành công",
        description: "Thêm dữ liệu tài chính mới thành công",
      });
      setShowAddForm(false);
      fetchFinances();
    } catch (error) {
      console.error("Error adding finance:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm dữ liệu tài chính mới",
        variant: "destructive"
      });
    }
  };

  const columns = [
    {
      title: "Loại",
      key: "loai_thu_chi",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "income" ? "success" : "destructive"}>
          {value === "income" ? "Thu" : "Chi"}
        </Badge>
      ),
    },
    {
      title: "Diễn giải",
      key: "dien_giai",
      sortable: true,
    },
    {
      title: "Ngày",
      key: "ngay",
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      title: "Số tiền",
      key: "tong_tien",
      sortable: true,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Trạng thái",
      key: "tinh_trang",
      sortable: true,
      render: (value: string) => (
        <Badge variant={
          value === "completed" ? "success" : 
          value === "rejected" ? "destructive" : 
          value === "pending" ? "warning" : 
          "secondary"
        }>
          {value === "completed" ? "Hoàn thành" : 
          value === "rejected" ? "Từ chối" : 
          value === "pending" ? "Chờ duyệt" : value}
        </Badge>
      ),
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchFinances}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm giao dịch
      </Button>
    </div>
  );

  if (finances.length === 0 && !isLoading) {
    return (
      <PlaceholderPage
        title="Tài Chính"
        description="Quản lý thu chi và giao dịch tài chính"
        icon={<DollarSign className="h-16 w-16 text-muted-foreground/40" />}
        addButtonAction={handleAddClick}
      />
    );
  }

  return (
    <>
      <TablePageLayout
        title="Tài Chính"
        description="Quản lý thu chi và giao dịch tài chính"
        actions={tableActions}
      >
        <DataTable
          columns={columns}
          data={finances}
          isLoading={isLoading}
          searchable={true}
          searchPlaceholder="Tìm kiếm giao dịch..."
        />
      </TablePageLayout>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Giao Dịch Mới</DialogTitle>
            <DialogDescription>
              Điền thông tin giao dịch mới và nhấn lưu để tạo giao dịch.
            </DialogDescription>
          </DialogHeader>
          <FinanceForm 
            onSubmit={handleAddFormSubmit}
            onCancel={handleAddFormCancel}
            facilities={facilities}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FinancePage;
