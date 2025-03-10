// src/pages/Finance/components/ReceiptGenerator.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ReceiptGeneratorProps {
  onGenerateReceipt: () => Promise<void>;
  isGenerating: boolean;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ onGenerateReceipt, isGenerating }) => {
  return (
    <div>
      <Button onClick={onGenerateReceipt} disabled={isGenerating}>
        {isGenerating ? (
          <>
            <Badge variant="secondary">Đang tạo biên nhận...</Badge>
          </>
        ) : (
          'Tạo biên nhận'
        )}
      </Button>
    </div>
  );
};

export default ReceiptGenerator;
