
import React from "react";
import { Student } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface StudentDetailProps {
  student: Student;
}

const StudentDetail = ({ student }: StudentDetailProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Avatar className="h-20 w-20">
          {student.hinh_anh_hoc_sinh ? (
            <AvatarImage src={student.hinh_anh_hoc_sinh} alt={student.ten_hoc_sinh} />
          ) : null}
          <AvatarFallback className="text-2xl">
            {student.ten_hoc_sinh?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h2 className="text-2xl font-bold">{student.ten_hoc_sinh}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={student.trang_thai === "active" ? "success" : "secondary"}>
              {student.trang_thai === "active" ? "Đang học" : student.trang_thai}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {student.ct_hoc}
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
              <span className="text-sm font-medium text-muted-foreground">Giới tính:</span>
              <span className="text-sm col-span-2">{student.gioi_tinh}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Ngày sinh:</span>
              <span className="text-sm col-span-2">{formatDate(student.ngay_sinh)}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Địa chỉ:</span>
              <span className="text-sm col-span-2">{student.dia_chi}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Mô tả:</span>
              <span className="text-sm col-span-2">{student.mo_ta_hs || "Không có"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Phụ Huynh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Tên phụ huynh:</span>
              <span className="text-sm col-span-2">{student.ten_PH}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Số điện thoại:</span>
              <span className="text-sm col-span-2">{student.sdt_ph1}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Email:</span>
              <span className="text-sm col-span-2">{student.email_ph1}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Học Phí</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Ngày bắt đầu:</span>
              <span className="text-sm col-span-2">{formatDate(student.ngay_bat_dau_hoc_phi)}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Hạn học phí:</span>
              <span className="text-sm col-span-2">{formatDate(student.han_hoc_phi)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDetail;
