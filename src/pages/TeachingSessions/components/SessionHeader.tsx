
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface SessionHeaderProps {
  sessionData: any;
  classData: any;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({ sessionData, classData }) => {
  const formatStatus = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline">Đã lên lịch</Badge>;
      case 'completed':
        return <Badge variant="success">Đã hoàn thành</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Đã hủy</Badge>;
      case 'in_progress':
        return <Badge variant="default">Đang diễn ra</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Buổi {sessionData?.buoi_so || sessionData?.session_number || '?'} - {classData?.ten_lop_full || 'Unnamed Class'}
        </h2>
        {formatStatus(sessionData?.trang_thai || sessionData?.status || 'unknown')}
      </div>
      <div className="text-muted-foreground">
        {sessionData?.ngay_hoc && format(new Date(sessionData?.ngay_hoc), 'dd/MM/yyyy')} | 
        {sessionData?.thoi_gian_bat_dau || sessionData?.start_time || '?'} - 
        {sessionData?.thoi_gian_ket_thuc || sessionData?.end_time || '?'}
      </div>
    </div>
  );
};

export default SessionHeader;
