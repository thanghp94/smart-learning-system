
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { requestService, eventService } from "@/lib/database";
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog';
import { Request, Event } from '@/lib/types';

interface RequestApprovalButtonsProps {
  request: Request;
  onRequestUpdated: () => void;
}

const RequestApprovalButtons: React.FC<RequestApprovalButtonsProps> = ({
  request,
  onRequestUpdated
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      // Update the request status
      await requestService.updateStatus(request.id, 'approved', new Date().toISOString());
      
      // For certain request types, create related records (e.g. events)
      if (request.type === 'event') {
        // Create event from request data
        const eventData: Partial<Event> = {
          title: request.title || '',
          description: request.description || '',
          type: request.type || 'other',
          start_date: request.requested_date || new Date().toISOString(),
          location: request.location || '',
          created_by: request.requester || '',
          entity_type: request.entity_type,
          entity_id: request.entity_id,
          status: 'scheduled'
        };
        
        await eventService.create(eventData);
      }
      
      toast({
        title: "Yêu cầu đã được duyệt",
        description: "Yêu cầu đã được chấp thuận và thực thi"
      });
      
      onRequestUpdated();
    } catch (error) {
      console.error("Error approving request:", error);
      toast({
        title: "Lỗi",
        description: "Không thể duyệt yêu cầu. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsApproving(false);
      setShowApproveDialog(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      // Update the request status
      await requestService.updateStatus(request.id, 'rejected', new Date().toISOString());
      
      toast({
        title: "Yêu cầu đã bị từ chối",
        description: "Yêu cầu đã bị từ chối thành công"
      });
      
      onRequestUpdated();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast({
        title: "Lỗi",
        description: "Không thể từ chối yêu cầu. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsRejecting(false);
      setShowRejectDialog(false);
    }
  };

  // Don't show buttons if already approved or rejected
  if (request.status === 'approved' || request.status === 'rejected') {
    return null;
  }

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-green-50 hover:bg-green-100 border-green-200 text-green-600"
        onClick={() => setShowApproveDialog(true)}
        disabled={isApproving || isRejecting}
      >
        <Check className="h-4 w-4 mr-1" /> Duyệt
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
        onClick={() => setShowRejectDialog(true)}
        disabled={isApproving || isRejecting}
      >
        <X className="h-4 w-4 mr-1" /> Từ chối
      </Button>
      
      <ConfirmActionDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        title="Xác nhận duyệt yêu cầu"
        description={`Bạn có chắc chắn muốn duyệt yêu cầu "${request.title || ''}" từ ${request.requester || ''}?`}
        onConfirm={handleApprove}
        confirmText="Duyệt yêu cầu"
        cancelText="Hủy"
        isLoading={isApproving}
      />
      
      <ConfirmActionDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        title="Xác nhận từ chối yêu cầu"
        description={`Bạn có chắc chắn muốn từ chối yêu cầu "${request.title || ''}" từ ${request.requester || ''}?`}
        onConfirm={handleReject}
        confirmText="Từ chối yêu cầu"
        cancelText="Hủy"
        isLoading={isRejecting}
        destructive={true}
      />
    </div>
  );
};

export default RequestApprovalButtons;
