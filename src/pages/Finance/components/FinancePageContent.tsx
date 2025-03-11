
import React from "react";
import { Finance, Facility } from "@/lib/types";
import DataTable from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinanceLedger from "./FinanceLedger";
import { useIsMobile } from "@/hooks/use-mobile";
import CommandInterface from "@/components/CommandInterface";
import FinanceActions from "./FinanceActions";

interface FinancePageContentProps {
  finances: Finance[];
  filteredFinances: Finance[];
  facilities: Facility[];
  isLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleFilter: (filters: Record<string, string>) => void;
  handleRowClick: (finance: Finance) => void;
  handleAddClick: () => void;
  fetchFinances: () => Promise<void>;
}

const FinancePageContent: React.FC<FinancePageContentProps> = ({
  finances,
  filteredFinances,
  facilities,
  isLoading,
  activeTab,
  setActiveTab,
  handleFilter,
  handleRowClick,
  handleAddClick,
  fetchFinances,
}) => {
  const isMobile = useIsMobile();

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
  
  // Mobile columns subset for responsive design
  const mobileColumns = isMobile ? 
    columns.filter(col => ['ngay', 'loai_thu_chi', 'tong_tien'].includes(col.key)) : 
    columns;

  const tableActions = (
    <FinanceActions 
      facilities={facilities}
      filteredFinances={filteredFinances}
      fetchFinances={fetchFinances}
      handleAddClick={handleAddClick}
      handleFilter={handleFilter}
    />
  );

  return (
    <>
      <div className="hidden md:block mb-4">
        <CommandInterface />
      </div>
      
      <Tabs defaultValue="table" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="table">Bảng Dữ Liệu</TabsTrigger>
          <TabsTrigger value="ledger">Sổ Kế Toán</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="w-full">
          {filteredFinances.length === 0 && !isLoading ? (
            <PlaceholderPage
              title="Tài Chính"
              description="Quản lý thu chi và giao dịch tài chính"
              addButtonAction={handleAddClick}
            />
          ) : (
            <DataTable
              columns={mobileColumns}
              data={filteredFinances}
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
    </>
  );
};

export default FinancePageContent;
