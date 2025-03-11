import React, { useState, useEffect } from 'react';
import { financeService } from '@/lib/supabase';
import { Finance } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import FinanceList from './FinanceList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EntityFinancesViewProps {
  entityType: string;
  entityId: string;
}

const EntityFinancesView: React.FC<EntityFinancesViewProps> = ({ entityType, entityId }) => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchFinances();
  }, [entityType, entityId]);

  const fetchFinances = async () => {
    setIsLoading(true);
    try {
      let data: Finance[] = [];
      
      if (entityId && entityType) {
        data = await financeService.getByEntity(entityType, entityId);
      } else if (entityType) {
        data = await financeService.getByEntityType(entityType);
      } else {
        data = await financeService.getAll();
      }
      
      setFinances(data);
    } catch (error) {
      console.error('Error fetching finances:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu tài chính. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFinance = (finance: Finance) => {
    setFinances(prev => prev.filter(f => f.id !== finance.id));
  };

  // Calculate financial summary
  const incomeTotal = finances
    .filter(finance => finance.loai_thu_chi === 'income')
    .reduce((sum, finance) => sum + finance.tong_tien, 0);
  
  const expenseTotal = finances
    .filter(finance => finance.loai_thu_chi === 'expense')
    .reduce((sum, finance) => sum + finance.tong_tien, 0);
  
  const balance = incomeTotal - expenseTotal;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tổng thu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(incomeTotal)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tổng chi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(expenseTotal)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Số dư</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao dịch</CardTitle>
          <CardDescription>
            {entityType === 'hoc_sinh' ? 'Giao dịch tài chính của học sinh' : 
             entityType === 'nhan_vien' ? 'Giao dịch tài chính của nhân viên' :
             entityType === 'co_so' ? 'Giao dịch tài chính của cơ sở' :
             'Tất cả giao dịch tài chính'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FinanceList 
            finances={finances} 
            isLoading={isLoading} 
            onDelete={handleDeleteFinance}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EntityFinancesView;
