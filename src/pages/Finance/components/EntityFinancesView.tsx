
import React, { useState, useEffect } from 'react';
import { Finance } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { financeService } from '@/lib/supabase';
import { formatDate, formatCurrency, formatStatus } from '@/utils/format';

interface EntityFinancesViewProps {
  entityType: string;
  entityId: string;
  onAddClick?: () => void;
}

const EntityFinancesView: React.FC<EntityFinancesViewProps> = ({
  entityType,
  entityId,
  onAddClick
}) => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    pending: 0
  });

  useEffect(() => {
    const loadFinances = async () => {
      try {
        setLoading(true);
        const data = await financeService.getByEntity(entityType, entityId);
        setFinances(data || []);
        
        // Calculate summary
        const income = data
          .filter(item => item.loai_thu_chi === 'thu' && item.tinh_trang === 'completed')
          .reduce((sum, item) => sum + (item.tong_tien || 0), 0);
        
        const expense = data
          .filter(item => item.loai_thu_chi === 'chi' && item.tinh_trang === 'completed')
          .reduce((sum, item) => sum + (item.tong_tien || 0), 0);
        
        const pending = data
          .filter(item => item.tinh_trang === 'pending')
          .reduce((sum, item) => sum + (item.tong_tien || 0), 0);
        
        setSummary({
          income,
          expense,
          balance: income - expense,
          pending
        });
      } catch (error) {
        console.error('Error loading finances:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (entityId) {
      loadFinances();
    }
  }, [entityType, entityId]);

  if (loading) {
    return <div className="py-10 text-center">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.income)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng chi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.expense)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Còn lại</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(summary.balance)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chờ xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatCurrency(summary.pending)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Danh sách giao dịch</h3>
        {onAddClick && (
          <Button onClick={onAddClick} size="sm">Thêm giao dịch</Button>
        )}
      </div>
      
      {finances.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          Không có giao dịch tài chính nào.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {finances.map(finance => (
              <TableRow key={finance.id}>
                <TableCell>{formatDate(finance.ngay)}</TableCell>
                <TableCell>
                  <Badge variant={finance.loai_thu_chi === 'thu' ? 'default' : 'destructive'}>
                    {finance.loai_thu_chi === 'thu' ? 'Thu' : 'Chi'}
                  </Badge>
                </TableCell>
                <TableCell>{finance.ten_phi || finance.dien_giai || 'N/A'}</TableCell>
                <TableCell className={finance.loai_thu_chi === 'thu' ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(finance.tong_tien)}
                </TableCell>
                <TableCell>
                  <Badge variant={finance.tinh_trang === 'completed' ? 'outline' : 'secondary'}>
                    {formatStatus(finance.tinh_trang)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default EntityFinancesView;
