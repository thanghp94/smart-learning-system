
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Admission, ADMISSION_STATUS_COLORS } from '@/lib/types/admission';
import { CalendarIcon, MapPinIcon, PhoneIcon, MailIcon, UserIcon } from 'lucide-react';
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
      className="mb-2 cursor-pointer shadow-sm hover:shadow-md transition-shadow max-h-48 overflow-hidden"
      onClick={() => onClick(admission)}
      draggable
      onDragStart={(e) => onDragStart(e, admission)}
    >
      <CardContent className="p-2.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Avatar className="h-7 w-7 mr-2">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {admission.ten_hoc_sinh.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm leading-tight">{admission.ten_hoc_sinh}</h3>
              {admission.ngay_sinh && (
                <p className="text-xs text-muted-foreground flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {format(new Date(admission.ngay_sinh), 'dd/MM/yyyy', { locale: vi })}
                </p>
              )}
            </div>
          </div>
          
          {admission.nguon_gioi_thieu && (
            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[80px]">
              {admission.nguon_gioi_thieu}
            </span>
          )}
        </div>
        
        <div className="mt-1.5 grid grid-cols-2 gap-x-1 gap-y-0.5">
          {admission.so_dien_thoai && (
            <p className="text-xs flex items-center text-muted-foreground col-span-1 truncate">
              <PhoneIcon className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{admission.so_dien_thoai}</span>
            </p>
          )}
          
          {admission.email && (
            <p className="text-xs flex items-center text-muted-foreground col-span-1 truncate">
              <MailIcon className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{admission.email}</span>
            </p>
          )}
        </div>
        
        {admission.dia_chi && (
          <p className="text-xs flex items-center text-muted-foreground mt-0.5 truncate">
            <MapPinIcon className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{admission.dia_chi}</span>
          </p>
        )}
        
        {admission.ten_phu_huynh && (
          <div className="mt-1 pt-1 border-t border-gray-100">
            <p className="text-xs flex items-center truncate">
              <UserIcon className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="font-medium truncate">PH: {admission.ten_phu_huynh}</span>
              {admission.so_dien_thoai_phu_huynh && (
                <span className="ml-1 text-muted-foreground truncate">
                  ({admission.so_dien_thoai_phu_huynh})
                </span>
              )}
            </p>
          </div>
        )}
        
        {admission.ngay_cap_nhat && (
          <div className="mt-1 text-right">
            <p className="text-xs text-muted-foreground">
              {format(new Date(admission.ngay_cap_nhat), 'dd/MM', { locale: vi })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdmissionCard;
