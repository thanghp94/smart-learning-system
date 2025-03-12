
import React, { useState, useEffect } from "react";
import { AssetTransfer, Asset } from "@/lib/types";
import { assetTransferService, assetService } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Check, X, Filter, RotateCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

const TransferManagement = () => {
  const [transfers, setTransfers] = useState<AssetTransfer[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<AssetTransfer[]>([]);
  const [assetMap, setAssetMap] = useState<Record<string, Asset>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      setIsLoading(true);
      const data = await assetTransferService.getAll();
      setTransfers(data);
      
      // Fetch all assets referenced in the transfers
      const assetIds = [...new Set(data.map(t => t.asset_id))];
      const assets: Record<string, Asset> = {};
      
      for (const id of assetIds) {
        try {
          const asset = await assetService.getById(id);
          assets[id] = asset;
        } catch (error) {
          console.error(`Error fetching asset ${id}:`, error);
        }
      }
      
      setAssetMap(assets);
    } catch (error) {
      console.error("Error fetching transfers:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách điều chuyển tài sản",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredTransfers(transfers);
    } else {
      setFilteredTransfers(transfers.filter(t => t.status === filterStatus));
    }
  }, [transfers, filterStatus]);

  const handleApprove = async (id: string) => {
    try {
      await assetTransferService.approveTransfer(id);
      toast({
        title: "Thành công",
        description: "Đã duyệt yêu cầu điều chuyển tài sản",
      });
      fetchTransfers();
    } catch (error: any) {
      console.error("Error approving transfer:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể duyệt yêu cầu điều chuyển",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await assetTransferService.rejectTransfer(id, rejectionReason);
      setRejectionReason("");
      toast({
        title: "Thành công",
        description: "Đã từ chối yêu cầu điều chuyển tài sản",
      });
      fetchTransfers();
    } catch (error: any) {
      console.error("Error rejecting transfer:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể từ chối yêu cầu điều chuyển",
        variant: "destructive"
      });
    }
  };

  const transferColumns = [
    {
      title: "Tài Sản",
      key: "asset_id",
      render: (value: string) => (
        <span>{assetMap[value]?.ten_CSVC || "Không xác định"}</span>
      ),
    },
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
        <Badge variant={value === "completed" ? "success" : 
                       value === "pending" ? "secondary" : 
                       "destructive"}>
          {value === "completed" ? "Hoàn thành" : 
           value === "pending" ? "Đang xử lý" : 
           value === "rejected" ? "Đã từ chối" : 
           value === "cancelled" ? "Đã hủy" : value}
        </Badge>
      ),
    },
    {
      title: "Thao Tác",
      key: "actions",
      render: (_: any, record: AssetTransfer) => (
        record.status === "pending" ? (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-green-500" 
              onClick={() => handleApprove(record.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Từ chối yêu cầu điều chuyển</AlertDialogTitle>
                  <AlertDialogDescription>
                    Vui lòng cung cấp lý do từ chối yêu cầu điều chuyển tài sản này.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Textarea
                  placeholder="Lý do từ chối"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setRejectionReason("")}>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleReject(record.id)}>Từ chối</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">{record.notes || "Không có ghi chú"}</span>
        )
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản Lý Điều Chuyển Tài Sản</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={fetchTransfers}>
            <RotateCw className="h-4 w-4 mr-1" />
            Làm mới
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setFilterStatus}>
        <TabsList>
          <TabsTrigger value="all">Tất Cả</TabsTrigger>
          <TabsTrigger value="pending">Đang Xử Lý</TabsTrigger>
          <TabsTrigger value="completed">Đã Hoàn Thành</TabsTrigger>
          <TabsTrigger value="rejected">Đã Từ Chối</TabsTrigger>
        </TabsList>
        
        <TabsContent value={filterStatus}>
          <Card>
            <CardHeader>
              <CardTitle>Danh Sách Điều Chuyển Tài Sản</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={transferColumns}
                data={filteredTransfers}
                isLoading={isLoading}
                searchable={true}
                searchPlaceholder="Tìm kiếm điều chuyển..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransferManagement;
