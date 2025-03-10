import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Request } from '@/lib/types';
import { requestService } from '@/lib/supabase';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { eventService } from '@/lib/supabase';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
// Use default import instead
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
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await requestService.updateStatus(request.id, 'approved', comments);
      
      // Log as an event
      await eventService.create({
        ten_su_kien: `Approved Request: ${request.noi_dung}`,
        loai_su_kien: 'request_approval',
        ngay_bat_dau: new Date().toISOString().split('T')[0],
        entity_type: 'request',
        entity_id: request.id,
        trang_thai: 'completed'
      });
      
      toast({
        title: 'Request Approved',
        description: 'The request has been successfully approved.',
      });
      onStatusChange();
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: 'Error',
        description: 'There was an error approving the request. Please try again.',
        variant: 'destructive'
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
      
      // Log as an event
      await eventService.create({
        ten_su_kien: `Rejected Request: ${request.noi_dung}`,
        loai_su_kien: 'request_rejection',
        ngay_bat_dau: new Date().toISOString().split('T')[0],
        entity_type: 'request',
        entity_id: request.id,
        trang_thai: 'completed'
      });
      
      toast({
        title: 'Request Rejected',
        description: 'The request has been rejected.',
      });
      onStatusChange();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: 'Error',
        description: 'There was an error rejecting the request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setIsRejectDialogOpen(false);
      setComments('');
    }
  };

  // Disable buttons if request is not pending
  const isPending = request.trang_thai === 'pending';

  return (
    <>
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          disabled={!isPending || isLoading}
          onClick={() => setIsApproveDialogOpen(true)}
        >
          <Check className="h-4 w-4 mr-2" />
          Approve
        </Button>
        <Button
          variant="destructive"
          disabled={!isPending || isLoading}
          onClick={() => setIsRejectDialogOpen(true)}
        >
          <X className="h-4 w-4 mr-2" />
          Reject
        </Button>
      </div>

      <ConfirmActionDialog
        isOpen={isApproveDialogOpen}
        onClose={() => setIsApproveDialogOpen(false)}
        onConfirm={handleApprove}
        title="Approve Request"
        description={
          <>
            Are you sure you want to approve this request?
            <div className="grid gap-2 mt-4">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                placeholder="Add any relevant comments here..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
          </>
        }
        confirmText="Approve"
      />

      <ConfirmActionDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={handleReject}
        title="Reject Request"
        description={
          <>
            Are you sure you want to reject this request?
            <div className="grid gap-2 mt-4">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                placeholder="Add any relevant comments here..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
          </>
        }
        confirmText="Reject"
        variant="destructive"
      />
    </>
  );
};

export default RequestApprovalButtons;
