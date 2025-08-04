
import React from 'react';
import { Finance } from '@/lib/types';
import { TableCell, TableRow, TableBody, TableHead, TableHeader, Table } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog';
import { financeService } from "@/lib/database";
import { useToast } from '@/hooks/use-toast';

export interface FinanceListProps {
  finances: Finance[];
  isLoading: boolean;
  onDelete?: (finance: Finance) => void;
}

const FinanceList: React.FC<FinanceListProps> = ({ finances, isLoading, onDelete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = React.useState<Finance | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (finances.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Chưa có giao dịch nào</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    
    try {
      setIsDeleting(true);
      await financeService.delete(confirmDelete.id);
      toast({
        title: "Thành công",
        description: "Đã xóa giao dịch"
      });
      
      if (onDelete) {
        onDelete(confirmDelete);
      }
    } catch (error) {
      console.error("Error deleting finance:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa giao dịch",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setConfirmDelete(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ngày</TableHead>
            <TableHead>Diễn giải</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead className="text-right">Số tiền</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {finances.map((finance) => (
            <TableRow key={finance.id}>
              <TableCell className="font-medium">
                {finance.ngay ? format(new Date(finance.ngay), 'dd/MM/yyyy') : 'N/A'}
              </TableCell>
              <TableCell>{finance.dien_giai || 'N/A'}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-md text-xs ${finance.loai_thu_chi === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {finance.loai_thu_chi === 'income' ? 'Thu' : 'Chi'} - {finance.loai_giao_dich || 'N/A'}
                </span>
              </TableCell>
              <TableCell className={`text-right font-medium ${finance.loai_thu_chi === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(finance.tong_tien)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/finance/${finance.id}`)}
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/finance/edit/${finance.id}`)}
                    title="Chỉnh sửa"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => setConfirmDelete(finance)}
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmActionDialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
        title="Xóa giao dịch"
        description="Bạn có chắc chắn muốn xóa giao dịch này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete}
        confirmText="Xóa"
        cancelText="Hủy"
        isLoading={isDeleting}
        destructive={true}
      />
    </>
  );
};

export default FinanceList;
