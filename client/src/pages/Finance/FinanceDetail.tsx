
import React, { useState } from 'react';
import { Finance } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import ReceiptGenerator from './components/ReceiptGenerator';

interface FinanceDetailProps {
  finance: Finance;
}

const FinanceDetail: React.FC<FinanceDetailProps> = ({ finance }) => {
  const [showReceiptGenerator, setShowReceiptGenerator] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {finance.loai_thu_chi === 'income' ? 'Phiếu Thu' : 'Phiếu Chi'} - {finance.ten_phi}
        </h3>
        <Badge
          variant={
            finance.tinh_trang === "completed" ? "success" : 
            finance.tinh_trang === "pending" ? "secondary" : 
            "outline"
          }
        >
          {finance.tinh_trang === "completed" ? "Hoàn thành" : 
           finance.tinh_trang === "pending" ? "Chờ xử lý" : 
           finance.tinh_trang || "N/A"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Ngày</p>
          <p>{finance.ngay ? format(new Date(finance.ngay), 'dd/MM/yyyy') : 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Loại Thu Chi</p>
          <Badge variant={finance.loai_thu_chi === "income" ? "success" : "destructive"}>
            {finance.loai_thu_chi === "income" ? "Thu" : "Chi"}
          </Badge>
        </div>
        <div>
          <p className="text-sm text-gray-500">Hạng Mục</p>
          <p>{finance.loai_giao_dich || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Kiểu Thanh Toán</p>
          <p>
            {finance.kieu_thanh_toan === 'cash' ? 'Tiền mặt' : 
             finance.kieu_thanh_toan === 'bank_transfer' ? 'Chuyển khoản' : 
             finance.kieu_thanh_toan === 'credit_card' ? 'Thẻ tín dụng' : 
             finance.kieu_thanh_toan || 'N/A'}
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h4 className="font-medium">Diễn Giải</h4>
        <p>{finance.dien_giai || 'Không có diễn giải'}</p>
      </div>

      {(finance.so_luong !== undefined || finance.don_vi !== undefined || finance.gia_tien !== undefined) && (
        <>
          <Separator />
          <div className="space-y-4">
            <h4 className="font-medium">Chi Tiết Thanh Toán</h4>
            <div className="grid grid-cols-3 gap-4">
              {finance.so_luong !== undefined && (
                <div>
                  <p className="text-sm text-gray-500">Số Lượng</p>
                  <p>{finance.so_luong}</p>
                </div>
              )}
              {finance.don_vi !== undefined && (
                <div>
                  <p className="text-sm text-gray-500">Đơn Vị</p>
                  <p>{finance.don_vi}</p>
                </div>
              )}
              {finance.gia_tien !== undefined && (
                <div>
                  <p className="text-sm text-gray-500">Giá Tiền</p>
                  <p>{formatCurrency(finance.gia_tien)}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <Separator />

      <div className="flex justify-between items-center">
        <h4 className="font-medium">Tổng Tiền</h4>
        <p className="text-xl font-bold">
          {formatCurrency(finance.tong_tien)}
        </p>
      </div>

      {finance.bang_chu && (
        <div className="italic text-gray-600">
          Bằng chữ: {finance.bang_chu}
        </div>
      )}

      {finance.ghi_chu && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium">Ghi Chú</h4>
            <p>{finance.ghi_chu}</p>
          </div>
        </>
      )}

      <div className="flex justify-end pt-4">
        <Button 
          onClick={() => setShowReceiptGenerator(true)}
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          Tạo Biên Lai
        </Button>
      </div>

      <Sheet open={showReceiptGenerator} onOpenChange={setShowReceiptGenerator}>
        <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Biên Lai Giao Dịch</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <ReceiptGenerator finance={finance} onClose={() => setShowReceiptGenerator(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FinanceDetail;
