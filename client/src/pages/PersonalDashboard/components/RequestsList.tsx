
import React from 'react';
import { Request } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';

interface RequestsListProps {
  requests: Request[];
}

export const RequestsList: React.FC<RequestsListProps> = ({ requests }) => {
  const getRequestStatusClass = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-center text-muted-foreground">
        <MessageSquare className="h-10 w-10 mb-2 opacity-30" />
        <p>Không có đề xuất nào</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      {requests.map((request) => (
        <div 
          key={request.id} 
          className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{request.title}</h3>
            <Badge className={getRequestStatusClass(request.status)}>
              {request.status === 'approved' ? 'Đã duyệt' : 
               request.status === 'rejected' ? 'Từ chối' : 
               request.status === 'pending' ? 'Chờ duyệt' : request.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{request.description || 'Không có mô tả'}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {request.requested_date ? `Ngày đề xuất: ${format(new Date(request.requested_date), 'dd/MM/yyyy')}` : ''}
            </span>
            <Badge variant="outline">
              {request.type === 'facility' ? 'Cơ sở vật chất' : 
               request.type === 'leave' ? 'Nghỉ phép' : 
               request.type === 'purchase' ? 'Mua sắm' : request.type}
            </Badge>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};
