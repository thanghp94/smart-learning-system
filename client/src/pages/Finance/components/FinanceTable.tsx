
import React from 'react';
import { format } from 'date-fns';
import { Finance } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface FinanceTableProps {
  finances: Finance[];
  onRowClick?: (finance: Finance) => void;
  isLoading?: boolean;
}

const FinanceTable: React.FC<FinanceTableProps> = ({ finances, onRowClick, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        Loading financial data...
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ngày</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead>Số tiền</TableHead>
          <TableHead>Loại</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {finances.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
              Không có dữ liệu tài chính
            </TableCell>
          </TableRow>
        ) : (
          finances.map((finance) => (
            <TableRow
              key={finance.id}
              className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
              onClick={() => onRowClick && onRowClick(finance)}
            >
              <TableCell>
                {finance.ngay ? format(new Date(finance.ngay), 'dd/MM/yyyy') : '—'}
              </TableCell>
              <TableCell>{finance.dien_giai || finance.ten_phi || '—'}</TableCell>
              <TableCell className={finance.loai_thu_chi === 'income' ? 'text-green-600' : 'text-red-600'}>
                {finance.tong_tien ? finance.tong_tien.toLocaleString('vi-VN') + ' ₫' : '—'}
              </TableCell>
              <TableCell>
                <Badge variant={finance.loai_thu_chi === 'income' ? 'default' : 'destructive'}>
                  {finance.loai_thu_chi === 'income' ? 'Thu' : 'Chi'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {finance.tinh_trang || 'Pending'}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default FinanceTable;
