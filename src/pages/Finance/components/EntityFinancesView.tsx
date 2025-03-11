
import React, { useState, useEffect } from 'react';
import { financeService } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { PlusCircle, ArrowUp, ArrowDown, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Finance } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FinanceForm from '../FinanceForm';
import { useToast } from '@/hooks/use-toast';
import { facilityService } from '@/lib/supabase';

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng thu</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalIncome)}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <ArrowUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng chi</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpense)}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <ArrowDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Còn lại</p>
                <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(stats.balance)}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Lịch sử tài chính</h3>
        <Button onClick={handleAddClick} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Thêm giao dịch
        </Button>
      </div>
      
      <div className="rounded-md border">
        {isLoading ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        ) : finances.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className="divide-y">
            {finances.map((finance) => (
              <div key={finance.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={finance.loai_thu_chi === 'income' ? 'success' : 'destructive'}>
                        {finance.loai_thu_chi === 'income' ? 'Thu' : 'Chi'}
                      </Badge>
                      <span className="font-medium">{finance.loai_giao_dich || 'Chưa phân loại'}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{finance.dien_giai}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${finance.loai_thu_chi === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(finance.tong_tien)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {finance.ngay ? format(new Date(finance.ngay), 'dd/MM/yyyy') : 'Không có ngày'}
                    </p>
                  </div>
                </div>
                {finance.ghi_chu && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">Ghi chú: {finance.ghi_chu}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
