
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Request } from '@/lib/types';
import { requestService, eventService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog';
import { Textarea } from '@/components/ui/textarea';

interface RequestApprovalButtonsProps {
  request: Request;
  onApprove?: () => void;
  onReject?: () => void;
}

const RequestApprovalButtons: React.FC<RequestApprovalButtonsProps> = ({
  request,
  onApprove,
  onReject
}) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await requestService.updateStatus(request.id, 'approved', comments);
      
      // Create activity event for approval
      await eventService.create({
        ten_su_kien: `Approved: ${request.noi_dung}`,
        ngay_bat_dau: new Date().toISOString().split('T')[0],
        loai_su_kien: 'request_approval',
        doi_tuong_id: request.id,
        ghi_chu: comments || 'Approved without comments',
        trang_thai: 'completed'
      });
      
      toast({
        title: "Thành công",
        description: "Đã phê duyệt yêu cầu",
      });
      
      if (onApprove) onApprove();
    } catch (error) {
      console.error("Error approving request:", error);
      toast({
        title: "Lỗi",
        description: "Không thể phê duyệt yêu cầu. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsApproveDialogOpen(false);
      setComments('');
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await requestService.updateStatus(request.id, 'rejected', comments);
      
      // Create activity event for rejection
      await eventService.create({
        ten_su_kien: `Rejected: ${request.noi_dung}`,
        ngay_bat_dau: new Date().toISOString().split('T')[0],
        loai_su_kien: 'request_rejection',
        doi_tuong_id: request.id,
        ghi_chu: comments || 'Rejected without comments',
        trang_thai: 'completed'
      });
      
      toast({
        title: "Thành công",
        description: "Đã từ chối yêu cầu",
      });
      
      if (onReject) onReject();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast({
        title: "Lỗi",
        description: "Không thể từ chối yêu cầu. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRejectDialogOpen(false);
      setComments('');
    }
  };

  // Skip rendering if already approved or rejected
  if (request.trang_thai === 'approved' || request.trang_thai === 'rejected') {
    return null;
  }

  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        onClick={() => setIsApproveDialogOpen(true)}
        className="flex items-center bg-green-600 hover:bg-green-700"
      >
        <CheckCircle2 className="h-4 w-4 mr-1" />
        Phê duyệt
      </Button>
      
      <Button
        size="sm"
        variant="destructive"
        onClick={() => setIsRejectDialogOpen(true)}
        className="flex items-center"
      >
        <XCircle className="h-4 w-4 mr-1" />
        Từ chối
      </Button>
      
      <ConfirmActionDialog 
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
        title="Phê duyệt yêu cầu"
        description="Bạn có chắc chắn muốn phê duyệt yêu cầu này không?"
        onConfirm={handleApprove}
        confirmText="Phê duyệt"
        cancelText="Hủy"
        isLoading={isLoading}
      >
        <div className="mb-4">
          <label htmlFor="approve-comments" className="block text-sm font-medium mb-1">
            Ghi chú (tùy chọn)
          </label>
          <Textarea
            id="approve-comments"
            placeholder="Nhập ghi chú cho việc phê duyệt..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full"
          />
        </div>
      </ConfirmActionDialog>
      
      <ConfirmActionDialog 
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        title="Từ chối yêu cầu"
        description="Bạn có chắc chắn muốn từ chối yêu cầu này không?"
        onConfirm={handleReject}
        confirmText="Từ chối"
        cancelText="Hủy"
        isLoading={isLoading}
        destructive
      >
        <div className="mb-4">
          <label htmlFor="reject-comments" className="block text-sm font-medium mb-1">
            Lý do từ chối
          </label>
          <Textarea
            id="reject-comments"
            placeholder="Nhập lý do từ chối..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full"
            required
          />
        </div>
      </ConfirmActionDialog>
    </div>
  );
};

export default RequestApprovalButtons;
