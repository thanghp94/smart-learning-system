
import React, { useState, useEffect } from "react";
import { Plus, Filter, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { financeService, facilityService } from "@/lib/supabase";
import { Finance, Facility } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import DetailPanel from "@/components/ui/DetailPanel";
import FinanceDetail from "./FinanceDetail";
import FinanceForm from "./FinanceForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinanceLedger from "./components/FinanceLedger";
import ExportButton from "@/components/ui/ExportButton";

const FinancePage = () => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFinance, setSelectedFinance] = useState<Finance | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState("table");
  const { toast } = useToast();

  useEffect(() => {
    fetchFinances();
    fetchFacilities();
  }, []);

  const fetchFinances = async () => {
    try {
      setIsLoading(true);
      const data = await financeService.getAll();
      console.log("Finances data received:", data);
      
      if (Array.isArray(data)) {
        setFinances(data as Finance[]);
      } else {
        console.error("Invalid finances data format:", data);
        setFinances([]);
      }
    } catch (error) {
      console.error("Error fetching finances:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách tài chính. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      setFinances([]);
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
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách cơ sở.",
        variant: "destructive",
      });
    }
  };

  const handleRowClick = (finance: Finance) => {
    setSelectedFinance(finance);
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

  const handleAddFormSubmit = async (formData: Partial<Finance>) => {
    try {
      console.log("Submitting finance data:", formData);
      const newFinance = await financeService.create(formData);
      
      toast({
        title: "Thành công",
        description: "Thêm giao dịch tài chính mới thành công",
      });
      setShowAddForm(false);
      await fetchFinances();
    } catch (error) {
      console.error("Error adding finance:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm giao dịch tài chính mới",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const columns = [
    {
      title: "Ngày",
      key: "ngay",
      sortable: true,
      render: (value: string) => value ? format(new Date(value), 'dd/MM/yyyy') : '',
    },
    {
      title: "Loại Thu Chi",
      key: "loai_thu_chi",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "income" ? "success" : "destructive"}>
          {value === "income" ? "Thu" : "Chi"}
        </Badge>
      ),
    },
    {
      title: "Hạng mục",
      key: "loai_giao_dich",
      sortable: true,
    },
    {
      title: "Diễn Giải",
      key: "dien_giai",
    },
    {
      title: "Tổng Tiền",
      key: "tong_tien",
      sortable: true,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Tình Trạng",
      key: "tinh_trang",
      sortable: true,
      render: (value: string) => (
        <Badge variant={
          value === "completed" ? "success" : 
          value === "pending" ? "secondary" : 
          "outline"
        }>
          {value === "completed" ? "Hoàn thành" : 
           value === "pending" ? "Chờ xử lý" : 
           value || "N/A"}
        </Badge>
      ),
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchFinances}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <ExportButton 
        data={finances} 
        filename="Danh_sach_tai_chinh" 
        label="Xuất dữ liệu"
      />
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Giao Dịch
      </Button>
    </div>
  );

  return (
    <>
      <TablePageLayout
        title="Tài Chính"
        description="Quản lý thu chi và giao dịch tài chính"
        actions={tableActions}
      >
        <Tabs defaultValue="table" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="table">Bảng Dữ Liệu</TabsTrigger>
            <TabsTrigger value="ledger">Sổ Kế Toán</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table">
            {finances.length === 0 && !isLoading ? (
              <PlaceholderPage
                title="Tài Chính"
                description="Quản lý thu chi và giao dịch tài chính"
                addButtonAction={handleAddClick}
              />
            ) : (
              <DataTable
                columns={columns}
                data={finances}
                isLoading={isLoading}
                onRowClick={handleRowClick}
                searchable={true}
                searchPlaceholder="Tìm kiếm giao dịch..."
              />
            )}
          </TabsContent>
          
          <TabsContent value="ledger">
            <FinanceLedger />
          </TabsContent>
        </Tabs>
      </TablePageLayout>

      {selectedFinance && (
        <DetailPanel
          title="Chi Tiết Giao Dịch"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <FinanceDetail finance={selectedFinance} />
        </DetailPanel>
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Giao Dịch Mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin giao dịch tài chính mới vào biểu mẫu bên dưới
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
