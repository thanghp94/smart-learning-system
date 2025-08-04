
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FinanceForm from './FinanceForm';
import EntityFinanceForm from './components/EntityFinanceForm';
import { financeService } from "@/lib/database";
import FinancePageContent from './components/FinancePageContent';

const Finance = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isNewFinanceRoute = location.pathname === '/finance/new';
  
  const handleFormSubmit = async (data) => {
    try {
      console.log('Finance form submission data:', data);
      
      // Validate required data before submitting
      if (!data.loai_thu_chi) {
        throw new Error('Loại thu chi là bắt buộc');
      }
      
      if (!data.dien_giai) {
        throw new Error('Diễn giải là bắt buộc');
      }
      
      // If nguoi_tao is empty string, set it to null to avoid UUID parsing error
      if (data.nguoi_tao === '') {
        data.nguoi_tao = null;
      }
      
      // Make sure co_so is a valid UUID
      if (data.co_so === '') {
        data.co_so = null;
      }
      
      const result = await financeService.create(data);
      console.log('Finance creation result:', result);
      
      toast({
        title: 'Thành công',
        description: 'Đã thêm khoản thu chi mới',
      });
      setShowAddForm(false);
      
      // If we came from entity page, navigate back
      if (isNewFinanceRoute) {
        navigate('/finance');
      }
    } catch (error) {
      console.error('Error saving finance:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu khoản thu chi: ' + (error.message || 'Lỗi không xác định'),
        variant: 'destructive',
      });
    }
  };
  
  const handleFormCancel = () => {
    setShowAddForm(false);
    if (isNewFinanceRoute) {
      navigate('/finance');
    }
  };
  
  // If we're on the new finance route, show the entity form instead of the regular page
  if (isNewFinanceRoute) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Thêm khoản thu chi mới</h1>
          <p className="text-muted-foreground">Tạo khoản thu chi mới cho đối tượng</p>
        </div>
        <EntityFinanceForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
      </div>
    );
  }
  
  return (
    <>
      <FinancePageContent onAddClick={() => setShowAddForm(true)} />
      
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Thêm khoản thu chi mới</DialogTitle>
          </DialogHeader>
          <FinanceForm onSubmit={handleFormSubmit} onCancel={() => setShowAddForm(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Finance;
