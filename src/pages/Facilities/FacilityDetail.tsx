
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Facility } from '@/lib/types';
import { Phone, Mail, MapPin, User } from 'lucide-react';

interface FacilityDetailProps {
  facility: Facility;
}

const FacilityDetail = ({ facility }: FacilityDetailProps) => {
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

      <div className="text-xs text-muted-foreground">
        Ngày tạo: {formatDate(facility.tg_tao || '')}
      </div>
    </div>
  );
};

export default FacilityDetail;
