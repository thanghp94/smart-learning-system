
import React, { useState } from "react";
import { Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import DetailPanel from "@/components/ui/DetailPanel";
import AssetDetail from "./AssetDetail";
import AssetForm from "./AssetForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import DataTable from "@/components/ui/DataTable";
import CommandInterface from "@/components/CommandInterface";
import { useAssetData } from "./hooks/useAssetData";
import AssetActionsToolbar from "./components/AssetActionsToolbar";
import { assetService } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";

const Assets = () => {
  const { filteredAssets, isLoading, fetchAssets, handleFilterChange, handleResetFilters } = useAssetData();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const handleRowClick = (asset: Asset) => {
    setSelectedAsset(asset);
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

  const handleAddFormSubmit = async (formData: Partial<Asset>) => {
    try {
      await assetService.create(formData);
      toast({
        title: "Thành công",
        description: "Thêm tài sản mới thành công",
      });
      setShowAddForm(false);
      await fetchAssets();
    } catch (error) {
      console.error("Error adding asset:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm tài sản mới",
        variant: "destructive"
      });
    }
  };

  const columns = [
    {
      title: "Tài sản",
      key: "ten_csvc",
      sortable: true,
      thumbnail: true
    },
    {
      title: "Loại",
      key: "loai",
      sortable: true,
    },
    {
      title: "Số lượng",
      key: "so_luong",
      sortable: true,
    },
    {
      title: "Đơn vị",
      key: "don_vi",
    },
    {
      title: "Giá trị",
      key: "so_tien_mua",
      sortable: true,
      render: (value: string) => value ? formatCurrency(parseFloat(value)) : 'Chưa có thông tin'
    },
    {
      title: "Tình trạng",
      key: "tinh_trang",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "active" ? "default" : "secondary"}>
          {value === "active" ? "Đang sử dụng" : "Không khả dụng"}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <TablePageLayout
        title="Tài Sản"
        description="Quản lý tài sản của trung tâm"
        actions={
          <AssetActionsToolbar
            onAddClick={handleAddClick}
            onRefresh={fetchAssets}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        }
      >
        <div className="hidden md:block">
          <CommandInterface />
        </div>
        
        {filteredAssets.length === 0 && !isLoading ? (
          <PlaceholderPage
            title="Tài Sản"
            description="Quản lý thông tin tài sản và cơ sở vật chất"
            addButtonAction={handleAddClick}
          />
        ) : (
          <DataTable
            columns={columns}
            data={filteredAssets}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            searchable={true}
            searchPlaceholder="Tìm kiếm tài sản..."
          />
        )}
      </TablePageLayout>

      {selectedAsset && (
        <DetailPanel
          title="Thông Tin Tài Sản"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <AssetDetail asset={selectedAsset} />
        </DetailPanel>
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Thêm Tài Sản Mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin chi tiết về tài sản mới
            </DialogDescription>
          </DialogHeader>
          <AssetForm 
            onSubmit={handleAddFormSubmit}
            onCancel={handleAddFormCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Assets;
