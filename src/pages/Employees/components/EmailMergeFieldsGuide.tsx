
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const EmailMergeFieldsGuide = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hướng dẫn sử dụng trường hợp nhất (Merge Fields)</CardTitle>
        <CardDescription>
          Sử dụng các trường merge trong mẫu email để điền thông tin động
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Quan trọng</AlertTitle>
          <AlertDescription>
            Các trường merge phải được đặt trong dấu ngoặc nhọn kép, ví dụ: <code>{'{{ten_hoc_sinh}}'}</code>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Trường thông tin học sinh</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><code>{'{{ten_hoc_sinh}}'}</code> - Tên học sinh</li>
            <li><code>{'{{gioi_tinh}}'}</code> - Giới tính</li>
            <li><code>{'{{ngay_sinh}}'}</code> - Ngày sinh</li>
            <li><code>{'{{email}}'}</code> - Email học sinh</li>
            <li><code>{'{{dia_chi}}'}</code> - Địa chỉ</li>
            <li><code>{'{{ten_ph}}'}</code> - Tên phụ huynh</li>
            <li><code>{'{{sdt_ph1}}'}</code> - Số điện thoại phụ huynh</li>
            <li><code>{'{{email_ph1}}'}</code> - Email phụ huynh</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Trường thông tin nhân viên</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><code>{'{{ten_nhan_su}}'}</code> - Tên nhân viên</li>
            <li><code>{'{{chuc_danh}}'}</code> - Chức danh</li>
            <li><code>{'{{email}}'}</code> - Email</li>
            <li><code>{'{{dien_thoai}}'}</code> - Số điện thoại</li>
            <li><code>{'{{ngay_vao_lam}}'}</code> - Ngày vào làm</li>
            <li><code>{'{{luong_co_ban}}'}</code> - Lương cơ bản</li>
            <li><code>{'{{bo_phan}}'}</code> - Bộ phận</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Trường thông tin lớp học</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><code>{'{{ten_lop}}'}</code> - Tên lớp</li>
            <li><code>{'{{ten_lop_full}}'}</code> - Tên đầy đủ của lớp</li>
            <li><code>{'{{ngay_bat_dau}}'}</code> - Ngày bắt đầu lớp</li>
            <li><code>{'{{ten_giao_vien}}'}</code> - Tên giáo viên phụ trách</li>
            <li><code>{'{{ten_co_so}}'}</code> - Tên cơ sở</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Trường thông tin ngày tháng</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><code>{'{{ngay_hien_tai}}'}</code> - Ngày hiện tại</li>
            <li><code>{'{{thang_hien_tai}}'}</code> - Tháng hiện tại</li>
            <li><code>{'{{nam_hien_tai}}'}</code> - Năm hiện tại</li>
          </ul>
        </div>

        <div className="mt-4 border-t pt-4">
          <h3 className="text-lg font-medium">Cách sử dụng trong email</h3>
          <div className="mt-2 bg-gray-100 p-3 rounded-md text-sm">
            <p>Kính gửi Phụ huynh <code>{'{{ten_ph}}'}</code>,</p>
            <p>Chúng tôi xin thông báo học sinh <code>{'{{ten_hoc_sinh}}'}</code> đã được ghi danh vào lớp <code>{'{{ten_lop_full}}'}</code>.</p>
            <p>Lớp học sẽ bắt đầu từ ngày <code>{'{{ngay_bat_dau}}'}</code> tại cơ sở <code>{'{{ten_co_so}}'}</code>.</p>
            <p>Trân trọng,<br/>Ban Giám đốc</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailMergeFieldsGuide;
