
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Student, Enrollment, Evaluation } from '@/lib/types';
import { evaluationService } from '@/lib/supabase';
import DataTable from '@/components/ui/DataTable';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ViewEvaluationsButtonProps {
  studentId?: string;
  enrollmentId?: string;
  classId?: string;
  showAsSheet?: boolean;
  buttonText?: string;
}

const ViewEvaluationsButton: React.FC<ViewEvaluationsButtonProps> = ({
  studentId,
  enrollmentId,
  classId,
  showAsSheet = true,
  buttonText = "Xem đánh giá"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadEvaluations = async () => {
    try {
      setIsLoading(true);
      let data: Evaluation[] = [];
      
      if (studentId) {
        data = await evaluationService.getByStudent(studentId);
      } else if (enrollmentId) {
        data = await evaluationService.getByEnrollment(enrollmentId);
      } else if (classId) {
        data = await evaluationService.getByClass(classId);
      }
      
      setEvaluations(data);
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

  const handleOpen = async () => {
    await loadEvaluations();
    setIsOpen(true);
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
      render: (value: string) => formatDate(value),
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      sortable: true,
      render: (value: string) => (
        <Badge
          variant={
            value === 'completed' ? 'success' :
            value === 'pending' ? 'warning' :
            'secondary'
          }
        >
          {value === 'completed' ? 'Hoàn thành' :
           value === 'pending' ? 'Đang chờ' :
           value}
        </Badge>
      ),
    },
  ];

  const content = (
    <>
      {isLoading ? (
        <div className="flex justify-center p-8">Đang tải...</div>
      ) : evaluations.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          Không có đánh giá nào
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={evaluations}
          searchable={true}
          searchPlaceholder="Tìm kiếm đánh giá..."
        />
      )}
    </>
  );

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpen}
        disabled={isLoading}
      >
        <Star className="h-4 w-4 mr-1" />
        {buttonText}
      </Button>

      {showAsSheet ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Lịch sử đánh giá</SheetTitle>
            </SheetHeader>
            <div className="py-6">
              {content}
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[800px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Lịch sử đánh giá</DialogTitle>
            </DialogHeader>
            <div className="py-3">
              {content}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ViewEvaluationsButton;
