
import React from "react";
import { Finance } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface FinanceDetailProps {
  finance: Finance;
}

const FinanceDetail: React.FC<FinanceDetailProps> = ({ finance }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (e) {
      return "N/A";
    }
  };

  const getEntityTypeName = (type?: string) => {
    const typeMap: Record<string, string> = {
      'student': 'Học sinh',
      'employee': 'Nhân viên',
      'contact': 'Liên hệ',
      'facility': 'Cơ sở',
      'asset': 'Cơ sở vật chất',
      'event': 'Sự kiện',
      'government': 'Cơ quan nhà nước'
    };
    
    return typeMap[type || ''] || type || 'N/A';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">
          {finance.loai_thu_chi === "income" ? "Thu" : "Chi"}: {finance.dien_giai || "N/A"}
        </h2>
        <p className="text-muted-foreground">
          Ngày: {formatDate(finance.ngay)}
        </p>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm font-medium text-muted-foreground">Loại giao dịch:</span>
          <p>
            <Badge variant={finance.loai_thu_chi === "income" ? "success" : "destructive"}>
              {finance.loai_thu_chi === "income" ? "Thu" : "Chi"}
            </Badge>
          </p>
        </div>
        
        {finance.loai_giao_dich && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Hạng mục:</span>
            <p>{finance.loai_giao_dich}</p>
          </div>
        )}
        
        <div>
          <span className="text-sm font-medium text-muted-foreground">Số tiền:</span>
          <p className="font-semibold">{formatCurrency(finance.tong_tien)}</p>
        </div>
        
        {finance.bang_chu && (
          <div className="col-span-2">
            <span className="text-sm font-medium text-muted-foreground">Bằng chữ:</span>
            <p>{finance.bang_chu}</p>
          </div>
        )}
        
        {finance.kieu_thanh_toan && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Kiểu thanh toán:</span>
            <p>{finance.kieu_thanh_toan}</p>
          </div>
        )}
        
        <div>
          <span className="text-sm font-medium text-muted-foreground">Trạng thái:</span>
          <p>
            <Badge variant={
              finance.tinh_trang === "completed" ? "success" : 
              finance.tinh_trang === "pending" ? "secondary" : 
              "outline"
            }>
              {finance.tinh_trang === "completed" ? "Hoàn thành" : 
              finance.tinh_trang === "pending" ? "Chờ xử lý" : 
              finance.tinh_trang || "N/A"}
            </Badge>
          </p>
        </div>
      </div>
      
      <Separator />
      
      {(finance.loai_doi_tuong || finance.doi_tuong_id) && (
        <>
          <div className="grid grid-cols-2 gap-4">
            {finance.loai_doi_tuong && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Đối tượng:</span>
                <p>{getEntityTypeName(finance.loai_doi_tuong)}</p>
              </div>
            )}
            
            {finance.doi_tuong_id && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">ID đối tượng:</span>
                <p>{finance.doi_tuong_id}</p>
              </div>
            )}
          </div>
          
          <Separator />
        </>
      )}
      
      {finance.ghi_chu && (
        <div>
          <span className="text-sm font-medium text-muted-foreground">Ghi chú:</span>
          <p className="whitespace-pre-line">{finance.ghi_chu}</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        {finance.tg_tao && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Thời gian tạo:</span>
            <p>{formatDate(finance.tg_tao)}</p>
          </div>
        )}
        
        {finance.tg_hoan_thanh && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Thời gian hoàn thành:</span>
            <p>{formatDate(finance.tg_hoan_thanh)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceDetail;
