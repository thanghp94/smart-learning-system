
import React, { useState, useEffect } from 'react';
import { financeService } from '@/lib/supabase';
import { Finance } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinanceList from './FinanceList';
import FinanceStats from './FinanceStats';
import { useToast } from '@/hooks/use-toast';
import FinanceLedger from './FinanceLedger';

interface EntityFinancesViewProps {
  entityType: string;
  entityId: string;
  entityName?: string;
}

const EntityFinancesView: React.FC<EntityFinancesViewProps> = ({
  entityType,
  entityId,
  entityName,
}) => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    const fetchFinances = async () => {
      setIsLoading(true);
      try {
        let data: Finance[] = [];
        
        if (entityType && entityId) {
          // Use the appropriate method from FinanceService
          data = await financeService.getByEntity(entityType, entityId);
        } else {
          // If no entity is specified, fetch all finances
          data = await financeService.getAll();
        }
        
        setFinances(data || []);
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

    fetchFinances();
  }, [entityType, entityId, toast]);

  // Tính toán các tổng số
  const totalIncome = finances
    .filter(finance => finance.loai_thu_chi === 'income')
    .reduce((sum, finance) => sum + finance.tong_tien, 0);

  const totalExpense = finances
    .filter(finance => finance.loai_thu_chi === 'expense')
    .reduce((sum, finance) => sum + finance.tong_tien, 0);

  const balance = totalIncome - totalExpense;

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 md:p-6">
        {entityName && (
          <h3 className="text-lg font-semibold mb-4">
            {entityType === 'student' 
              ? `Tài Chính Học Sinh: ${entityName}` 
              : entityType === 'employee' 
                ? `Tài Chính Nhân Viên: ${entityName}`
                : entityType === 'facility' 
                  ? `Tài Chính Cơ Sở: ${entityName}`
                  : 'Tài Chính'}
          </h3>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="list">Danh sách</TabsTrigger>
            <TabsTrigger value="stats">Thống kê</TabsTrigger>
            <TabsTrigger value="ledger">Sổ cái</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-0">
            <FinanceList 
              finances={finances} 
              isLoading={isLoading} 
              onDelete={(finance) => {
                setFinances(prevFinances => 
                  prevFinances.filter(f => f.id !== finance.id)
                );
              }}
            />
          </TabsContent>
          
          <TabsContent value="stats" className="mt-0">
            <FinanceStats 
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              balance={balance}
            />
          </TabsContent>
          
          <TabsContent value="ledger" className="mt-0">
            <FinanceLedger finances={finances} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EntityFinancesView;
