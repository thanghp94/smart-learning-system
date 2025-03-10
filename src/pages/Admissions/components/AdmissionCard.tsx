
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Admission, ADMISSION_STATUS_COLORS } from '@/lib/types/admission';
import { CalendarIcon, MapPinIcon, PhoneIcon, MailIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface AdmissionCardProps {
  admission: Admission;
  onClick: (admission: Admission) => void;
  onDragStart: (e: React.DragEvent, admission: Admission) => void;
}

const AdmissionCard = ({ admission, onClick, onDragStart }: AdmissionCardProps) => {
  return (
    <Card 
      className="mb-3 cursor-pointer shadow-sm hover:shadow-md transition-shadow" 
      onClick={() => onClick(admission)}
      draggable
      onDragStart={(e) => onDragStart(e, admission)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback className="bg-primary/10 text-primary">
                {admission.ten_hoc_sinh.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-base">{admission.ten_hoc_sinh}</h3>
              {admission.ngay_sinh && (
                <p className="text-xs text-muted-foreground flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {format(new Date(admission.ngay_sinh), 'dd/MM/yyyy', { locale: vi })}
                </p>
              )}
            </div>
          </div>
          
          {admission.nguon_gioi_thieu && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {admission.nguon_gioi_thieu}
            </span>
          )}
        </div>
        
        <div className="mt-3 space-y-1">
          {admission.so_dien_thoai && (
            <p className="text-xs flex items-center text-muted-foreground">
              <PhoneIcon className="h-3 w-3 mr-1" />
              {admission.so_dien_thoai}
            </p>
          )}
          
          {admission.email && (
            <p className="text-xs flex items-center text-muted-foreground">
              <MailIcon className="h-3 w-3 mr-1" />
              {admission.email}
            </p>
          )}
          
          {admission.dia_chi && (
            <p className="text-xs flex items-center text-muted-foreground">
              <MapPinIcon className="h-3 w-3 mr-1" />
              {admission.dia_chi}
            </p>
          )}
        </div>
        
        {admission.ten_phu_huynh && (
          <div className="mt-3 pt-2 border-t">
            <p className="text-xs font-medium">PH: {admission.ten_phu_huynh}</p>
            {admission.so_dien_thoai_phu_huynh && (
              <p className="text-xs text-muted-foreground">
                {admission.so_dien_thoai_phu_huynh}
              </p>
            )}
          </div>
        )}
        
        {admission.ngay_cap_nhat && (
          <div className="mt-3 text-right">
            <p className="text-xs text-muted-foreground">
              Cập nhật: {format(new Date(admission.ngay_cap_nhat), 'dd/MM/yyyy', { locale: vi })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdmissionCard;
