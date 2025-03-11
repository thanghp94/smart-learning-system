
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

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
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Tổng thu</h3>
          <p className="text-xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Tổng chi</h3>
          <p className="text-xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Cân đối</h3>
          <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceStats;
