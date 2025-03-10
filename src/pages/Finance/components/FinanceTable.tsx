
import React from 'react';
import { format } from 'date-fns';
import { Finance } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface FinanceTableProps {
  finances: Finance[];
  onRowClick?: (finance: Finance) => void;
}

const FinanceTable: React.FC<FinanceTableProps> = ({ finances, onRowClick }) => {
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
                {finance.ngay_tao ? format(new Date(finance.ngay_tao), 'dd/MM/yyyy') : '—'}
              </TableCell>
              <TableCell>{finance.mo_ta || '—'}</TableCell>
              <TableCell className={finance.loai === 'thu' ? 'text-green-600' : 'text-red-600'}>
                {finance.so_tien ? finance.so_tien.toLocaleString('vi-VN') + ' ₫' : '—'}
              </TableCell>
              <TableCell>
                <Badge variant={finance.loai === 'thu' ? 'default' : 'destructive'}>
                  {finance.loai === 'thu' ? 'Thu' : 'Chi'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {finance.trang_thai || 'Pending'}
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
