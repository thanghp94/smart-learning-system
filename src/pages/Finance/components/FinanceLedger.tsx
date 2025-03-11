
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Finance } from "@/lib/types";
import { format } from "date-fns";

export interface FinanceLedgerProps {
  finances: Finance[];
  isLoading: boolean;
}

const FinanceLedger: React.FC<FinanceLedgerProps> = ({ finances, isLoading }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ngày</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead>Loại</TableHead>
          <TableHead className="text-right">Thu</TableHead>
          <TableHead className="text-right">Chi</TableHead>
          <TableHead className="text-right">Số dư</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {finances.slice().reverse().map((finance, index) => {
          // Calculate running balance
          const previousTransactions = finances.slice(0, finances.length - index);
          const runningBalance = previousTransactions.reduce((balance, transaction) => {
            if (transaction.loai_thu_chi === 'income') {
              return balance + transaction.tong_tien;
            } else {
              return balance - transaction.tong_tien;
            }
          }, 0);

          return (
            <TableRow key={finance.id}>
              <TableCell className="font-medium">
                {finance.ngay ? format(new Date(finance.ngay), 'dd/MM/yyyy') : '-'}
              </TableCell>
              <TableCell>{finance.dien_giai || '-'}</TableCell>
              <TableCell>{finance.loai_giao_dich || '-'}</TableCell>
              <TableCell className="text-right">
                {finance.loai_thu_chi === 'income' ? formatCurrency(finance.tong_tien) : '-'}
              </TableCell>
              <TableCell className="text-right text-red-600">
                {finance.loai_thu_chi === 'expense' ? formatCurrency(finance.tong_tien) : '-'}
              </TableCell>
              <TableCell className={`text-right ${runningBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(runningBalance)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default FinanceLedger;
