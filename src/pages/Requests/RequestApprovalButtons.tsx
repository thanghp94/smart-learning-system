
import React from 'react';
import { Check, X, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { requestService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Request } from '@/lib/types';

interface RequestApprovalButtonsProps {
  request: Request;
  onStatusChange: () => void;
}

const RequestApprovalButtons: React.FC<RequestApprovalButtonsProps> = ({
  request,
  onStatusChange,
}) => {
  const { toast } = useToast();

  const handleApprove = async () => {
    try {
      await requestService.update(request.id, {
        trang_thai: 'approved'
      });
      
      toast({
        title: 'Thành công',
        description: 'Đã duyệt yêu cầu',
      });
      
      onStatusChange();
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể duyệt yêu cầu',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async () => {
    try {
      await requestService.update(request.id, {
        trang_thai: 'rejected'
      });
      
      toast({
        title: 'Thành công',
        description: 'Đã từ chối yêu cầu',
      });
      
      onStatusChange();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể từ chối yêu cầu',
        variant: 'destructive',
      });
    }
  };

  const handleRevise = async () => {
    try {
      await requestService.update(request.id, {
        trang_thai: 'needs_revision'
      });
      
      toast({
        title: 'Thành công',
        description: 'Đã gửi yêu cầu điều chỉnh',
      });
      
      onStatusChange();
    } catch (error) {
      console.error('Error sending revision request:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể gửi yêu cầu điều chỉnh',
        variant: 'destructive',
      });
    }
  };

  // Only show approval buttons if request is pending
  if (request.trang_thai !== 'pending') {
    return null;
  }

  return (
    <div className="flex space-x-2 mt-4">
      <Button 
        variant="outline" 
        size="sm" 
        className="text-green-600 border-green-600 hover:bg-green-50"
        onClick={handleApprove}
      >
        <Check className="h-4 w-4 mr-1" /> Duyệt
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="text-red-600 border-red-600 hover:bg-red-50"
        onClick={handleReject}
      >
        <X className="h-4 w-4 mr-1" /> Không duyệt
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="text-amber-600 border-amber-600 hover:bg-amber-50"
        onClick={handleRevise}
      >
        <Edit className="h-4 w-4 mr-1" /> Điều chỉnh thêm
      </Button>
    </div>
  );
};

export default RequestApprovalButtons;
