
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import { requestService, eventService } from '@/lib/supabase';
import { Request } from '@/lib/types';
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog';

interface RequestApprovalButtonsProps {
  request: Request;
  onStatusChange: () => void;
}

const RequestApprovalButtons: React.FC<RequestApprovalButtonsProps> = ({ 
  request, 
  onStatusChange 
}) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      // Update request status
      await requestService.update(request.id, {
        trang_thai: 'approved',
        ngay_thi_hanh: new Date().toISOString(),
        nguoi_xu_ly: 'Admin' // Replace with actual user
      });

      // Create an event for this approval if needed
      if (request.loai === 'event') {
        await eventService.create({
          tieu_de: request.tieu_de,
          noi_dung: request.noi_dung,
          loai: request.loai,
          ngay_bat_dau: request.ngay_mong_muon || new Date().toISOString(),
          ngay_ket_thuc: request.ngay_ket_thuc,
          dia_diem: request.dia_diem,
          phu_trach: request.nguoi_yeu_cau,
          trang_thai: 'scheduled',
          doi_tuong: request.doi_tuong,
          doi_tuong_id: request.doi_tuong_id
        });
      }

      toast({
        title: "Yêu cầu đã được phê duyệt",
        description: "Yêu cầu đã được phê duyệt thành công.",
      });
      
      onStatusChange();
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Lỗi",
        description: "Không thể phê duyệt yêu cầu. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsApproveDialogOpen(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      // Update request status
      await requestService.update(request.id, {
        trang_thai: 'rejected',
        ngay_thi_hanh: new Date().toISOString(),
        nguoi_xu_ly: 'Admin' // Replace with actual user
      });

      toast({
        title: "Yêu cầu đã bị từ chối",
        description: "Yêu cầu đã được từ chối thành công.",
      });
      
      onStatusChange();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Lỗi",
        description: "Không thể từ chối yêu cầu. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsRejectDialogOpen(false);
    }
  };

  // If request is not pending, don't show approval buttons
  if (request.trang_thai !== 'pending') {
    return null;
  }

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center text-green-600 hover:text-green-700 hover:bg-green-50"
        onClick={() => setIsApproveDialogOpen(true)}
        disabled={isProcessing}
      >
        <Check className="mr-1 h-4 w-4" />
        Phê duyệt
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => setIsRejectDialogOpen(true)}
        disabled={isProcessing}
      >
        <X className="mr-1 h-4 w-4" />
        Từ chối
      </Button>

      <ConfirmActionDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
        title="Xác nhận phê duyệt"
        description="Bạn có chắc chắn muốn phê duyệt yêu cầu này? Hành động này không thể hoàn tác."
        onConfirm={handleApprove}
        confirmText="Phê duyệt"
        cancelText="Hủy"
        isLoading={isProcessing}
      >
        <div className="p-2 border rounded mb-4">
          <p><strong>Tiêu đề:</strong> {request.tieu_de}</p>
          <p><strong>Người yêu cầu:</strong> {request.nguoi_yeu_cau}</p>
        </div>
      </ConfirmActionDialog>

      <ConfirmActionDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        title="Xác nhận từ chối"
        description="Bạn có chắc chắn muốn từ chối yêu cầu này? Hành động này không thể hoàn tác."
        onConfirm={handleReject}
        confirmText="Từ chối"
        cancelText="Hủy"
        isLoading={isProcessing}
        destructive={true}
      >
        <div className="p-2 border rounded mb-4">
          <p><strong>Tiêu đề:</strong> {request.tieu_de}</p>
          <p><strong>Người yêu cầu:</strong> {request.nguoi_yeu_cau}</p>
        </div>
      </ConfirmActionDialog>
    </div>
  );
};

export default RequestApprovalButtons;
