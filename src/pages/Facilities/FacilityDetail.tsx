
import React, { useState, useEffect } from "react";
import { Facility, Asset, Finance, Event, File } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { FileText, DollarSign, Calendar, Package } from "lucide-react";
import { formatDate, formatCurrency, formatStatus } from "@/utils/format";
import { assetService, financeService, eventService, fileService } from "@/lib/supabase";

interface FacilityDetailProps {
  facility: Facility;
}

const FacilityDetail: React.FC<FacilityDetailProps> = ({ facility }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsData, financesData, eventsData, filesData] = await Promise.all([
          assetService.getByEntity("facility", facility.id),
          financeService.getByEntity("facility", facility.id),
          eventService.getByEntity("facility", facility.id),
          fileService.getByEntity("facility", facility.id)
        ]);
        
        setAssets(assetsData);
        setFinances(financesData);
        setEvents(eventsData);
        setFiles(filesData);
      } catch (error) {
        console.error("Error fetching facility data:", error);
      }
    };
    
    fetchData();
  }, [facility.id]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{facility.ten_co_so}</h2>
        <p className="text-muted-foreground">{facility.loai_co_so}</p>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Địa chỉ:</p>
          <p>{facility.dia_chi_co_so || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Người chủ:</p>
          <p>{facility.nguoi_chu || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Điện thoại:</p>
          <p>{facility.phone || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Email:</p>
          <p>{facility.email || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Trạng thái:</p>
          <Badge variant={facility.trang_thai === "active" ? "default" : "secondary"}>
            {formatStatus(facility.trang_thai)}
          </Badge>
        </div>
        {facility.ghi_chu && (
          <div className="col-span-2">
            <p className="font-medium">Ghi chú:</p>
            <p>{facility.ghi_chu}</p>
          </div>
        )}
      </div>

      <Separator />

      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="assets">
            <Package className="h-4 w-4 mr-2" />
            Cơ sở vật chất
          </TabsTrigger>
          <TabsTrigger value="finances">
            <DollarSign className="h-4 w-4 mr-2" />
            Tài chính
          </TabsTrigger>
          <TabsTrigger value="files">
            <FileText className="h-4 w-4 mr-2" />
            Tài liệu
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Sự kiện
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="py-4">
          {assets.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên CSVC</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>{asset.ten_csvc}</TableCell>
                    <TableCell>{asset.loai || "N/A"}</TableCell>
                    <TableCell>{asset.so_luong || 0}</TableCell>
                    <TableCell>
                      <Badge variant={asset.tinh_trang === "active" ? "default" : "secondary"}>
                        {formatStatus(asset.tinh_trang)}
                      </Badge>
                    </TableCell>
                    <TableCell>{asset.ghi_chu || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Không có dữ liệu cơ sở vật chất</p>
          )}
        </TabsContent>

        <TabsContent value="finances" className="py-4">
          {finances.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Tên phí</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {finances.map((finance) => (
                  <TableRow key={finance.id}>
                    <TableCell>{formatDate(finance.ngay)}</TableCell>
                    <TableCell>{finance.loai_thu_chi || "N/A"}</TableCell>
                    <TableCell>{finance.ten_phi || finance.dien_giai || "N/A"}</TableCell>
                    <TableCell>{formatCurrency(finance.tong_tien)}</TableCell>
                    <TableCell>
                      <Badge variant={finance.tinh_trang === "completed" ? "default" : "outline"}>
                        {formatStatus(finance.tinh_trang)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Không có dữ liệu tài chính</p>
          )}
        </TabsContent>

        <TabsContent value="files" className="py-4">
          {files.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên tài liệu</TableHead>
                  <TableHead>Nhóm tài liệu</TableHead>
                  <TableHead>Ngày cấp</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>{file.ten_tai_lieu}</TableCell>
                    <TableCell>{file.nhom_tai_lieu || "N/A"}</TableCell>
                    <TableCell>{formatDate(file.ngay_cap)}</TableCell>
                    <TableCell>
                      <Badge variant={file.trang_thai === "active" ? "default" : "secondary"}>
                        {formatStatus(file.trang_thai)}
                      </Badge>
                    </TableCell>
                    <TableCell>{file.ghi_chu || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Không có tài liệu</p>
          )}
        </TabsContent>

        <TabsContent value="events" className="py-4">
          {events.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên sự kiện</TableHead>
                  <TableHead>Loại sự kiện</TableHead>
                  <TableHead>Ngày bắt đầu</TableHead>
                  <TableHead>Địa điểm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.ten_su_kien}</TableCell>
                    <TableCell>{event.loai_su_kien || "N/A"}</TableCell>
                    <TableCell>{formatDate(event.ngay_bat_dau)}</TableCell>
                    <TableCell>{event.dia_diem || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={event.trang_thai === "completed" ? "default" : "outline"}>
                        {formatStatus(event.trang_thai)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Không có sự kiện</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacilityDetail;
