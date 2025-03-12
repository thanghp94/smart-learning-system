import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDown, Pencil, Building, MapPin, Phone, Mail, Calendar, Users, Package, Banknote, FileCog, ArrowLeft } from 'lucide-react';
import { Facility, Employee, Asset, Class } from '@/lib/types';
import { facilityService, employeeService, assetService, classService } from '@/lib/supabase';
import { DataTable } from '@/components/ui/DataTable';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FacilityDetailProps {
  facilityId: string;
}

const FacilityDetail: React.FC<FacilityDetailProps> = ({ facilityId }) => {
  const [facility, setFacility] = useState<Facility | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const facilityData = await facilityService.getById(facilityId);
        setFacility(facilityData);

        const employeesData = await employeeService.getByFacility(facilityId);
        setEmployees(employeesData);

        const assetsData = await assetService.getByFacility(facilityId);
        setAssets(assetsData);
        
        const classesData = await classService.getByFacility(facilityId);
        setClasses(classesData);
      } catch (error) {
        console.error('Error fetching facility details:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin chi tiết cơ sở",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [facilityId, toast]);

  const handleBack = () => {
    navigate('/facilities');
  };

  const employeeColumns = [
    {
      title: 'Tên nhân viên',
      key: 'ten_nhan_su',
      sortable: true,
    },
    {
      title: 'Chức vụ',
      key: 'chuc_vu',
    },
    {
      title: 'Email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      key: 'so_dien_thoai',
    },
    {
      title: 'Trạng thái',
      key: 'trang_thai',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'secondary'}>
          {value === 'active' ? 'Đang làm việc' : 'Đã nghỉ'}
        </Badge>
      ),
    },
  ];

  const assetColumns = [
    {
      title: 'Tên tài sản',
      key: 'ten_CSVC',
      sortable: true,
    },
    {
      title: 'Loại',
      key: 'loai',
    },
    {
      title: 'Số lượng',
      key: 'so_luong',
    },
    {
      title: 'Đơn vị',
      key: 'don_vi',
    },
    {
      title: 'Tình trạng',
      key: 'tinh_trang',
      render: (value: string) => (
        <Badge variant={value === 'good' ? 'success' : value === 'damaged' ? 'destructive' : 'secondary'}>
          {value === 'good' ? 'Tốt' : value === 'damaged' ? 'Hư hỏng' : value}
        </Badge>
      ),
    },
  ];
  
  const classColumns = [
    {
      title: 'Tên lớp',
      key: 'ten_lop',
      sortable: true,
    },
    {
      title: 'Mã lớp',
      key: 'ma_lop',
    },
    {
      title: 'Giáo viên',
      key: 'giao_vien_id',
    },
    {
      title: 'Học phí',
      key: 'hoc_phi',
    },
    {
      title: 'Số lượng học sinh',
      key: 'so_luong_hoc_sinh',
    },
  ];

  if (isLoading || !facility) {
    return <div className="p-4">Đang tải thông tin cơ sở...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{facility.ten_co_so}</h2>
          <p className="text-muted-foreground">
            {facility.loai_co_so} • {facility.dia_chi_co_so}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>

      <Separator />

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="employees">Nhân viên</TabsTrigger>
          <TabsTrigger value="assets">Tài sản</TabsTrigger>
          <TabsTrigger value="classes">Lớp học</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Thông tin chung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-x-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Địa chỉ:
                  </div>
                  <div className="text-sm">{facility.dia_chi_co_so || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2 gap-x-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Số điện thoại:
                  </div>
                  <div className="text-sm">{facility.phone || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2 gap-x-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Email:
                  </div>
                  <div className="text-sm">{facility.email || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2 gap-x-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Ngày thành lập:
                  </div>
                  <div className="text-sm">{facility.ngay_thanh_lap ? formatDate(facility.ngay_thanh_lap) : 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2 gap-x-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Người đại diện:
                  </div>
                  <div className="text-sm">{facility.nguoi_dai_dien || 'N/A'}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileCog className="h-5 w-5 mr-2" />
                  Thông tin khác
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-x-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Số giấy phép:
                  </div>
                  <div className="text-sm">{facility.so_giay_phep || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2 gap-x-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Ngày cấp phép:
                  </div>
                  <div className="text-sm">{facility.ngay_cap_phep ? formatDate(facility.ngay_cap_phep) : 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2 gap-x-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Ngân hàng:
                  </div>
                  <div className="text-sm">{facility.ngan_hang || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2 gap-x-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Số tài khoản:
                  </div>
                  <div className="text-sm">{facility.so_tai_khoan || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2 gap-x-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Ghi chú:
                  </div>
                  <div className="text-sm">{facility.ghi_chu || 'N/A'}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Nhân viên
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={employeeColumns} data={employees} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Tài sản
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={assetColumns} data={assets} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classes" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Lớp học
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={classColumns} data={classes} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacilityDetail;
