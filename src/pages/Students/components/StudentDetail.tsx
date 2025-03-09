
import React from "react";
import { Student } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, Phone, MapPin, School, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface StudentDetailProps {
  student: Student;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-medium">Thông tin cá nhân</h3>
            <Separator className="my-2" />
            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Ngày sinh: {student.ngay_sinh ? formatDate(student.ngay_sinh) : 'Chưa cập nhật'}</span>
              </div>
              <div className="flex items-center gap-2">
                <School className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Chương trình học: {student.ct_hoc || 'Chưa cập nhật'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Thông tin phụ huynh</h3>
            <Separator className="my-2" />
            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Số điện thoại: {student.sdt_ph1 || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Email: {student.email_ph1 || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Địa chỉ: {student.dia_chi || 'Chưa cập nhật'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-medium">Thông tin học phí</h3>
            <Separator className="my-2" />
            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Ngày bắt đầu: {student.ngay_bat_dau_hoc_phi ? formatDate(student.ngay_bat_dau_hoc_phi) : 'Chưa cập nhật'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Hạn học phí: {student.han_hoc_phi ? formatDate(student.han_hoc_phi) : 'Chưa cập nhật'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Ghi chú</h3>
            <Separator className="my-2" />
            <p className="text-sm">{student.ghi_chu || 'Không có ghi chú'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
