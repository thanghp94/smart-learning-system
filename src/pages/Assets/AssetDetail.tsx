
import React, { useState, useEffect } from "react";
import { Asset, AssetTransfer } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { assetService } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Package, RefreshCw } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import { useToast } from "@/hooks/use-toast";

interface AssetDetailProps {
  asset: Asset;
}

const AssetDetail = ({ asset }: AssetDetailProps) => {
  const [transfers, setTransfers] = useState<AssetTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        setIsLoading(true);
        const data = await assetService.getTransfersByAssetId(asset.id);
        setTransfers(data);
      } catch (error) {
        console.error("Error fetching transfers:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải lịch sử điều chuyển tài sản",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransfers();
  }, [asset.id]);

  const transferColumns = [
    {
      title: "Ngày Chuyển",
      key: "transfer_date",
      sortable: true,
      render: (value: string) => <span>{formatDate(value)}</span>,
    },
    {
      title: "Từ",
      key: "source_type",
      render: (value: string, record: AssetTransfer) => (
        <span>{value} - {record.source_id}</span>
      ),
    },
    {
      title: "Đến",
      key: "destination_type",
      render: (value: string, record: AssetTransfer) => (
        <span>{value} - {record.destination_id}</span>
      ),
    },
    {
      title: "Số Lượng",
      key: "quantity",
      sortable: true,
    },
    {
      title: "Trạng Thái",
      key: "status",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "completed" ? "success" : "secondary"}>
          {value === "completed" ? "Hoàn thành" : 
           value === "pending" ? "Đang xử lý" : 
           value === "cancelled" ? "Đã hủy" : value}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{asset.ten_CSVC}</h2>
        <p className="text-muted-foreground">Loại: {asset.loai} - Danh mục: {asset.danh_muc}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={
            asset.tinh_trang === "good" ? "success" : 
            asset.tinh_trang === "damaged" ? "destructive" : 
            "secondary"
          }>
            {asset.tinh_trang === "good" ? "Tốt" : 
             asset.tinh_trang === "damaged" ? "Hư hỏng" : 
             asset.tinh_trang === "maintenance" ? "Bảo trì" : asset.tinh_trang}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {asset.trang_thai_so_huu}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Thông Tin Tài Sản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Số lượng:</span>
              <span className="text-sm col-span-2">{asset.so_luong} {asset.don_vi}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Thương hiệu:</span>
              <span className="text-sm col-span-2">{asset.thuong_hieu || "Không có"}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Cấu hình:</span>
              <span className="text-sm col-span-2">{asset.cau_hinh || "Không có"}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Chất liệu:</span>
              <span className="text-sm col-span-2">{asset.chat_lieu || "Không có"}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Màu:</span>
              <span className="text-sm col-span-2">{asset.mau || "Không có"}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Số seri:</span>
              <span className="text-sm col-span-2">{asset.so_seri || "Không có"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Thông Tin Mua Sắm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Ngày mua:</span>
              <span className="text-sm col-span-2">{asset.ngay_mua ? formatDate(asset.ngay_mua) : "Không có"}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Nơi mua:</span>
              <span className="text-sm col-span-2">{asset.noi_mua || "Không có"}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Số tiền mua:</span>
              <span className="text-sm col-span-2">{asset.so_tien_mua || "Không có"}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Ngày nhập:</span>
              <span className="text-sm col-span-2">{asset.ngay_nhap ? formatDate(asset.ngay_nhap) : "Không có"}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Thuộc đối tượng:</span>
              <span className="text-sm col-span-2">{asset.doi_tuong ? `${asset.doi_tuong} - ${asset.doi_tuong_id}` : "Không có"}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Khu vực:</span>
              <span className="text-sm col-span-2">{asset.khu_vuc || "Không có"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="h-5 w-5 mr-2" />
            Lịch Sử Điều Chuyển
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={transferColumns}
            data={transfers}
            isLoading={isLoading}
            searchable={true}
            searchPlaceholder="Tìm kiếm lịch sử điều chuyển..."
          />
        </CardContent>
      </Card>

      {asset.mo_ta_1 && (
        <Card>
          <CardHeader>
            <CardTitle>Mô Tả</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{asset.mo_ta_1}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssetDetail;
