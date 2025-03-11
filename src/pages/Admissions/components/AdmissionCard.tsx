
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Admission, ADMISSION_STATUS_COLORS } from '@/lib/types/admission';

interface AdmissionCardProps {
  admission: Admission;
  onClick: (admission: Admission) => void;
  onDragStart: (e: React.DragEvent, admission: Admission) => void;
}

const AdmissionCard: React.FC<AdmissionCardProps> = ({ admission, onClick, onDragStart }) => {
  return (
    <Card 
      className="cursor-pointer hover:bg-muted transition-colors"
      onClick={() => onClick(admission)}
      draggable
      onDragStart={(e) => onDragStart(e, admission)}
    >
      <CardContent className="p-2 text-xs">
        <div className="space-y-1">
          {/* Status badge */}
          <div className={`px-1.5 py-0.5 rounded-full inline-block mb-0.5 text-[10px] ${ADMISSION_STATUS_COLORS[admission.trang_thai]}`}>
            {getStatusLabel(admission.trang_thai)}
          </div>
          
          {/* Student name */}
          <h3 className="font-medium text-xs line-clamp-1">{admission.ten_hoc_sinh}</h3>
          
          {/* Contact info - more compact */}
          <div className="text-[10px] text-muted-foreground">
            {admission.so_dien_thoai && (
              <p className="line-clamp-1 truncate">
                SĐT: {admission.so_dien_thoai}
              </p>
            )}
            
            {admission.ten_phu_huynh && (
              <p className="line-clamp-1 truncate">
                PH: {admission.ten_phu_huynh}
              </p>
            )}
          </div>
          
          {/* Updated timestamp */}
          <div className="text-[10px] text-muted-foreground pt-1 border-t border-gray-100 mt-1">
            <span>
              {admission.updated_at 
                ? formatDate(admission.updated_at)
                : formatDate(admission.created_at || '')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions
const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    'tim_hieu': 'Tìm hiểu',
    'tu_van': 'Tư vấn',
    'hoc_thu': 'Học thử',
    'chot': 'Đã chốt',
    'huy': 'Huỷ'
  };
  
  return statusMap[status] || status;
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
  } catch (e) {
    return dateString;
  }
};

export default AdmissionCard;
