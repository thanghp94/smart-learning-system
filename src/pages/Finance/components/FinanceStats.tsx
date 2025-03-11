
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Coins } from 'lucide-react';

export interface FinanceStatsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const FinanceStats: React.FC<FinanceStatsProps> = ({ totalIncome, totalExpense, balance }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="p-2 bg-green-100 rounded-full">
            <ArrowUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tổng thu</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="p-2 bg-red-100 rounded-full">
            <ArrowDown className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tổng chi</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className={`p-2 ${balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'} rounded-full`}>
            <Coins className={`h-5 w-5 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Số dư</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceStats;
