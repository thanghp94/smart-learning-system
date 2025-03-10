
import { useState } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Edit } from "lucide-react";
import { requestService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface RequestApprovalButtonsProps {
  requestId: string;
  onUpdate: () => void;
}

export function RequestApprovalButtons({ requestId, onUpdate }: RequestApprovalButtonsProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await requestService.update(requestId, {
        trang_thai: 'approved',
        ghi_chu: notes
      });
      toast({
        title: "Đã duyệt đề xuất",
        description: "Đề xuất đã được duyệt thành công",
        variant: "default",
      });
      onUpdate();
    } catch (error) {
      console.error("Error approving request:", error);
      toast({
        title: "Lỗi",
        description: "Không thể duyệt đề xuất. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setShowApproveDialog(false);
      setNotes('');
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      await requestService.update(requestId, {
        trang_thai: 'rejected',
        ghi_chu: notes
      });
      toast({
        title: "Đã từ chối đề xuất",
        description: "Đề xuất đã bị từ chối",
        variant: "default",
      });
      onUpdate();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast({
        title: "Lỗi",
        description: "Không thể từ chối đề xuất. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setShowRejectDialog(false);
      setNotes('');
    }
  };

  const handleAdjust = async () => {
    setIsSubmitting(true);
    try {
      await requestService.update(requestId, {
        trang_thai: 'needs_adjustment',
        ghi_chu: notes
      });
      toast({
        title: "Yêu cầu điều chỉnh",
        description: "Đã gửi yêu cầu điều chỉnh đề xuất",
        variant: "default", // Changed from "success" to "default"
      });
      onUpdate();
    } catch (error) {
      console.error("Error requesting adjustment:", error);
      toast({
        title: "Lỗi",
        description: "Không thể gửi yêu cầu điều chỉnh. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setShowAdjustDialog(false);
      setNotes('');
    }
  };

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center text-green-600" 
        onClick={() => setShowApproveDialog(true)}
      >
        <Check className="mr-1 h-4 w-4" />
        Duyệt
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center text-red-600" 
        onClick={() => setShowRejectDialog(true)}
      >
        <X className="mr-1 h-4 w-4" />
        Không duyệt
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center text-blue-600" 
        onClick={() => setShowAdjustDialog(true)}
      >
        <Edit className="mr-1 h-4 w-4" />
        Điều chỉnh
      </Button>

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận duyệt đề xuất</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn duyệt đề xuất này không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Ghi chú (không bắt buộc)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Duyệt"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận từ chối đề xuất</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn từ chối đề xuất này không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Lý do từ chối (không bắt buộc)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Từ chối"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Adjust Dialog */}
      <AlertDialog open={showAdjustDialog} onOpenChange={setShowAdjustDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yêu cầu điều chỉnh đề xuất</AlertDialogTitle>
            <AlertDialogDescription>
              Hãy cung cấp chi tiết về những điều chỉnh cần thiết.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Chi tiết điều chỉnh cần thực hiện"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
            required
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleAdjust} disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Gửi yêu cầu"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default RequestApprovalButtons;
