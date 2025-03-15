
import React, { useState, useEffect } from 'react';
import { Finance } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { financeService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface FinanceLedgerProps {
  finances?: Finance[];
  isLoading: boolean;
}

const FinanceLedger: React.FC<FinanceLedgerProps> = ({ finances: propFinances, isLoading: propIsLoading }) => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [isLoading, setIsLoading] = useState(propIsLoading);
  const [groupedFinances, setGroupedFinances] = useState<Record<string, Finance[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (propFinances) {
      setFinances(propFinances);
      groupFinancesByMonth(propFinances);
    } else {
      fetchLedgerData();
    }
  }, [propFinances]);

  const fetchLedgerData = async () => {
    setIsLoading(true);
    try {
      const data = await financeService.getAll();
      setFinances(data);
      groupFinancesByMonth(data);
    } catch (error) {
      console.error('Error fetching ledger data:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu sổ cái. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const groupFinancesByMonth = (data: Finance[]) => {
    const grouped: Record<string, Finance[]> = {};
    
    data.forEach(finance => {
      if (!finance.ngay) return;
      
      const date = new Date(finance.ngay);
      const monthYear = format(date, 'MM/yyyy');
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      
      grouped[monthYear].push(finance);
    });
    
    setGroupedFinances(grouped);
  };

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

  if (Object.keys(groupedFinances).length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Chưa có giao dịch nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedFinances).map(([monthYear, monthFinances]) => {
        // Calculate month totals
        const incomeTotal = monthFinances
          .filter(f => f.loai_thu_chi === 'income' || f.loai_thu_chi === 'thu')
          .reduce((sum, f) => sum + f.tong_tien, 0);
        
        const expenseTotal = monthFinances
          .filter(f => f.loai_thu_chi === 'expense' || f.loai_thu_chi === 'chi')
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
                        .filter(f => f.loai_thu_chi === 'income' || f.loai_thu_chi === 'thu')
                        .reduce((sum, f) => sum + f.tong_tien, 0);
                      
                      const runningExpenseTotal = prevFinances
                        .filter(f => f.loai_thu_chi === 'expense' || f.loai_thu_chi === 'chi')
                        .reduce((sum, f) => sum + f.tong_tien, 0);
                      
                      const runningBalance = runningIncomeTotal - runningExpenseTotal;
                      
                      return (
                        <tr key={finance.id} className="border-b">
                          <td className="py-2">
                            {finance.ngay ? format(new Date(finance.ngay), 'dd/MM/yyyy') : 'N/A'}
                          </td>
                          <td className="py-2">{finance.dien_giai || 'N/A'}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-md text-xs ${
                              (finance.loai_thu_chi === 'income' || finance.loai_thu_chi === 'thu') ? 
                              'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'}`}
                            >
                              {(finance.loai_thu_chi === 'income' || finance.loai_thu_chi === 'thu') ? 'Thu' : 'Chi'} - {finance.loai_giao_dich || 'N/A'}
                            </span>
                          </td>
                          <td className="text-right py-2">
                            {(finance.loai_thu_chi === 'income' || finance.loai_thu_chi === 'thu') ? formatCurrency(finance.tong_tien) : '-'}
                          </td>
                          <td className="text-right py-2">
                            {(finance.loai_thu_chi === 'expense' || finance.loai_thu_chi === 'chi') ? formatCurrency(finance.tong_tien) : '-'}
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
