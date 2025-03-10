
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, ChevronsUp } from 'lucide-react';
import { requestService } from '@/lib/supabase/request-service';
import { useToast } from '@/hooks/use-toast';
import { Request } from '@/lib/types';

interface RequestApprovalButtonsProps {
  request: Request;
  onStatusChange: () => void;
}

const RequestApprovalButtons: React.FC<RequestApprovalButtonsProps> = ({ 
  request, 
  onStatusChange 
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    try {
      setLoading(true);
      await requestService.update(request.id, {
        status: 'approved'
      });
      toast({
        title: 'Thành công',
        description: 'Yêu cầu đã được phê duyệt',
      });
      onStatusChange();
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể phê duyệt yêu cầu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await requestService.update(request.id, {
        status: 'rejected'
      });
      toast({
        title: 'Thành công',
        description: 'Yêu cầu đã bị từ chối',
      });
      onStatusChange();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể từ chối yêu cầu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    try {
      setLoading(true);
      await requestService.update(request.id, {
        status: 'escalated'
      });
      toast({
        title: 'Thành công',
        description: 'Yêu cầu đã được chuyển lên cấp trên',
      });
      onStatusChange();
    } catch (error) {
      console.error('Error escalating request:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể chuyển yêu cầu lên cấp trên',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Only show buttons if the request is pending
  if (request.status !== 'pending') {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleApprove}
        disabled={loading}
      >
        <Check className="h-4 w-4" /> Phê duyệt
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleReject}
        disabled={loading}
      >
        <X className="h-4 w-4" /> Từ chối
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleEscalate}
        disabled={loading}
      >
        <ChevronsUp className="h-4 w-4" /> Chuyển cấp
      </Button>
    </div>
  );
};

export default RequestApprovalButtons;
