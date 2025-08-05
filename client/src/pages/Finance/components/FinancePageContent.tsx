
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { financeService } from "@/lib/database";
import { Finance } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FinanceList from './FinanceList';
import FinanceStats from './FinanceStats';
import FinanceLedger from './FinanceLedger';
import ExportButton from '@/components/ui/ExportButton';

interface FinancePageContentProps {
  onAddClick: () => void;
}

const FinancePageContent: React.FC<FinancePageContentProps> = ({ onAddClick }) => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState("list");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filterMode, setFilterMode] = useState<'type' | 'entity'>('type');

  useEffect(() => {
    fetchFinances();
  }, []);

  const fetchFinances = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching all records from finances...');
      const data = await financeService.getFinances();
      console.log('Successfully fetched', data.length, 'records from finances');
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

  // Calculate total income, expense and balance
  const totalIncome = finances
    .filter(f => f.loai_thu_chi === 'income' || f.loai_thu_chi === 'thu')
    .reduce((sum, f) => sum + f.tong_tien, 0);
    
  const totalExpense = finances
    .filter(f => f.loai_thu_chi === 'expense' || f.loai_thu_chi === 'chi')
    .reduce((sum, f) => sum + f.tong_tien, 0);
    
  const balance = totalIncome - totalExpense;

  // Apply filters
  const filteredFinances = finances.filter(finance => {
    if (filterMode === 'type') {
      if (filters.loai_thu_chi && 
          !(finance.loai_thu_chi === filters.loai_thu_chi || 
           (filters.loai_thu_chi === 'income' && finance.loai_thu_chi === 'thu') ||
           (filters.loai_thu_chi === 'expense' && finance.loai_thu_chi === 'chi'))) {
        return false;
      }
    } else if (filterMode === 'entity') {
      if (filters.loai_doi_tuong && finance.loai_doi_tuong !== filters.loai_doi_tuong) {
        return false;
      }
    }
    return true;
  });

  const handleFilterModeChange = (value: string) => {
    setFilterMode(value as 'type' | 'entity');
    setFilters({});
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Tabs 
            defaultValue="type" 
            value={filterMode}
            onValueChange={handleFilterModeChange}
            className="mr-4"
          >
            <TabsList>
              <TabsTrigger value="type">Theo loại</TabsTrigger>
              <TabsTrigger value="entity">Theo đối tượng</TabsTrigger>
            </TabsList>
          </Tabs>

          {filterMode === 'type' ? (
            <select 
              className="bg-background border border-input rounded-md px-3 py-2 text-sm"
              value={filters.loai_thu_chi || ''}
              onChange={(e) => setFilters({ loai_thu_chi: e.target.value })}
            >
              <option value="">Tất cả loại</option>
              <option value="income">Thu</option>
              <option value="expense">Chi</option>
            </select>
          ) : (
            <select 
              className="bg-background border border-input rounded-md px-3 py-2 text-sm"
              value={filters.loai_doi_tuong || ''}
              onChange={(e) => setFilters({ loai_doi_tuong: e.target.value })}
            >
              <option value="">Tất cả đối tượng</option>
              <option value="hoc_sinh">Học sinh</option>
              <option value="nhan_vien">Nhân viên</option>
              <option value="co_so">Cơ sở</option>
              <option value="other">Khác</option>
            </select>
          )}

          <ExportButton
            data={filteredFinances}
            filename="Danh_sach_tai_chinh"
            label="Xuất dữ liệu"
          />
        </div>
        <Button onClick={onAddClick}>
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
            onDelete={(finance) => {
              setFinances(prev => prev.filter(f => f.id !== finance.id));
              // Refresh data to ensure consistency
              fetchFinances();
            }}
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
