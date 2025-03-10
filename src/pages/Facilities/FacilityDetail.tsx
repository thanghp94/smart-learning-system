
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Facility, Finance, Event, Asset, FileDocument } from '@/lib/types';
import { Phone, Mail, MapPin, User, FileText, DollarSign, Package, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable from '@/components/ui/DataTable';
import { assetService, eventService, fileService, financeService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface FacilityDetailProps {
  facility: Facility;
}

const FacilityDetail = ({ facility }: FacilityDetailProps) => {
  const [files, setFiles] = useState<FileDocument[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRelatedData = async () => {
      setIsLoading(true);
      try {
        // Fetch related data in parallel
        const [filesData, financeData, assetData, eventData] = await Promise.all([
          fileService.getByEntity('co_so', facility.id),
          financeService.getByEntity('facility', facility.id),
          assetService.getByOwner('facility', facility.id),
          eventService.getByEntity('facility', facility.id)
        ]);
        
        setFiles(filesData);
        setFinances(financeData);
        setAssets(assetData);
        setEvents(eventData);
      } catch (error) {
        console.error('Error fetching facility related data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu liên quan đến cơ sở',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedData();
  }, [facility.id, toast]);

  const fileColumns = [
    { title: 'Tên tài liệu', key: 'ten_tai_lieu', sortable: true },
    { title: 'Nhóm', key: 'nhom_tai_lieu', sortable: true },
    { title: 'Ngày cấp', key: 'ngay_cap', sortable: true, render: (value: string) => value ? formatDate(value) : 'N/A' },
    { title: 'Hạn tài liệu', key: 'han_tai_lieu', sortable: true, render: (value: string) => value ? formatDate(value) : 'N/A' },
    { title: 'Trạng thái', key: 'trang_thai', sortable: true }
  ];

  const financeColumns = [
    { title: 'Ngày', key: 'ngay', sortable: true, render: (value: string) => value ? formatDate(value) : 'N/A' },
    { title: 'Tên phí', key: 'ten_phi', sortable: true },
    { title: 'Loại thu chi', key: 'loai_thu_chi', sortable: true },
    { title: 'Tổng tiền', key: 'tong_tien', sortable: true, render: (value: number) => formatCurrency(value) },
    { title: 'Trạng thái', key: 'tinh_trang', sortable: true }
  ];

  const assetColumns = [
    { title: 'Tên tài sản', key: 'ten_csvc', sortable: true },
    { title: 'Loại', key: 'loai', sortable: true },
    { title: 'Số lượng', key: 'so_luong', sortable: true },
    { title: 'Ngày mua', key: 'ngay_mua', sortable: true, render: (value: string) => value ? formatDate(value) : 'N/A' },
    { title: 'Tình trạng', key: 'tinh_trang', sortable: true }
  ];

  const eventColumns = [
    { title: 'Tên sự kiện', key: 'ten_su_kien', sortable: true },
    { title: 'Loại sự kiện', key: 'loai_su_kien', sortable: true },
    { title: 'Ngày bắt đầu', key: 'ngay_bat_dau', sortable: true, render: (value: string) => formatDate(value) },
    { title: 'Địa điểm', key: 'dia_diem', sortable: true },
    { title: 'Trạng thái', key: 'trang_thai', sortable: true }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-semibold">{facility.ten_co_so}</h3>
          <p className="text-muted-foreground">{facility.loai_co_so}</p>
        </div>
        <Badge variant={facility.trang_thai === 'active' ? 'success' : 'destructive'}>
          {facility.trang_thai === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </Badge>
      </div>

      <Card>
        <CardContent className="p-6">
          <h4 className="font-medium mb-4">Thông tin liên hệ</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{facility.dia_chi_co_so || 'Chưa có địa chỉ'}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{facility.phone || 'Chưa có số điện thoại'}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{facility.email || 'Chưa có email'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h4 className="font-medium mb-4">Thông tin quản lý</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Người quản lý: {facility.nguoi_phu_trach || 'Chưa phân công'}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Người chủ: {facility.nguoi_chu || 'Không có thông tin'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {facility.ghi_chu && (
        <Card>
          <CardContent className="p-6">
            <h4 className="font-medium mb-2">Ghi chú</h4>
            <p>{facility.ghi_chu}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="documents" className="w-full pt-4">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="documents" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Tài liệu
          </TabsTrigger>
          <TabsTrigger value="finances" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Thu chi
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Cơ sở vật chất
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Sự kiện
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <DataTable
                columns={fileColumns}
                data={files}
                isLoading={isLoading}
                searchable={true}
                searchPlaceholder="Tìm tài liệu..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <DataTable
                columns={financeColumns}
                data={finances}
                isLoading={isLoading}
                searchable={true}
                searchPlaceholder="Tìm giao dịch..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <DataTable
                columns={assetColumns}
                data={assets}
                isLoading={isLoading}
                searchable={true}
                searchPlaceholder="Tìm tài sản..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <DataTable
                columns={eventColumns}
                data={events}
                isLoading={isLoading}
                searchable={true}
                searchPlaceholder="Tìm sự kiện..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-xs text-muted-foreground">
        Ngày tạo: {formatDate(facility.tg_tao || '')}
      </div>
    </div>
  );
};

export default FacilityDetail;
