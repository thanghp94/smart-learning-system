
import React from 'react';
import { Button } from '@/components/ui/button';
import { AdmissionStatus, ADMISSION_STATUS_MAP, Admission } from '@/lib/types/admission';

interface AdmissionDetailViewProps {
  admission: Admission;
  getEmployeeName: (id?: string) => string;
  onClose: () => void;
  onEdit: (admission: Admission) => void;
}

const AdmissionDetailView: React.FC<AdmissionDetailViewProps> = ({ 
  admission, 
  getEmployeeName, 
  onClose, 
  onEdit 
}) => {
  if (!admission) return null;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Thông tin học sinh</h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Tên học sinh</p>
              <p className="font-medium">{admission.ten_hoc_sinh}</p>
            </div>
            {admission.ngay_sinh && <div>
                <p className="text-sm text-muted-foreground">Ngày sinh</p>
                <p>{new Date(admission.ngay_sinh).toLocaleDateString('vi-VN')}</p>
              </div>}
            {admission.gioi_tinh && <div>
                <p className="text-sm text-muted-foreground">Giới tính</p>
                <p>{admission.gioi_tinh}</p>
              </div>}
            {admission.email && <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{admission.email}</p>
              </div>}
            {admission.so_dien_thoai && <div>
                <p className="text-sm text-muted-foreground">Số điện thoại</p>
                <p>{admission.so_dien_thoai}</p>
              </div>}
            {admission.zalo && <div>
                <p className="text-sm text-muted-foreground">Zalo</p>
                <p>{admission.zalo}</p>
              </div>}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Thông tin phụ huynh</h3>
          <div className="space-y-2">
            {admission.ten_phu_huynh && <div>
                <p className="text-sm text-muted-foreground">Tên phụ huynh</p>
                <p className="font-medium">{admission.ten_phu_huynh}</p>
              </div>}
            {admission.email_phu_huynh && <div>
                <p className="text-sm text-muted-foreground">Email phụ huynh</p>
                <p>{admission.email_phu_huynh}</p>
              </div>}
            {admission.so_dien_thoai_phu_huynh && <div>
                <p className="text-sm text-muted-foreground">Số điện thoại phụ huynh</p>
                <p>{admission.so_dien_thoai_phu_huynh}</p>
              </div>}
            {admission.dia_chi && <div>
                <p className="text-sm text-muted-foreground">Địa chỉ</p>
                <p>{admission.dia_chi}</p>
              </div>}
            {admission.nguon_gioi_thieu && <div>
                <p className="text-sm text-muted-foreground">Nguồn giới thiệu</p>
                <p>{admission.nguon_gioi_thieu}</p>
              </div>}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium">Thông tin bổ sung</h3>

        {admission.mieu_ta_hoc_sinh && <div>
            <p className="text-sm text-muted-foreground">Miêu tả về học sinh</p>
            <p className="whitespace-pre-wrap">{admission.mieu_ta_hoc_sinh}</p>
          </div>}

        {admission.ghi_chu && <div>
            <p className="text-sm text-muted-foreground">Ghi chú khác</p>
            <p className="whitespace-pre-wrap">{admission.ghi_chu}</p>
          </div>}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Trạng thái</p>
            <p className="font-medium">{ADMISSION_STATUS_MAP[admission.trang_thai as AdmissionStatus]}</p>
          </div>

          {admission.nguoi_phu_trach && <div>
              <p className="text-sm text-muted-foreground">Người phụ trách</p>
              <p>{getEmployeeName(admission.nguoi_phu_trach)}</p>
            </div>}

          {admission.ngay_lien_he_dau && <div>
              <p className="text-sm text-muted-foreground">Ngày liên hệ đầu</p>
              <p>{new Date(admission.ngay_lien_he_dau).toLocaleDateString('vi-VN')}</p>
            </div>}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onClose}>
          Đóng
        </Button>
        <Button onClick={() => onEdit(admission)}>
          Chỉnh sửa
        </Button>
      </div>
    </div>
  );
};

export default AdmissionDetailView;
