
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
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Status badge */}
          <div className={`text-xs px-2 py-1 rounded-full inline-block mb-1 ${ADMISSION_STATUS_COLORS[admission.trang_thai]}`}>
            {getStatusLabel(admission.trang_thai)}
          </div>
          
          {/* Student name */}
          <h3 className="font-medium line-clamp-1">{admission.ten_hoc_sinh}</h3>
          
          {/* Contact info */}
          <div className="text-xs text-muted-foreground space-y-1">
            {admission.so_dien_thoai && (
              <p className="line-clamp-1">
                SĐT: {admission.so_dien_thoai}
              </p>
            )}
            
            {admission.email && (
              <p className="line-clamp-1">
                Email: {admission.email}
              </p>
            )}
            
            {admission.ten_phu_huynh && (
              <p className="line-clamp-1">
                Phụ huynh: {admission.ten_phu_huynh}
              </p>
            )}
          </div>
          
          {/* Timestamps */}
          <div className="text-xs text-muted-foreground pt-2 border-t border-gray-100 mt-2 flex justify-between">
            <span>
              {admission.updated_at 
                ? `Cập nhật: ${formatDate(admission.updated_at)}`
                : admission.created_at 
                  ? `Tạo: ${formatDate(admission.created_at)}`
                  : ''}
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
