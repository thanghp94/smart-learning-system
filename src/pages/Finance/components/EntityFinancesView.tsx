
import React, { useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Finance } from '@/lib/types';
import { financeService } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import DataTable from '@/components/ui/DataTable';
import { useToast } from '@/hooks/use-toast';

interface EntityFinancesViewProps {
  entityId: string;
  entityType: 'student' | 'employee' | 'contact';
  title?: string;
}

const EntityFinancesView: React.FC<EntityFinancesViewProps> = ({ 
  entityId, 
  entityType,
  title = "Thông tin tài chính"
}) => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        setLoading(true);
        let data: Finance[] = [];
        
        switch (entityType) {
          case 'student':
            data = await financeService.getByStudent(entityId);
            break;
          case 'employee':
            data = await financeService.getByEmployee(entityId);
            break;
          case 'contact':
            data = await financeService.getByContact(entityId);
            break;
        }
        
        setFinances(data);
      } catch (error) {
        console.error(`Error fetching finances for ${entityType}:`, error);
        toast({
          title: 'Lỗi',
          description: `Không thể tải dữ liệu tài chính`,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (entityId) {
      fetchFinances();
    }
  }, [entityId, entityType, toast]);

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const columns = [
    {
      title: "Loại",
      key: "loai_thu_chi",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "income" ? "success" : "destructive"}>
          {value === "income" ? "Thu" : "Chi"}
        </Badge>
      ),
    },
    {
      title: "Diễn giải",
      key: "dien_giai",
      sortable: true,
    },
    {
      title: "Ngày",
      key: "ngay",
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      title: "Số tiền",
      key: "tong_tien",
      sortable: true,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Trạng thái",
      key: "tinh_trang",
      sortable: true,
      render: (value: string) => (
        <Badge variant={
          value === "completed" ? "success" : 
          value === "rejected" ? "destructive" : 
          value === "pending" ? "warning" : 
          "secondary"
        }>
          {value === "completed" ? "Hoàn thành" : 
          value === "rejected" ? "Từ chối" : 
          value === "pending" ? "Chờ duyệt" : value}
        </Badge>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button variant="outline" size="sm">
          <DollarSign className="h-4 w-4 mr-1" />
          Thêm giao dịch
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Đang tải dữ liệu...</div>
        ) : finances.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có dữ liệu tài chính
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={finances}
            searchable={true}
            searchPlaceholder="Tìm kiếm giao dịch..."
          />
        )}
      </CardContent>
    </Card>
  );
};

export default EntityFinancesView;
