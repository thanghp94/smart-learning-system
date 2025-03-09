
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

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showDetail, setShowDetail] = useState(false);
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

  const columns = [
    {
      title: "Tên CSVC",
      key: "ten_CSVC",
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
      <Button size="sm" className="h-8">
        <Plus className="h-4 w-4 mr-1" /> Thêm Tài Sản
      </Button>
    </div>
  );

  return (
    <TablePageLayout
      title="Tài Sản"
      description="Quản lý thông tin tài sản và cơ sở vật chất"
      actions={tableActions}
    >
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
    </TablePageLayout>
  );
};

export default Assets;
