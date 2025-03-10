
import React, { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { Evaluation, Student, Enrollment } from '@/lib/types';
import { evaluationService } from '@/lib/supabase';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';

interface ViewEvaluationsButtonProps {
  studentId?: string;
  enrollmentId?: string;
  buttonLabel?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ViewEvaluationsButton: React.FC<ViewEvaluationsButtonProps> = ({ 
  studentId, 
  enrollmentId,
  buttonLabel = "Xem đánh giá",
  variant = "outline",
  size = "sm"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const openSheet = async () => {
    try {
      setIsLoading(true);
      let evaluationsData: Evaluation[] = [];
      
      if (enrollmentId) {
        // Fetch evaluations by enrollment ID
        evaluationsData = await evaluationService.getByEnrollment(enrollmentId);
      } else if (studentId) {
        // Fetch evaluations by student ID
        evaluationsData = await evaluationService.getByStudent(studentId);
      }
      
      setEvaluations(evaluationsData || []);
      setIsOpen(true);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách đánh giá',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Tên đánh giá",
      key: "ten_danh_gia",
      sortable: true,
    },
    {
      title: "Đối tượng",
      key: "doi_tuong",
      sortable: true,
    },
    {
      title: "Ngày đánh giá",
      key: "ngay_dau_dot_danh_gia",
      sortable: true,
      render: (value: string) => value ? new Date(value).toLocaleDateString('vi-VN') : '',
    },
    {
      title: "Hạn hoàn thành",
      key: "han_hoan_thanh",
      sortable: true,
      render: (value: string) => value ? new Date(value).toLocaleDateString('vi-VN') : '',
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      sortable: true,
      render: (value: string) => (
        <Badge variant={
          value === "completed" ? "success" : 
          value === "in-progress" ? "warning" : 
          "secondary"
        }>
          {value === "completed" ? "Hoàn thành" : 
           value === "in-progress" ? "Đang thực hiện" : 
           "Chưa bắt đầu"}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        onClick={openSheet}
        disabled={isLoading}
      >
        <ClipboardList className="h-4 w-4 mr-1" />
        {buttonLabel}
      </Button>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-[400px] sm:w-[640px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Danh sách đánh giá</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            {evaluations.length > 0 ? (
              <DataTable
                columns={columns}
                data={evaluations}
                isLoading={isLoading}
                searchable={true}
                searchPlaceholder="Tìm kiếm đánh giá..."
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Không có đánh giá nào</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ViewEvaluationsButton;
