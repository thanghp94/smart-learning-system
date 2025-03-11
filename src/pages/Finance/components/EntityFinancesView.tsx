
import React, { useState, useEffect } from 'react';
import { financeService, facilityService } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Finance } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FinanceForm from '../FinanceForm';
import { useToast } from '@/hooks/use-toast';
import FinanceStats from './FinanceStats';
import FinanceList from './FinanceList';

interface EntityFinancesViewProps {
  entityType: string;
  entityId: string;
}

const EntityFinancesView: React.FC<EntityFinancesViewProps> = ({ entityType, entityId }) => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchFinances();
    fetchFacilities();
  }, [entityId, entityType]);

  const fetchFinances = async () => {
    if (!entityId) return;
    
    try {
      setIsLoading(true);
      const data = await financeService.getByEntity(entityType, entityId);
      setFinances(data || []);
      
      // Calculate statistics
      if (data && data.length > 0) {
        const income = data
          .filter(item => item.loai_thu_chi === 'income')
          .reduce((sum, item) => sum + (item.tong_tien || 0), 0);
        
        const expense = data
          .filter(item => item.loai_thu_chi === 'expense')
          .reduce((sum, item) => sum + (item.tong_tien || 0), 0);
        
        setStats({
          totalIncome: income,
          totalExpense: expense,
          balance: income - expense
        });
      }
    } catch (error) {
      console.error('Error fetching finances:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu tài chính',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      const data = await facilityService.getAll();
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddFormCancel = () => {
    setShowAddForm(false);
  };

  const handleAddFormSubmit = async (formData: Partial<Finance>) => {
    try {
      // Add entity information to the finance data
      const financeData = {
        ...formData,
        loai_doi_tuong: entityType,
        doi_tuong_id: entityId
      };
      
      await financeService.create(financeData);
      
      toast({
        title: 'Thành công',
        description: 'Thêm giao dịch tài chính mới thành công',
      });
      
      setShowAddForm(false);
      await fetchFinances();
    } catch (error) {
      console.error('Error adding finance:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm giao dịch tài chính mới',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-4">
      <FinanceStats 
        totalIncome={stats.totalIncome}
        totalExpense={stats.totalExpense}
        balance={stats.balance}
      />
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Lịch sử tài chính</h3>
        <Button onClick={handleAddClick} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Thêm giao dịch
        </Button>
      </div>
      
      <div className="rounded-md border">
        <FinanceList 
          finances={finances}
          isLoading={isLoading}
        />
      </div>
      
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Giao Dịch Mới</DialogTitle>
          </DialogHeader>
          <FinanceForm 
            initialData={{
              loai_doi_tuong: entityType,
              doi_tuong_id: entityId,
            }}
            onSubmit={handleAddFormSubmit}
            onCancel={handleAddFormCancel}
            facilities={facilities}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EntityFinancesView;
