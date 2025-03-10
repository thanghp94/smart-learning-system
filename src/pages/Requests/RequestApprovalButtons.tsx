
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Request } from '@/lib/types';

interface RequestApprovalButtonsProps {
  request: Request;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onNeedChanges: (id: string) => Promise<void>;
}

const RequestApprovalButtons: React.FC<RequestApprovalButtonsProps> = ({
  request,
  onApprove,
  onReject,
  onNeedChanges
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      await onApprove(request.id);
      toast({
        title: "Thành công",
        description: "Đã duyệt yêu cầu",
      });
    } catch (error) {
      console.error("Error approving request:", error);
      toast({
        title: "Lỗi",
        description: "Không thể duyệt yêu cầu. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsLoading(true);
      await onReject(request.id);
      toast({
        title: "Đã từ chối",
        description: "Đã từ chối yêu cầu",
      });
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast({
        title: "Lỗi",
        description: "Không thể từ chối yêu cầu. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNeedChanges = async () => {
    try {
      setIsLoading(true);
      await onNeedChanges(request.id);
      toast({
        title: "Đã gửi phản hồi",
        description: "Đã yêu cầu chỉnh sửa thêm",
      });
    } catch (error) {
      console.error("Error requesting changes:", error);
      toast({
        title: "Lỗi",
        description: "Không thể yêu cầu chỉnh sửa. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show buttons only if request is in pending state
  if (request.trang_thai !== 'pending') {
    return null;
  }

  return (
    <div className="flex space-x-2 mt-4">
      <Button 
        variant="success" 
        size="sm" 
        onClick={handleApprove} 
        disabled={isLoading}
      >
        <Check className="mr-1 h-4 w-4" /> Duyệt
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={handleReject} 
        disabled={isLoading}
      >
        <X className="mr-1 h-4 w-4" /> Không duyệt
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleNeedChanges} 
        disabled={isLoading}
      >
        <Edit className="mr-1 h-4 w-4" /> Điều chỉnh thêm
      </Button>
    </div>
  );
};

export default RequestApprovalButtons;
