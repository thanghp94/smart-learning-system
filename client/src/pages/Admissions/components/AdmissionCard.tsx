
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { Admission } from '@/lib/types/admission';
import { Calendar, Phone, User } from 'lucide-react';

interface AdmissionCardProps {
  admission: Admission;
  onClick: (admission: Admission) => void;
  onDragStart: (e: React.DragEvent, admission: Admission) => void;
}

const AdmissionCard: React.FC<AdmissionCardProps> = ({ 
  admission, 
  onClick, 
  onDragStart 
}) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(admission)}
      draggable
      onDragStart={(e) => onDragStart(e, admission)}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="font-medium text-sm">{admission.ten_hoc_sinh}</div>
          
          {admission.ten_phu_huynh && (
            <div className="flex items-center text-xs text-muted-foreground">
              <User className="h-3 w-3 mr-1" />
              {admission.ten_phu_huynh}
            </div>
          )}
          
          {admission.so_dien_thoai_phu_huynh && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Phone className="h-3 w-3 mr-1" />
              {admission.so_dien_thoai_phu_huynh}
            </div>
          )}
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(admission.updated_at)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdmissionCard;
