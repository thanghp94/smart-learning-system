
import React from "react";
import { Employee } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface EmployeeDetailProps {
  employee: Employee;
}

const EmployeeDetail = ({ employee }: EmployeeDetailProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Avatar className="h-20 w-20">
          {employee.hinh_anh ? (
            <AvatarImage src={employee.hinh_anh} alt={employee.ten_nhan_su} />
          ) : null}
          <AvatarFallback className="text-2xl">
            {employee.ten_nhan_su?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h2 className="text-2xl font-bold">{employee.ten_nhan_su}</h2>
          <p className="text-muted-foreground">{employee.chuc_danh}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={employee.tinh_trang_lao_dong === "active" ? "success" : "secondary"}>
              {employee.tinh_trang_lao_dong === "active" ? "Đang làm việc" : employee.tinh_trang_lao_dong}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {employee.bo_phan}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Cá Nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Tên tiếng Anh:</span>
              <span className="text-sm col-span-2">{employee.ten_tieng_anh || "Không có"}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Giới tính:</span>
              <span className="text-sm col-span-2">{employee.gioi_tinh}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Ngày sinh:</span>
              <span className="text-sm col-span-2">{formatDate(employee.ngay_sinh)}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Địa chỉ:</span>
              <span className="text-sm col-span-2">{employee.dia_chi}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Liên Hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Điện thoại:</span>
              <span className="text-sm col-span-2">{employee.dien_thoai}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Email:</span>
              <span className="text-sm col-span-2">{employee.email}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Công Việc</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Bộ phận:</span>
              <span className="text-sm col-span-2">{employee.bo_phan}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Chức danh:</span>
              <span className="text-sm col-span-2">{employee.chuc_danh}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Cơ sở:</span>
              <span className="text-sm col-span-2">
                {employee.co_so_id?.join(', ') || "Không có"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDetail;
