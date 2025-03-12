
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { supabase } from '@/lib/supabase/client';
import { Separator } from '@/components/ui/separator';
import { FileText, Plus, Download, Trash, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EmployeeContractTabProps {
  employeeId: string;
}

const EmployeeContractTab: React.FC<EmployeeContractTabProps> = ({ employeeId }) => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (employeeId) {
      fetchContracts();
    }
  }, [employeeId]);

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('employee_contracts')
        .select('*')
        .eq('nhan_vien_id', employeeId)
        .order('ngay_ky', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách hợp đồng',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <CardTitle className="text-xl font-bold">Hợp đồng</CardTitle>
        <Button onClick={() => setShowContractForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm hợp đồng
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Đang tải dữ liệu...</div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Không có hợp đồng nào
          </div>
        ) : (
          <div className="space-y-6">
            {contracts.map((contract) => (
              <div key={contract.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg">{contract.ten_hop_dong}</h3>
                    <p className="text-sm text-muted-foreground">Loại hợp đồng: {contract.loai_hop_dong || 'Không xác định'}</p>
                  </div>
                  <div className="flex space-x-2">
                    {contract.file_hop_dong && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={contract.file_hop_dong} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-1" />
                          Tải xuống
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày ký</p>
                    <p>{formatDate(contract.ngay_ky)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Thời hạn</p>
                    <p>{formatDate(contract.ngay_bat_dau)} - {formatDate(contract.ngay_ket_thuc)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lương cơ bản</p>
                    <p>{formatCurrency(contract.luong_co_ban)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trạng thái</p>
                    <p>{contract.trang_thai || 'Không xác định'}</p>
                  </div>
                </div>
                
                {contract.ghi_chu && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Ghi chú</p>
                    <p className="text-sm">{contract.ghi_chu}</p>
                  </div>
                )}
                
                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash className="h-4 w-4 mr-1" />
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Contract form dialog */}
        <Dialog open={showContractForm} onOpenChange={setShowContractForm}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Thêm hợp đồng mới</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-center text-muted-foreground">Tính năng đang được phát triển</p>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EmployeeContractTab;
