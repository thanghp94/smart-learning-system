import React, { useState, useEffect } from 'react';
import { Finance } from '@/lib/types';
import { financeService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Edit, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DatePicker } from '@/components/ui/DatePicker';

const FinanceLedger: React.FC = () => {
  const [entries, setEntries] = useState<(Finance & { isEditing?: boolean })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [runningBalance, setRunningBalance] = useState<number>(0);

  useEffect(() => {
    loadFinances();
  }, []);

  const loadFinances = async () => {
    try {
      setIsLoading(true);
      const data = await financeService.getAll();
      
      const sortedData = data.sort((a, b) => {
        if (!a.ngay || !b.ngay) return 0;
        return new Date(b.ngay).getTime() - new Date(a.ngay).getTime();
      });

      const enhancedData = sortedData.map(entry => ({ 
        ...entry, 
        isEditing: false 
      }));

      setEntries(enhancedData);
      
      const balance = sortedData.reduce((acc, entry) => {
        if (entry.loai_thu_chi === 'income') {
          return acc + (entry.tong_tien || 0);
        } else {
          return acc - (entry.tong_tien || 0);
        }
      }, 0);
      
      setRunningBalance(balance);
    } catch (error) {
      console.error('Error loading finances:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu tài chính',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEdit = (id: string) => {
    setEntries(
      entries.map(entry => {
        if (entry.id === id) {
          return { ...entry, isEditing: !entry.isEditing };
        }
        return entry;
      })
    );
  };

  const handleChange = (id: string, field: keyof Finance, value: any) => {
    setEntries(
      entries.map(entry => {
        if (entry.id === id) {
          return { ...entry, [field]: value };
        }
        return entry;
      })
    );
  };

  const handleSave = async (id: string) => {
    try {
      const entry = entries.find(e => e.id === id);
      if (!entry) return;

      const { isEditing, ...dataToSave } = entry;
      
      await financeService.update(id, dataToSave);
      
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật thông tin',
      });
      
      toggleEdit(id);
      await loadFinances();
    } catch (error) {
      console.error('Error saving finance:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin',
        variant: 'destructive',
      });
    }
  };

  const handleDateChange = (id: string, date: Date | undefined) => {
    if (date) {
      handleChange(id, 'ngay', format(date, 'yyyy-MM-dd'));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getTransactionTypeLabel = (type: string) => {
    return type === 'income' ? 'Thu' : 'Chi';
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sổ Kế Toán - Đang tải...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sổ Kế Toán</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="text-lg font-semibold">
            Số dư hiện tại: 
            <span className={cn(
              "ml-2",
              runningBalance >= 0 ? "text-blue-600" : "text-red-600"
            )}>
              {formatCurrency(runningBalance)}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={loadFinances}>
            Làm mới
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Ngày</TableHead>
                <TableHead className="w-[100px]">Loại</TableHead>
                <TableHead className="w-[150px]">Hạng mục</TableHead>
                <TableHead className="min-w-[300px]">Diễn giải</TableHead>
                <TableHead className="w-[150px] text-right">Thu</TableHead>
                <TableHead className="w-[150px] text-right">Chi</TableHead>
                <TableHead className="w-[120px]">Tình trạng</TableHead>
                <TableHead className="w-[100px] text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {entry.isEditing ? (
                      <DatePicker
                        date={entry.ngay ? new Date(entry.ngay) : undefined}
                        setDate={(date) => handleDateChange(entry.id, date)}
                      />
                    ) : (
                      entry.ngay ? format(new Date(entry.ngay), 'dd/MM/yyyy') : ''
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {entry.isEditing ? (
                      <select
                        className="w-full p-2 border rounded"
                        value={entry.loai_thu_chi}
                        onChange={(e) => handleChange(entry.id, 'loai_thu_chi', e.target.value)}
                      >
                        <option value="income">Thu</option>
                        <option value="expense">Chi</option>
                      </select>
                    ) : (
                      <Badge variant={entry.loai_thu_chi === 'income' ? 'success' : 'destructive'}>
                        {getTransactionTypeLabel(entry.loai_thu_chi)}
                      </Badge>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {entry.isEditing ? (
                      <Input
                        value={entry.loai_giao_dich || ''}
                        onChange={(e) => handleChange(entry.id, 'loai_giao_dich', e.target.value)}
                      />
                    ) : (
                      entry.loai_giao_dich || ''
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className={cn(
                      entry.loai_thu_chi === 'income' ? 'text-blue-600' : 'text-red-600',
                      "font-medium"
                    )}>
                      {entry.isEditing ? (
                        <Input
                          value={entry.dien_giai || ''}
                          onChange={(e) => handleChange(entry.id, 'dien_giai', e.target.value)}
                        />
                      ) : (
                        entry.dien_giai || ''
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    {entry.isEditing ? (
                      entry.loai_thu_chi === 'income' && (
                        <Input
                          type="number"
                          value={entry.tong_tien || 0}
                          onChange={(e) => handleChange(entry.id, 'tong_tien', parseFloat(e.target.value))}
                          className="text-right"
                        />
                      )
                    ) : (
                      entry.loai_thu_chi === 'income' ? (
                        <span className="text-blue-600 font-medium">
                          {formatCurrency(entry.tong_tien || 0)}
                        </span>
                      ) : null
                    )}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    {entry.isEditing ? (
                      entry.loai_thu_chi === 'expense' && (
                        <Input
                          type="number"
                          value={entry.tong_tien || 0}
                          onChange={(e) => handleChange(entry.id, 'tong_tien', parseFloat(e.target.value))}
                          className="text-right"
                        />
                      )
                    ) : (
                      entry.loai_thu_chi === 'expense' ? (
                        <span className="text-red-600 font-medium">
                          {formatCurrency(entry.tong_tien || 0)}
                        </span>
                      ) : null
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {entry.isEditing ? (
                      <select
                        className="w-full p-2 border rounded"
                        value={entry.tinh_trang || 'pending'}
                        onChange={(e) => handleChange(entry.id, 'tinh_trang', e.target.value)}
                      >
                        <option value="pending">Chờ duyệt</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="rejected">Từ chối</option>
                      </select>
                    ) : (
                      <Badge variant={
                        entry.tinh_trang === 'completed' ? 'success' : 
                        entry.tinh_trang === 'pending' ? 'secondary' : 
                        'outline'
                      }>
                        {entry.tinh_trang === 'completed' ? 'Hoàn thành' : 
                        entry.tinh_trang === 'pending' ? 'Chờ xử lý' : 
                        entry.tinh_trang || 'N/A'}
                      </Badge>
                    )}
                  </TableCell>
                  
                  <TableCell className="text-center">
                    {entry.isEditing ? (
                      <div className="flex space-x-1 justify-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleSave(entry.id)}
                          className="h-8 w-8 text-green-600"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleEdit(entry.id)}
                          className="h-8 w-8 text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => toggleEdit(entry.id)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceLedger;
