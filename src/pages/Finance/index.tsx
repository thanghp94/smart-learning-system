
import React, { useState, useEffect } from "react";
import { financeService, facilityService } from "@/lib/supabase";
import { Finance, Facility } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import DetailPanel from "@/components/ui/DetailPanel";
import FinanceDetail from "./FinanceDetail";
import FinanceForm from "./FinanceForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import FinancePageContent from "./components/FinancePageContent";

const FinancePage = () => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [filteredFinances, setFilteredFinances] = useState<Finance[]>([]);
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
  
  useEffect(() => {
    setFilteredFinances(finances);
  }, [finances]);

  const fetchFinances = async () => {
    try {
      setIsLoading(true);
      const data = await financeService.getAll();
      console.log("Finances data received:", data);
      
      if (Array.isArray(data)) {
        setFinances(data as Finance[]);
        setFilteredFinances(data as Finance[]);
      } else {
        console.error("Invalid finances data format:", data);
        setFinances([]);
        setFilteredFinances([]);
      }
    } catch (error) {
      console.error("Error fetching finances:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách tài chính. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      setFinances([]);
      setFilteredFinances([]);
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
      await financeService.create(formData);
      
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
  
  // Handle filter changes
  const handleFilter = (filters: Record<string, string>) => {
    console.log("Applied filters:", filters);
    
    let result = [...finances];
    
    // Apply each filter
    if (filters["Cơ sở"]) {
      result = result.filter(item => item.co_so === filters["Cơ sở"]);
    }
    
    if (filters["Loại thu chi"]) {
      result = result.filter(item => item.loai_thu_chi === filters["Loại thu chi"]);
    }
    
    if (filters["Tình trạng"]) {
      result = result.filter(item => item.tinh_trang === filters["Tình trạng"]);
    }
    
    setFilteredFinances(result);
  };

  return (
    <>
      <TablePageLayout
        title="Tài Chính"
        description="Quản lý thu chi và giao dịch tài chính"
      >
        <FinancePageContent
          finances={finances}
          filteredFinances={filteredFinances}
          facilities={facilities}
          isLoading={isLoading}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleFilter={handleFilter}
          handleRowClick={handleRowClick}
          handleAddClick={handleAddClick}
          fetchFinances={fetchFinances}
        />
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
