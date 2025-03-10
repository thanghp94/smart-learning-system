
// src/pages/Finance/components/ReceiptGenerator.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Finance } from '@/lib/types';

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

  const handleGenerateReceipt = async () => {
    if (onGenerateReceipt) {
      await onGenerateReceipt();
    } else {
      setIsLoading(true);
      // Default receipt generation logic if no handler provided
      setTimeout(() => {
        setIsLoading(false);
        if (onClose) onClose();
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {finance && (
        <div className="mb-6 p-4 border rounded-md bg-muted/50">
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

      <div className="flex justify-end space-x-2">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
        )}
        <Button onClick={handleGenerateReceipt} disabled={isLoading || isGenerating}>
          {isLoading || isGenerating ? (
            <>
              <Badge variant="secondary">Đang tạo biên nhận...</Badge>
            </>
          ) : (
            'Tạo biên nhận'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReceiptGenerator;
