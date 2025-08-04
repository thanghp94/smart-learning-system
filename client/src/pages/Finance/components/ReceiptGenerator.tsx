
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Finance } from '@/lib/types';
import { financeService } from "@/lib/database";
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Printer, FileDown, Check } from 'lucide-react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ReceiptGeneratorProps {
  onGenerateReceipt?: () => Promise<void>;
  isGenerating?: boolean;
  finance?: Finance;
  onClose?: () => void;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ 
  onGenerateReceipt, 
  isGenerating,
  finance,
  onClose 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [receiptGenerated, setReceiptGenerated] = useState(false);
  const { toast } = useToast();

  const handleGenerateReceipt = async () => {
    if (onGenerateReceipt) {
      await onGenerateReceipt();
      setReceiptGenerated(true);
    } else {
      setIsLoading(true);
      // Default receipt generation logic if no handler provided
      setTimeout(() => {
        setIsLoading(false);
        setReceiptGenerated(true);
        toast({
          title: "Thành công",
          description: "Đã tạo biên lai thành công",
        });
      }, 1000);
    }
  };

  const exportToPdf = () => {
    if (!finance) return;
    
    try {
      // Create a new PDF document with landscape orientation
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Company information
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('CÔNG TY TNHH GIÁO DỤC', 150, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Địa chỉ: 123 Đường Nguyễn Huệ, Quận 1, TP.HCM', 150, 28, { align: 'center' });
      doc.text('SĐT: 028 1234 5678 - Email: info@company.edu.vn', 150, 34, { align: 'center' });
      
      // Receipt header
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      const title = finance.loai_thu_chi === 'income' ? 'PHIẾU THU' : 'PHIẾU CHI';
      doc.text(title, 150, 45, { align: 'center' });
      
      // Receipt ID and date
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Số phiếu: ${finance.id?.substring(0, 8) || ''}`, 20, 55);
      doc.text(`Ngày: ${finance.ngay ? format(new Date(finance.ngay), 'dd/MM/yyyy') : ''}`, 260, 55, { align: 'right' });
      
      // Line
      doc.setLineWidth(0.5);
      doc.line(20, 60, 277, 60);
      
      // Transaction details
      doc.setFontSize(12);
      doc.text('THÔNG TIN GIAO DỊCH', 20, 70);
      
      // Content
      doc.setFontSize(11);
      const formattedAmount = new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
      }).format(finance.tong_tien);
      
      // Use a table layout for better organization
      const tableData = [
        ['Loại giao dịch:', finance.loai_giao_dich || ''],
        ['Diễn giải:', finance.dien_giai || ''],
        ['Số tiền:', formattedAmount],
        ['Bằng chữ:', finance.bang_chu || ''],
        ['Kiểu thanh toán:', finance.kieu_thanh_toan === 'cash' ? 'Tiền mặt' : 
                          finance.kieu_thanh_toan === 'bank_transfer' ? 'Chuyển khoản' : 
                          finance.kieu_thanh_toan === 'credit_card' ? 'Thẻ tín dụng' : 
                          finance.kieu_thanh_toan || ''],
      ];
      
      // @ts-ignore - jsPDF-autoTable is typed incorrectly
      doc.autoTable({
        startY: 75,
        head: [],
        body: tableData,
        theme: 'plain',
        styles: { fontSize: 11, cellPadding: 5 },
        columnStyles: { 0: { cellWidth: 40 } }
      });
      
      // Signature section
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      
      doc.text('Người nhận tiền', 60, finalY + 30, { align: 'center' });
      doc.text('(Ký, họ tên)', 60, finalY + 36, { align: 'center' });
      
      doc.text('Người lập phiếu', 150, finalY + 30, { align: 'center' });
      doc.text('(Ký, họ tên)', 150, finalY + 36, { align: 'center' });
      
      doc.text('Thủ quỹ', 240, finalY + 30, { align: 'center' });
      doc.text('(Ký, họ tên)', 240, finalY + 36, { align: 'center' });
      
      // Footer
      doc.setFontSize(9);
      doc.text('© Công ty TNHH Giáo dục - Phần mềm quản lý', 150, 200, { align: 'center' });
      
      // Save the PDF
      doc.save(`Bien_lai_${finance.loai_thu_chi === 'income' ? 'Thu' : 'Chi'}_${new Date().getTime()}.pdf`);
      
      toast({
        title: "Thành công",
        description: "Đã xuất biên lai PDF thành công",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xuất biên lai PDF. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {finance && (
        <div className="mb-6">
          {receiptGenerated ? (
            <Card className="p-6 bg-white border shadow">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-1">CÔNG TY TNHH GIÁO DỤC</h2>
                <p className="text-sm text-muted-foreground mb-0">123 Đường Nguyễn Huệ, Quận 1, TP.HCM</p>
                <p className="text-sm text-muted-foreground">SĐT: 028 1234 5678 - Email: info@company.edu.vn</p>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold uppercase">
                  {finance.loai_thu_chi === 'income' ? 'PHIẾU THU' : 'PHIẾU CHI'}
                </h3>
                <div className="flex justify-between text-sm mt-2">
                  <p className="mb-0">Số phiếu: {finance.id?.substring(0, 8) || ''}</p>
                  <p className="mb-0">Ngày: {finance.ngay ? format(new Date(finance.ngay), 'dd/MM/yyyy') : ''}</p>
                </div>
              </div>
              
              <div className="border-t border-b py-4 mb-4">
                <h4 className="font-semibold mb-2">THÔNG TIN GIAO DỊCH</h4>
                
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Loại giao dịch:</span>
                  </div>
                  <div className="text-sm">
                    {finance.loai_giao_dich || 'N/A'}
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Diễn giải:</span>
                  </div>
                  <div className="text-sm">
                    {finance.dien_giai || 'N/A'}
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Số tiền:</span>
                  </div>
                  <div className="text-sm font-semibold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finance.tong_tien)}
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Bằng chữ:</span>
                  </div>
                  <div className="text-sm italic">
                    {finance.bang_chu || 'N/A'}
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Kiểu thanh toán:</span>
                  </div>
                  <div className="text-sm">
                    {finance.kieu_thanh_toan === 'cash' ? 'Tiền mặt' : 
                     finance.kieu_thanh_toan === 'bank_transfer' ? 'Chuyển khoản' : 
                     finance.kieu_thanh_toan === 'credit_card' ? 'Thẻ tín dụng' : 
                     finance.kieu_thanh_toan || 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-8 text-center">
                <div>
                  <p className="font-semibold">Người nhận tiền</p>
                  <p className="text-xs text-muted-foreground">(Ký, họ tên)</p>
                  <div className="h-16"></div>
                </div>
                
                <div>
                  <p className="font-semibold">Người lập phiếu</p>
                  <p className="text-xs text-muted-foreground">(Ký, họ tên)</p>
                  <div className="h-16"></div>
                </div>
                
                <div>
                  <p className="font-semibold">Thủ quỹ</p>
                  <p className="text-xs text-muted-foreground">(Ký, họ tên)</p>
                  <div className="h-16"></div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center space-x-3">
                <Button variant="outline" className="gap-2" onClick={exportToPdf}>
                  <Printer className="h-4 w-4" />
                  In biên lai
                </Button>
                <Button variant="outline" className="gap-2" onClick={exportToPdf}>
                  <FileDown className="h-4 w-4" />
                  Tải xuống PDF
                </Button>
                <Button className="gap-2" onClick={onClose}>
                  <Check className="h-4 w-4" />
                  Hoàn thành
                </Button>
              </div>
            </Card>
          ) : (
            <div className="p-4 border rounded-md bg-muted/50">
              <h3 className="font-medium mb-2">Thông tin biên nhận</h3>
              <p className="text-sm">
                <span className="font-medium">Loại giao dịch:</span> {finance.loai_thu_chi === 'income' ? 'Thu' : 'Chi'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Số tiền:</span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finance.tong_tien)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Ngày:</span> {finance.ngay ? new Date(finance.ngay).toLocaleDateString('vi-VN') : 'N/A'}
              </p>
            </div>
          )}
        </div>
      )}

      {!receiptGenerated && (
        <div className="flex justify-end space-x-2">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
          )}
          <Button onClick={handleGenerateReceipt} disabled={isLoading || isGenerating}>
            {isLoading || isGenerating ? (
              <Badge variant="secondary">Đang tạo biên nhận...</Badge>
            ) : (
              'Tạo biên nhận'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReceiptGenerator;
