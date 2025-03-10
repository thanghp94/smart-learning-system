
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Request } from '@/lib/types/request';
import { requestService } from '@/lib/supabase';

interface RequestApprovalButtonsProps {
  request: Request;
  onRequestUpdate: () => void;
}

const RequestApprovalButtons: React.FC<RequestApprovalButtonsProps> = ({ 
  request, 
  onRequestUpdate 
}) => {
  const { toast } = useToast();

  const handleApprove = async () => {
    try {
      await requestService.update(request.id, {
        trang_thai: 'approved'
      });
      
      toast({
        title: "Thành công",
        description: "Đã phê duyệt yêu cầu",
      });
      
      onRequestUpdate();
    } catch (error) {
      console.error("Error approving request:", error);
      toast({
        title: "Lỗi",
        description: "Không thể phê duyệt yêu cầu",
        variant: "destructive"
      });
    }
  };

  const handleReject = async () => {
    try {
      await requestService.update(request.id, {
        trang_thai: 'rejected'
      });
      
      toast({
        title: "Thành công",
        description: "Đã từ chối yêu cầu",
      });
      
      onRequestUpdate();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast({
        title: "Lỗi",
        description: "Không thể từ chối yêu cầu",
        variant: "destructive"
      });
    }
  };

  const handleReviewNeeded = async () => {
    try {
      await requestService.update(request.id, {
        trang_thai: 'review_needed'
      });
      
      toast({
        title: "Thành công",
        description: "Đã đánh dấu yêu cầu cần xem xét lại",
      });
      
      onRequestUpdate();
    } catch (error) {
      console.error("Error marking request for review:", error);
      toast({
        title: "Lỗi",
        description: "Không thể đánh dấu yêu cầu",
        variant: "destructive"
      });
    }
  };

  // Only show buttons for pending requests
  if (request.trang_thai !== 'pending') {
    return null;
  }

  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="default"
        onClick={handleApprove}
        className="bg-green-500 hover:bg-green-600"
      >
        <Check className="h-4 w-4 mr-1" />
        Phê duyệt
      </Button>
      
      <Button 
        size="sm" 
        variant="outline"
        onClick={handleReviewNeeded}
      >
        <AlertCircle className="h-4 w-4 mr-1" />
        Cần xem xét
      </Button>
      
      <Button 
        size="sm" 
        variant="destructive"
        onClick={handleReject}
      >
        <X className="h-4 w-4 mr-1" />
        Từ chối
      </Button>
    </div>
  );
};

export default RequestApprovalButtons;
