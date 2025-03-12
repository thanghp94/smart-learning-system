
import React from 'react';
import { Button } from '@/components/ui/button';

interface FinanceFormFooterProps {
  isSubmitting: boolean;
  onCancel: () => void;
  initialData?: any;
}

const FinanceFormFooter: React.FC<FinanceFormFooterProps> = ({ isSubmitting, onCancel, initialData }) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Hủy
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Thêm mới'}
      </Button>
    </div>
  );
};

export default FinanceFormFooter;
