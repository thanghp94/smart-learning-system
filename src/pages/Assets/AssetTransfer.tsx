
import React, { useState, useEffect } from "react";
import { Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { assetService, assetTransferService } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Calendar, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface AssetTransferProps {
  asset: Asset;
  onTransferComplete: () => void;
}

const AssetTransfer = ({ asset, onTransferComplete }: AssetTransferProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [sourceType, setSourceType] = useState<string>(asset.doi_tuong || "facility");
  const [sourceId, setSourceId] = useState<string>(asset.doi_tuong_id || "");
  const [destinationType, setDestinationType] = useState<string>("facility");
  const [destinationId, setDestinationId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [transferDate, setTransferDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (asset) {
      setSourceType(asset.doi_tuong || "facility");
      setSourceId(asset.doi_tuong_id || "");
    }
  }, [asset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (quantity <= 0 || quantity > asset.so_luong) {
      toast({
        title: "Lỗi",
        description: `Số lượng phải từ 1 đến ${asset.so_luong}`,
        variant: "destructive",
      });
      return;
    }

    if (!destinationType || !destinationId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn đích đến của tài sản",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await assetTransferService.create({
        asset_id: asset.id,
        source_type: sourceType,
        source_id: sourceId,
        destination_type: destinationType,
        destination_id: destinationId,
        quantity: quantity,
        transfer_date: transferDate,
        status: "pending",
        notes: notes
      });

      toast({
        title: "Thành công",
        description: `Đã tạo yêu cầu chuyển ${quantity} ${asset.ten_CSVC}`,
      });
      
      onTransferComplete();
    } catch (error: any) {
      console.error("Error creating transfer:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo yêu cầu chuyển tài sản",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxQuantity = asset.so_luong || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowRight className="h-5 w-5 mr-2" />
          Chuyển Tài Sản
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{asset.ten_CSVC}</h3>
                <p className="text-sm text-muted-foreground">
                  Loại: {asset.loai} - Danh mục: {asset.danh_muc}
                </p>
              </div>
              <Badge variant={
                asset.tinh_trang === "good" ? "success" : 
                asset.tinh_trang === "damaged" ? "destructive" : 
                "secondary"
              }>
                {asset.tinh_trang === "good" ? "Tốt" : 
                 asset.tinh_trang === "damaged" ? "Hư hỏng" : 
                 asset.tinh_trang === "maintenance" ? "Bảo trì" : asset.tinh_trang}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source_type">Nguồn</Label>
              <Select 
                value={sourceType} 
                onValueChange={setSourceType}
                disabled={true}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại nguồn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facility">Cơ Sở</SelectItem>
                  <SelectItem value="student">Học Sinh</SelectItem>
                  <SelectItem value="employee">Nhân Viên</SelectItem>
                  <SelectItem value="class">Lớp Học</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source_id">ID Nguồn</Label>
              <Input 
                id="source_id" 
                value={sourceId} 
                onChange={(e) => setSourceId(e.target.value)} 
                disabled={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destination_type">Đích Đến</Label>
              <Select 
                value={destinationType} 
                onValueChange={setDestinationType}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại đích đến" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facility">Cơ Sở</SelectItem>
                  <SelectItem value="student">Học Sinh</SelectItem>
                  <SelectItem value="employee">Nhân Viên</SelectItem>
                  <SelectItem value="class">Lớp Học</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination_id">ID Đích Đến</Label>
              <Input 
                id="destination_id" 
                value={destinationId} 
                onChange={(e) => setDestinationId(e.target.value)} 
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Số Lượng</Label>
              <Input 
                id="quantity" 
                type="number" 
                min={1} 
                max={maxQuantity}
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))} 
                required
              />
              <p className="text-xs text-muted-foreground">
                Số lượng hiện có: {asset.so_luong} {asset.don_vi}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transfer_date">Ngày Chuyển</Label>
              <Input 
                id="transfer_date" 
                type="date" 
                value={transferDate} 
                onChange={(e) => setTransferDate(e.target.value)} 
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi Chú</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              rows={3}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Tạo Yêu Cầu Chuyển"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AssetTransfer;
