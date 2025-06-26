
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Facility, Asset, Event, Finance, File } from '@/lib/types';
import { facilityService } from '@/lib/supabase/facility-service';
import { assetService } from '@/lib/supabase/asset-service';
import { eventService } from '@/lib/supabase/event-service';
import { financeService } from '@/lib/supabase/finance-service';
import { fileService } from '@/lib/supabase/file-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatStatus } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { PenSquare } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface FacilityDetailProps {
  facilityId: string;
}

const FacilityDetail: React.FC<FacilityDetailProps> = ({ facilityId }) => {
  const [facility, setFacility] = useState<Facility | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFacilityData = async () => {
      try {
        setLoading(true);
        
        // Fetch facility details
        const facilityData = await facilityService.getById(facilityId);
        setFacility(facilityData);
        
        // Fetch related assets
        const assetsData = await assetService.getByOwner('facility', facilityId);
        setAssets(assetsData);
        
        // Fetch related events
        const eventsData = await eventService.getByEntity('facility', facilityId);
        setEvents(eventsData);
        
        // Fetch related finances - now using the correct method
        const financesData = await financeService.getByEntity('facility', facilityId);
        setFinances(financesData);
        
        // Fetch related files
        const filesData = await fileService.getByEntity('facility', facilityId);
        setFiles(filesData);
        
      } catch (error) {
        console.error('Error fetching facility data:', error);
        toast({
          title: 'Error',
          description: 'Unable to load facility data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (facilityId) {
      fetchFacilityData();
    }
  }, [facilityId]);

  // Column definitions for Assets table
  const assetColumns = [
    {
      title: 'Tên tài sản',
      key: 'ten_CSVC',
    },
    {
      title: 'Số lượng',
      key: 'so_luong',
    },
    {
      title: 'Loại',
      key: 'loai',
    },
    {
      title: 'Tình trạng',
      key: 'tinh_trang',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'secondary'}>
          {formatStatus(value)}
        </Badge>
      ),
    },
  ];

  // Column definitions for Events table
  const eventColumns = [
    {
      title: 'Tên sự kiện',
      key: 'ten_su_kien',
    },
    {
      title: 'Loại sự kiện',
      key: 'loai_su_kien',
    },
    {
      title: 'Ngày',
      key: 'ngay_bat_dau',
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Trạng thái',
      key: 'trang_thai',
      render: (value: string) => (
        <Badge variant={value === 'completed' ? 'success' : 'secondary'}>
          {formatStatus(value)}
        </Badge>
      ),
    },
  ];

  // Column definitions for Finances table
  const financeColumns = [
    {
      title: 'Ngày',
      key: 'ngay',
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Loại thu chi',
      key: 'loai_thu_chi',
    },
    {
      title: 'Diễn giải',
      key: 'dien_giai',
    },
    {
      title: 'Số tiền',
      key: 'tong_tien',
      render: (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
    },
    {
      title: 'Trạng thái',
      key: 'tinh_trang',
      render: (value: string) => (
        <Badge variant={value === 'completed' ? 'success' : 'secondary'}>
          {formatStatus(value)}
        </Badge>
      ),
    },
  ];

  // Column definitions for Files table
  const fileColumns = [
    {
      title: 'Tên tài liệu',
      key: 'ten_tai_lieu',
    },
    {
      title: 'Nhóm tài liệu',
      key: 'nhom_tai_lieu',
    },
    {
      title: 'Ngày cấp',
      key: 'ngay_cap',
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Trạng thái',
      key: 'trang_thai',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'secondary'}>
          {formatStatus(value)}
        </Badge>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!facility) {
    return <div>Facility not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{facility.ten_co_so}</h2>
          <p className="text-muted-foreground">{facility.loai_co_so}</p>
        </div>
        <Button onClick={() => navigate(`/facilities/edit/${facilityId}`)} className="flex items-center gap-1">
          <PenSquare className="h-4 w-4" /> Edit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ sở</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Tên cơ sở</p>
            <p>{facility.ten_co_so}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Loại cơ sở</p>
            <p>{facility.loai_co_so}</p>
          </div>
          {facility.dia_chi_co_so && (
            <div>
              <p className="text-sm font-medium">Địa chỉ</p>
              <p>{facility.dia_chi_co_so}</p>
            </div>
          )}
          {facility.phone && (
            <div>
              <p className="text-sm font-medium">Điện thoại</p>
              <p>{facility.phone}</p>
            </div>
          )}
          {facility.email && (
            <div>
              <p className="text-sm font-medium">Email</p>
              <p>{facility.email}</p>
            </div>
          )}
          {facility.nguoi_chu && (
            <div>
              <p className="text-sm font-medium">Người chủ</p>
              <p>{facility.nguoi_chu}</p>
            </div>
          )}
          {facility.nguoi_phu_trach && (
            <div>
              <p className="text-sm font-medium">Người phụ trách</p>
              <p>{facility.nguoi_phu_trach}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium">Trạng thái</p>
            <Badge variant={facility.trang_thai === 'active' ? 'success' : 'destructive'}>
              {formatStatus(facility.trang_thai)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="assets">
        <TabsList>
          <TabsTrigger value="assets">Cơ sở vật chất</TabsTrigger>
          <TabsTrigger value="events">Sự kiện</TabsTrigger>
          <TabsTrigger value="finances">Thu chi</TabsTrigger>
          <TabsTrigger value="files">Tài liệu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <CardTitle>Cơ sở vật chất</CardTitle>
              <CardDescription>Danh sách tài sản thuộc cơ sở</CardDescription>
            </CardHeader>
            <CardContent>
              {assets.length === 0 ? (
                <p className="text-muted-foreground">Không có tài sản nào</p>
              ) : (
                <DataTable columns={assetColumns} data={assets} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Sự kiện</CardTitle>
              <CardDescription>Danh sách sự kiện tại cơ sở</CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-muted-foreground">Không có sự kiện nào</p>
              ) : (
                <DataTable columns={eventColumns} data={events} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finances">
          <Card>
            <CardHeader>
              <CardTitle>Thu chi</CardTitle>
              <CardDescription>Danh sách các khoản thu chi của cơ sở</CardDescription>
            </CardHeader>
            <CardContent>
              {finances.length === 0 ? (
                <p className="text-muted-foreground">Không có khoản thu chi nào</p>
              ) : (
                <DataTable columns={financeColumns} data={finances} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Tài liệu</CardTitle>
              <CardDescription>Danh sách tài liệu liên quan đến cơ sở</CardDescription>
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <p className="text-muted-foreground">Không có tài liệu nào</p>
              ) : (
                <DataTable columns={fileColumns} data={files} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacilityDetail;
