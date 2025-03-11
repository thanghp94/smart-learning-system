
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProgressBar from '@/components/ui/progress-bar';
import { Finance } from '@/lib/types';

export interface FinanceStatsProps {
  finances?: Finance[];
  totalIncome?: number;
  totalExpense?: number;
  balance?: number;
}

const FinanceStats: React.FC<FinanceStatsProps> = ({ 
  finances, 
  totalIncome: propTotalIncome,
  totalExpense: propTotalExpense,
  balance: propBalance
}) => {
  // Tính toán từ finances nếu được cung cấp, ngược lại sử dụng props trực tiếp
  const totalIncome = propTotalIncome !== undefined 
    ? propTotalIncome 
    : finances
      ?.filter(finance => finance.loai_thu_chi === 'income')
      .reduce((sum, finance) => sum + finance.tong_tien, 0) || 0;

  const totalExpenses = propTotalExpense !== undefined
    ? propTotalExpense
    : finances
      ?.filter(finance => finance.loai_thu_chi === 'expense')
      .reduce((sum, finance) => sum + finance.tong_tien, 0) || 0;

  const balance = propBalance !== undefined 
    ? propBalance 
    : totalIncome - totalExpenses;

  // Tính tỷ lệ chi phí
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Tổng Thu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
          <ProgressBar 
            value={totalIncome} 
            max={totalIncome + totalExpenses}
            variant="success"
            size="sm"
            className="mt-2"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Tổng Chi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          <ProgressBar 
            value={totalExpenses} 
            max={totalIncome + totalExpenses}
            variant="danger"
            size="sm"
            className="mt-2"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Tỷ Lệ Chi/Thu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{expenseRatio.toFixed(1)}%</div>
          <ProgressBar 
            value={expenseRatio} 
            max={100}
            variant={expenseRatio > 80 ? "danger" : expenseRatio > 60 ? "warning" : "success"}
            size="sm"
            showValue
            className="mt-2"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceStats;
