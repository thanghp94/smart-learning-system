
import React from 'react';
import { Finance } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export interface FinanceLedgerProps {
  finances: Finance[];
  isLoading: boolean;
}

const FinanceLedger: React.FC<FinanceLedgerProps> = ({ finances, isLoading }) => {
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

  // Group finances by month and year
  const groupedFinances: Record<string, Finance[]> = {};
  
  finances.forEach(finance => {
    if (!finance.ngay) return;
    
    const date = new Date(finance.ngay);
    const monthYear = format(date, 'MM/yyyy');
    
    if (!groupedFinances[monthYear]) {
      groupedFinances[monthYear] = [];
    }
    
    groupedFinances[monthYear].push(finance);
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedFinances).map(([monthYear, monthFinances]) => {
        // Calculate month totals
        const incomeTotal = monthFinances
          .filter(f => f.loai_thu_chi === 'income')
          .reduce((sum, f) => sum + f.tong_tien, 0);
        
        const expenseTotal = monthFinances
          .filter(f => f.loai_thu_chi === 'expense')
          .reduce((sum, f) => sum + f.tong_tien, 0);
        
        const balance = incomeTotal - expenseTotal;
        
        return (
          <Card key={monthYear} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-xl">{monthYear}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng thu</p>
                    <p className="text-lg font-semibold text-green-600">{formatCurrency(incomeTotal)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng chi</p>
                    <p className="text-lg font-semibold text-red-600">{formatCurrency(expenseTotal)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Số dư</p>
                    <p className={`text-lg font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(balance)}
                    </p>
                  </div>
                </div>
                
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Ngày</th>
                      <th className="text-left py-2">Diễn giải</th>
                      <th className="text-left py-2">Loại</th>
                      <th className="text-right py-2">Thu</th>
                      <th className="text-right py-2">Chi</th>
                      <th className="text-right py-2">Số dư</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthFinances.map((finance, index) => {
                      // Calculate running balance
                      const prevFinances = monthFinances.slice(0, index + 1);
                      const runningIncomeTotal = prevFinances
                        .filter(f => f.loai_thu_chi === 'income')
                        .reduce((sum, f) => sum + f.tong_tien, 0);
                      
                      const runningExpenseTotal = prevFinances
                        .filter(f => f.loai_thu_chi === 'expense')
                        .reduce((sum, f) => sum + f.tong_tien, 0);
                      
                      const runningBalance = runningIncomeTotal - runningExpenseTotal;
                      
                      return (
                        <tr key={finance.id} className="border-b">
                          <td className="py-2">
                            {finance.ngay ? format(new Date(finance.ngay), 'dd/MM/yyyy') : 'N/A'}
                          </td>
                          <td className="py-2">{finance.dien_giai || 'N/A'}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-md text-xs ${finance.loai_thu_chi === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {finance.loai_thu_chi === 'income' ? 'Thu' : 'Chi'} - {finance.loai_giao_dich || 'N/A'}
                            </span>
                          </td>
                          <td className="text-right py-2">
                            {finance.loai_thu_chi === 'income' ? formatCurrency(finance.tong_tien) : '-'}
                          </td>
                          <td className="text-right py-2">
                            {finance.loai_thu_chi === 'expense' ? formatCurrency(finance.tong_tien) : '-'}
                          </td>
                          <td className={`text-right py-2 ${runningBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(runningBalance)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FinanceLedger;
