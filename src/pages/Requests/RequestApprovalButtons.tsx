
import React, { useState } from 'react';
import { Check, X, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { requestService } from '@/lib/supabase';
import { Request } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ConfirmActionDialog } from '@/components/ui/confirm-action-dialog';

interface RequestApprovalButtonsProps {
  request: Request;
  onUpdate: () => void;
  viewMode?: boolean;
}

export const getStatusBadge = (trangThai: string) => {
  switch (trangThai) {
    case 'approved':
      return <Badge variant="success">Đã duyệt</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Từ chối</Badge>;
    case 'pending':
      return <Badge variant="outline">Chờ duyệt</Badge>;
    case 'completed':
      return <Badge variant="default">Hoàn thành</Badge>;
    default:
      return <Badge variant="outline">{trangThai}</Badge>;
  }
};

const RequestApprovalButtons: React.FC<RequestApprovalButtonsProps> = ({ 
  request, 
  onUpdate,
  viewMode = false 
}) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // If request is already approved or rejected, just show the status
  if (viewMode || request.trang_thai === 'approved' || request.trang_thai === 'rejected') {
    return getStatusBadge(request.trang_thai);
  }

  const handleApprove = async () => {
    try {
      setLoading(true);
      await requestService.updateStatus(request.id, 'approved');
      toast({
        title: 'Thành công',
        description: 'Yêu cầu đã được duyệt',
      });
      onUpdate();
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể duyệt yêu cầu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setIsApproveDialogOpen(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await requestService.updateStatus(request.id, 'rejected');
      toast({
        title: 'Thành công',
        description: 'Yêu cầu đã bị từ chối',
      });
      onUpdate();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể từ chối yêu cầu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setIsRejectDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Hành động</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsApproveDialogOpen(true)}>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Duyệt</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsRejectDialogOpen(true)}>
              <X className="mr-2 h-4 w-4 text-red-500" />
              <span>Từ chối</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {getStatusBadge(request.trang_thai)}
      </div>

      <ConfirmActionDialog
        isOpen={isApproveDialogOpen}
        onClose={() => setIsApproveDialogOpen(false)}
        onConfirm={handleApprove}
        title="Xác nhận phê duyệt"
        description="Bạn có chắc chắn muốn phê duyệt yêu cầu này không?"
        confirmText="Phê duyệt"
        cancelText="Hủy"
        isLoading={loading}
      />

      <ConfirmActionDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={handleReject}
        title="Xác nhận từ chối"
        description="Bạn có chắc chắn muốn từ chối yêu cầu này không?"
        confirmText="Từ chối"
        confirmVariant="destructive"
        cancelText="Hủy"
        isLoading={loading}
      />
    </>
  );
};

export default RequestApprovalButtons;
