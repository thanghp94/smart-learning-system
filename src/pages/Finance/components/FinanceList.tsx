
import React from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Finance } from "@/lib/types";

export interface FinanceListProps {
  finances: Finance[];
  isLoading: boolean;
  onDelete?: (finance: Finance) => void;
}

const FinanceList: React.FC<FinanceListProps> = ({ finances, isLoading, onDelete }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (finances.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Chưa có giao dịch nào</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {finances.map((finance) => (
        <div key={finance.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={finance.loai_thu_chi === 'income' ? 'success' : 'destructive'}>
                  {finance.loai_thu_chi === 'income' ? 'Thu' : 'Chi'}
                </Badge>
                <span className="font-medium">{finance.loai_giao_dich || 'Chưa phân loại'}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{finance.dien_giai}</p>
            </div>
            <div className="text-right">
              <p className={`font-medium ${finance.loai_thu_chi === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(finance.tong_tien)}
              </p>
              <p className="text-xs text-muted-foreground">
                {finance.ngay ? format(new Date(finance.ngay), 'dd/MM/yyyy') : 'Không có ngày'}
              </p>
            </div>
          </div>
          {finance.ghi_chu && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">Ghi chú: {finance.ghi_chu}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FinanceList;
