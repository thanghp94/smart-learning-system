
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Finance } from '@/lib/types';
import ProgressBar from '@/components/ui/progress-bar';

interface FinanceStatsProps {
  finances: Finance[];
}

const FinanceStats: React.FC<FinanceStatsProps> = ({ finances }) => {
  // Calculate total income
  const totalIncome = finances
    .filter(finance => finance.loai_thu_chi === 'income')
    .reduce((sum, finance) => sum + finance.tong_tien, 0);

  // Calculate total expenses
  const totalExpenses = finances
    .filter(finance => finance.loai_thu_chi === 'expense')
    .reduce((sum, finance) => sum + finance.tong_tien, 0);

  // Calculate balance
  const balance = totalIncome - totalExpenses;

  // Calculate expense ratio
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  // Format currency
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
