
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { financeService } from '@/lib/supabase';
import { Finance, Facility } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FinanceList from './FinanceList';
import FinanceStats from './FinanceStats';
import FinanceLedger from './FinanceLedger';
import FilterButton from '@/components/ui/FilterButton';
import ExportButton from '@/components/ui/ExportButton';

interface FinancePageContentProps {
  // We don't need these props as we'll manage them internally
}

const FinancePageContent: React.FC<FinancePageContentProps> = () => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState("list");
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchFinances();
  }, []);

  const fetchFinances = async () => {
    setIsLoading(true);
    try {
      const data = await financeService.getAll();
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

  const handleAddFinance = () => {
    navigate('/finance/add');
  };

  const handleDeleteFinance = (finance: Finance) => {
    setFinances(prev => prev.filter(f => f.id !== finance.id));
  };

  // Tính toán tổng thu, tổng chi và số dư
  const totalIncome = finances.filter(f => f.loai_thu_chi === 'income').reduce((sum, f) => sum + f.tong_tien, 0);
  const totalExpense = finances.filter(f => f.loai_thu_chi === 'expense').reduce((sum, f) => sum + f.tong_tien, 0);
  const balance = totalIncome - totalExpense;

  // Filter categories
  const filterCategories = [
    {
      name: 'Loại',
      type: 'other' as const,
      options: [
        { label: 'Thu', value: 'income', type: 'other' as const },
        { label: 'Chi', value: 'expense', type: 'other' as const }
      ]
    },
    {
      name: 'Đối tượng',
      type: 'other' as const,
      options: [
        { label: 'Học sinh', value: 'student', type: 'other' as const },
        { label: 'Nhân viên', value: 'employee', type: 'other' as const },
        { label: 'Cơ sở', value: 'facility', type: 'other' as const },
        { label: 'Khác', value: 'other', type: 'other' as const }
      ]
    }
  ];

  // Apply filters
  const filteredFinances = finances.filter(finance => {
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        if (key === 'Loại' && finance.loai_thu_chi !== value) return false;
        if (key === 'Đối tượng' && finance.loai_doi_tuong !== value) return false;
      }
    }
    return true;
  });

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <FilterButton
            categories={filterCategories}
            onFilter={setFilters}
          />
          <ExportButton
            data={filteredFinances}
            filename="Danh_sach_tai_chinh"
            label="Xuất dữ liệu"
          />
        </div>
        <Button onClick={handleAddFinance}>
          <Plus className="h-4 w-4 mr-1" /> Thêm giao dịch
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="list">Danh sách</TabsTrigger>
          <TabsTrigger value="stats">Thống kê</TabsTrigger>
          <TabsTrigger value="ledger">Sổ cái</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <FinanceList 
            finances={filteredFinances} 
            isLoading={isLoading}
            onDelete={handleDeleteFinance}
          />
        </TabsContent>
        
        <TabsContent value="stats">
          <FinanceStats 
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            balance={balance}
          />
        </TabsContent>
        
        <TabsContent value="ledger">
          <FinanceLedger 
            finances={filteredFinances} 
            isLoading={isLoading} 
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default FinancePageContent;
