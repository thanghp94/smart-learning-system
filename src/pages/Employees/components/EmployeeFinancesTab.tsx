
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Plus, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EmployeeFinancesTabProps {
  employeeId: string;
}

const EmployeeFinancesTab: React.FC<EmployeeFinancesTabProps> = ({ employeeId }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (employeeId) {
      fetchTransactions();
    }
  }, [employeeId]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('finance_transactions')
        .select(`
          id, 
          so_tien, 
          loai_giao_dich, 
          dien_giai, 
          ngay_giao_dich, 
          phuong_thuc_thanh_toan,
          hinh_thuc,
          finance_transaction_types(name)
        `)
        .eq('doi_tuong', 'nhan_vien')
        .eq('doi_tuong_id', employeeId)
        .order('ngay_giao_dich', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu tài chính',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total income and expenses
  const totalIncome = transactions
    .filter(t => t.hinh_thuc === 'thu')
    .reduce((sum, t) => sum + Number(t.so_tien), 0);
    
  const totalExpense = transactions
    .filter(t => t.hinh_thuc === 'chi')
    .reduce((sum, t) => sum + Number(t.so_tien), 0);

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount?: number | string) => {
    if (!amount) return 'N/A';
    try {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount));
    } catch (error) {
      return String(amount);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Tài chính</CardTitle>
        <Button onClick={() => setShowAddTransactionForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm giao dịch
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Tổng thu</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Tổng chi</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Số dư</p>
                <p className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalIncome - totalExpense)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="income">Thu</TabsTrigger>
            <TabsTrigger value="expense">Chi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {renderTransactionList(transactions)}
          </TabsContent>
          
          <TabsContent value="income">
            {renderTransactionList(transactions.filter(t => t.hinh_thuc === 'thu'))}
          </TabsContent>
          
          <TabsContent value="expense">
            {renderTransactionList(transactions.filter(t => t.hinh_thuc === 'chi'))}
          </TabsContent>
        </Tabs>
        
        {/* Transaction form dialog */}
        <Dialog open={showAddTransactionForm} onOpenChange={setShowAddTransactionForm}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Thêm giao dịch mới</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-center text-muted-foreground">Tính năng đang được phát triển</p>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
  
  function renderTransactionList(transactions: any[]) {
    if (isLoading) {
      return <div className="text-center py-4">Đang tải dữ liệu...</div>;
    }
    
    if (transactions.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          Không có giao dịch nào
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center p-3 border rounded-lg hover:bg-muted/50">
            <div className={`p-2 rounded-full mr-4 ${transaction.hinh_thuc === 'thu' ? 'bg-green-100' : 'bg-red-100'}`}>
              {transaction.hinh_thuc === 'thu' ? (
                <ArrowDownCircle className="h-6 w-6 text-green-600" />
              ) : (
                <ArrowUpCircle className="h-6 w-6 text-red-600" />
              )}
            </div>
            
            <div className="flex-grow">
              <p className="font-medium">{transaction.dien_giai}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{formatDate(transaction.ngay_giao_dich)}</span>
                <span className="mx-2">•</span>
                <span>{transaction.finance_transaction_types?.name || 'Không phân loại'}</span>
                <span className="mx-2">•</span>
                <span>{transaction.phuong_thuc_thanh_toan || 'Không xác định'}</span>
              </div>
            </div>
            
            <div className={`font-bold ${transaction.hinh_thuc === 'thu' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.hinh_thuc === 'thu' ? '+' : '-'} {formatCurrency(transaction.so_tien)}
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default EmployeeFinancesTab;
