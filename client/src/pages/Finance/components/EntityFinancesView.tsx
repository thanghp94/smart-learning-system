
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DataTable from '@/components/ui/DataTable';
import { financeService } from "@/lib/database";
import { Finance } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FinanceForm from '../FinanceForm';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface EntityFinancesViewProps {
  entityType: string;
  entityId?: string;
  entityName?: string;
  showAddButton?: boolean;
}

const EntityFinancesView: React.FC<EntityFinancesViewProps> = ({
  entityType,
  entityId,
  entityName,
  showAddButton = true,
}) => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const params = useParams();
  const { toast } = useToast();

  // If entityId is not provided, try to get it from URL parameters
  const effectiveEntityId = entityId || params.id;

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        setIsLoading(true);
        let data: Finance[] = [];
        
        if (effectiveEntityId) {
          data = await financeService.getByEntity(entityType, effectiveEntityId);
        } else {
          data = await financeService.getAll();
        }
        
        setFinances(data);
      } catch (error) {
        console.error('Error fetching finances:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu tài chính',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinances();
  }, [entityType, effectiveEntityId, toast]);

  const handleAddFinance = () => {
    setShowAddForm(true);
  };

  const handleFormSubmit = async (formData: any) => {
    setShowAddForm(false);
    // Refresh the finances list after adding a new one
    if (effectiveEntityId) {
      const data = await financeService.getByEntity(entityType, effectiveEntityId);
      setFinances(data);
    } else {
      const data = await financeService.getAll();
      setFinances(data);
    }
  };

  const columns = [
    {
      title: 'Ngày',
      key: 'ngay',
      render: (value: string) => (value ? format(new Date(value), 'dd/MM/yyyy') : ''),
    },
    {
      title: 'Loại',
      key: 'loai_thu_chi',
      render: (value: string) => (
        <Badge variant={value === 'thu' ? 'default' : 'destructive'}>
          {value === 'thu' ? 'Thu' : 'Chi'}
        </Badge>
      ),
    },
    {
      title: 'Diễn giải',
      key: 'dien_giai',
    },
    {
      title: 'Số tiền',
      key: 'tong_tien',
      render: (value: number) => new Intl.NumberFormat('vi-VN').format(value),
    },
    {
      title: 'Trạng thái',
      key: 'tinh_trang',
      render: (value: string) => (
        <Badge
          variant={
            value === 'completed'
              ? 'success'
              : value === 'pending'
              ? 'outline'
              : 'secondary'
          }
        >
          {value === 'completed'
            ? 'Hoàn thành'
            : value === 'pending'
            ? 'Chờ xử lý'
            : value}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {showAddButton && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            Thông tin tài chính {entityName ? `của ${entityName}` : ''}
          </h3>
          <Button size="sm" onClick={handleAddFinance}>
            <Plus className="mr-2 h-4 w-4" /> Thêm khoản thu chi
          </Button>
        </div>
      )}

      <Card>
        <DataTable
          columns={columns}
          data={finances}
          isLoading={isLoading}
          emptyMessage="Không có dữ liệu tài chính"
          searchable={true}
          searchPlaceholder="Tìm kiếm khoản thu chi..."
        />
      </Card>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Thêm khoản thu chi</DialogTitle>
          </DialogHeader>
          <FinanceForm 
            entityType={entityType} 
            entityId={effectiveEntityId} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setShowAddForm(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EntityFinancesView;
