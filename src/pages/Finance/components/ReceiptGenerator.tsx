import React, { useState, useEffect, useRef } from 'react';
import { Finance } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { financeService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Printer, Save, FileCheck, ExternalLink } from 'lucide-react';

interface ReceiptGeneratorProps {
  finance: Finance;
  onClose: () => void;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ finance, onClose }) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [generatedReceipt, setGeneratedReceipt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const type = finance.loai_thu_chi as 'income' | 'expense';
        const templateList = await financeService.getReceiptTemplates(type);
        setTemplates(templateList || []);
        
        if (templateList && templateList.length > 0) {
          const defaultTemplate = templateList.find(t => t.is_default) || templateList[0];
          setSelectedTemplateId(defaultTemplate.id);
        }
      } catch (error) {
        console.error('Error fetching receipt templates:', error);
        toast({
          title: "Thất bại",
          description: "Không thể tải mẫu biên lai. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    };
    
    fetchTemplates();
  }, [finance, toast]);

  useEffect(() => {
    if (selectedTemplateId) {
      generateReceipt();
    }
  }, [selectedTemplateId]);

  const generateReceipt = async () => {
    try {
      setIsLoading(true);
      const receipt = await financeService.generateReceipt(finance.id, selectedTemplateId);
      setGeneratedReceipt(receipt);
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast({
        title: "Thất bại",
        description: "Không thể tạo biên lai. Vui lòng thử lại.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (generatedReceipt?.id) {
      financeService.markReceiptAsPrinted(generatedReceipt.id)
        .then(() => {
          const printContent = receiptRef.current?.innerHTML || '';
          const printWindow = window.open('', '_blank');
          
          if (printWindow) {
            printWindow.document.write(`
              <html>
                <head>
                  <title>Biên Lai - ${finance.ten_phi || finance.loai_giao_dich || 'Giao dịch'}</title>
                  <style>
                    body { font-family: 'Arial', sans-serif; }
                    .receipt-container { max-width: 800px; margin: 0 auto; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .footer { margin-top: 30px; }
                    .signatures { display: flex; justify-content: space-between; margin-top: 50px; }
                    .signature-box { text-align: center; width: 30%; }
                    .signature-line { border-top: 1px solid #000; margin-top: 40px; }
                    @media print {
                      button { display: none; }
                      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                    }
                  </style>
                </head>
                <body>
                  <div class="receipt-container">
                    ${printContent}
                  </div>
                  <script>
                    window.onload = function() { window.print(); window.close(); }
                  </script>
                </body>
              </html>
            `);
            printWindow.document.close();
          } else {
            toast({
              title: 'Cảnh báo',
              description: 'Không thể mở cửa sổ in. Hãy kiểm tra cài đặt trình duyệt của bạn.',
              variant: 'warning',
            });
          }
        })
        .catch(error => {
          console.error('Error marking receipt as printed:', error);
        });
    }
  };

  const handleFinalizeReceipt = async () => {
    if (generatedReceipt?.id) {
      try {
        await financeService.finalizeReceipt(generatedReceipt.id);
        toast({
          title: 'Thành công',
          description: 'Biên lai đã được hoàn tất',
        });
      } catch (error) {
        console.error('Error finalizing receipt:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể hoàn tất biên lai',
          variant: 'destructive',
        });
      }
    }
  };

  const handleExportToExcel = () => {
    toast({
      title: 'Thông báo',
      description: 'Tính năng xuất Excel sẽ được cập nhật trong phiên bản tiếp theo.',
      variant: 'default',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const renderCustomReceipt = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold uppercase mb-1">
            {finance.loai_thu_chi === 'income' ? 'PHIẾU THU' : 'PHIẾU CHI'}
          </h1>
          <p className="text-gray-500">Meraki Education</p>
        </div>

        <div className="flex justify-between mb-6">
          <div>
            <p><strong>Mã số:</strong> {finance.id?.substring(0, 8).toUpperCase()}</p>
            <p><strong>Ngày lập:</strong> {finance.ngay ? new Date(finance.ngay).toLocaleDateString('vi-VN') : formattedDate}</p>
          </div>
          <div className="text-right">
            <p><strong>Đơn vị:</strong> Meraki Education</p>
            <p><strong>Điện thoại:</strong> (+84) xxx-xxx-xxx</p>
          </div>
        </div>

        <div className="mb-6">
          <p><strong>Người nộp/nhận:</strong> ________________________</p>
          <p><strong>Địa chỉ:</strong> ________________________</p>
          <p><strong>Lý do:</strong> {finance.dien_giai || finance.loai_giao_dich || 'Không có'}</p>
        </div>

        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">STT</th>
                <th className="border p-2 text-left">Diễn giải</th>
                <th className="border p-2 text-left">Số lượng</th>
                <th className="border p-2 text-left">Đơn vị</th>
                <th className="border p-2 text-left">Đơn giá</th>
                <th className="border p-2 text-left">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">1</td>
                <td className="border p-2">{finance.dien_giai || finance.loai_giao_dich || finance.ten_phi || 'Không có mô tả'}</td>
                <td className="border p-2">{finance.so_luong || 1}</td>
                <td className="border p-2">{finance.don_vi || 'Lần'}</td>
                <td className="border p-2">{finance.gia_tien ? formatCurrency(finance.gia_tien) : formatCurrency(finance.tong_tien)}</td>
                <td className="border p-2">{formatCurrency(finance.tong_tien)}</td>
              </tr>
              <tr className="h-10">
                <td className="border p-2" colSpan={5} style={{textAlign: 'right'}}><strong>Tổng cộng:</strong></td>
                <td className="border p-2 font-bold">{formatCurrency(finance.tong_tien)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <p><strong>Bằng chữ:</strong> {finance.bang_chu || 'Không có'}</p>
          <p><strong>Hình thức thanh toán:</strong> {
            finance.kieu_thanh_toan === 'cash' ? 'Tiền mặt' : 
            finance.kieu_thanh_toan === 'bank_transfer' ? 'Chuyển khoản' : 
            finance.kieu_thanh_toan === 'credit_card' ? 'Thẻ tín dụng' : 
            finance.kieu_thanh_toan || 'Tiền mặt'
          }</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-10">
          <div className="text-center">
            <p className="font-bold">Người lập phiếu</p>
            <p className="text-gray-500 text-sm">(Ký, họ tên)</p>
            <div className="h-16"></div>
          </div>
          <div className="text-center">
            <p className="font-bold">Kế toán</p>
            <p className="text-gray-500 text-sm">(Ký, họ tên)</p>
            <div className="h-16"></div>
          </div>
          <div className="text-center">
            <p className="font-bold">Người nhận tiền</p>
            <p className="text-gray-500 text-sm">(Ký, họ tên)</p>
            <div className="h-16"></div>
          </div>
        </div>

        {finance.ghi_chu && (
          <div className="mt-4 text-sm text-gray-500">
            <p><strong>Ghi chú:</strong> {finance.ghi_chu}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Chọn mẫu biên lai" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportToExcel}>
            <ExternalLink className="h-4 w-4 mr-1" />
            Xuất Excel
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" />
            In
          </Button>
          <Button variant="outline" onClick={handleFinalizeReceipt}>
            <FileCheck className="h-4 w-4 mr-1" />
            Hoàn tất
          </Button>
        </div>
      </div>

      <div ref={receiptRef} className="mt-4 border rounded-lg overflow-hidden bg-white">
        {renderCustomReceipt()}
      </div>
    </div>
  );
};

export default ReceiptGenerator;
