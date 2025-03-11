import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { assetService } from "@/lib/supabase";
import { Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import DetailPanel from "@/components/ui/DetailPanel";
import AssetDetail from "./AssetDetail";
import AssetForm from "./AssetForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import CommandInterface from "@/components/ui/CommandInterface";

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const data = await assetService.getAll();
      setAssets(data);
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách tài sản",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      console.log("Inserting record into assets:", formData);
      const newAsset = await assetService.create(formData);
      setAssets([...assets, newAsset]);
      toast({
        title: "Thành công",
        description: "Thêm tài sản mới thành công",
      });
      setShowAddForm(false);
      fetchAssets(); // Refresh the data
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
      title: "Tên tài sản",
      key: "ten_tai_san",
      sortable: true,
    },
    {
      title: "Loại",
      key: "loai",
      sortable: true,
    },
    {
      title: "Danh Mục",
      key: "danh_muc",
      sortable: true,
    },
    {
      title: "Số Lượng",
      key: "so_luong",
      sortable: true,
      render: (value: number) => <span>{value || 0}</span>,
    },
    {
      title: "Đơn Vị",
      key: "don_vi",
    },
    {
      title: "Tình Trạng",
      key: "tinh_trang",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "good" ? "success" : 
                       value === "damaged" ? "destructive" : 
                       "secondary"}>
          {value === "good" ? "Tốt" : 
           value === "damaged" ? "Hư hỏng" : 
           value === "maintenance" ? "Bảo trì" : value}
        </Badge>
      ),
    },
    {
      title: "Trạng Thái Sở Hữu",
      key: "trang_thai_so_huu",
      sortable: true,
      render: (value: string) => <span>{value}</span>,
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchAssets}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Tài Sản
      </Button>
    </div>
  );

  return (
    <>
      <TablePageLayout
        title="Tài Sản"
        description="Quản lý tài sản của trung tâm"
        actions={tableActions}
      >
        <div className="hidden md:block">
          <CommandInterface />
        </div>
        
        {assets.length === 0 && !isLoading ? (
          <PlaceholderPage
            title="Tài Sản"
            description="Quản lý thông tin tài sản và cơ sở vật chất"
            addButtonAction={handleAddClick}
          />
        ) : (
          <DataTable
            columns={columns}
            data={assets}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            searchable={true}
            searchPlaceholder="Tìm kiếm tài sản..."
          />

          {selectedAsset && (
            <DetailPanel
              title="Thông Tin Tài Sản"
              isOpen={showDetail}
              onClose={closeDetail}
            >
              <AssetDetail asset={selectedAsset} />
            </DetailPanel>
          )}
        )}
      </TablePageLayout>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Tài Sản Mới</DialogTitle>
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
