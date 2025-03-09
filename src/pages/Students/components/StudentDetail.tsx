
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Student, Enrollment } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import EnrollStudentButton from "./EnrollStudentButton";

interface StudentDetailProps {
  student: Student;
  enrollments?: Enrollment[];
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student, enrollments = [] }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Avatar className="h-20 w-20 mr-4">
          <AvatarImage src={student.hinh_anh_hoc_sinh} />
          <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
            {student.ten_hoc_sinh?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold">{student.ten_hoc_sinh}</h2>
          <p className="text-muted-foreground">ID: {student.id}</p>
          <div className="flex items-center mt-2">
            <Badge className={cn(
              STATUS_COLORS[student.trang_thai as keyof typeof STATUS_COLORS] || 
              STATUS_COLORS.default
            )}>
              {student.trang_thai === "active" && "Đang học"}
              {student.trang_thai === "inactive" && "Nghỉ học"}
              {student.trang_thai === "pending" && "Chờ xác nhận"}
              {!student.trang_thai && "-"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Thông tin cá nhân</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Ngày sinh</dt>
                <dd>
                  {student.ngay_sinh ? 
                    new Date(student.ngay_sinh).toLocaleDateString("vi-VN") : 
                    "Chưa có thông tin"
                  }
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Giới tính</dt>
                <dd>{student.gioi_tinh || "Chưa có thông tin"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Địa chỉ</dt>
                <dd>{student.dia_chi || "Chưa có thông tin"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Chương trình học</dt>
                <dd>{student.ct_hoc || "Chưa có thông tin"}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Thông tin phụ huynh</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tên phụ huynh</dt>
                <dd>{student.ten_ph || "Chưa có thông tin"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Số điện thoại</dt>
                <dd>{student.sdt_ph1 || "Chưa có thông tin"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd>{student.email_ph1 || "Chưa có thông tin"}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Học phí</h3>
            <Badge variant={
              student.han_hoc_phi && new Date(student.han_hoc_phi) < new Date() 
                ? "destructive" 
                : "success"
            }>
              {student.han_hoc_phi 
                ? new Date(student.han_hoc_phi).toLocaleDateString("vi-VN") 
                : "Chưa có thông tin"
              }
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Ngày bắt đầu: {
              student.ngay_bat_dau_hoc_phi 
                ? new Date(student.ngay_bat_dau_hoc_phi).toLocaleDateString("vi-VN") 
                : "Chưa có thông tin"
            }
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Các lớp đã ghi danh</h3>
            <EnrollStudentButton student={student} />
          </div>
          {enrollments && enrollments.length > 0 ? (
            <ul className="space-y-2">
              {enrollments.map((enrollment) => (
                <li key={enrollment.id} className="p-2 border rounded">
                  <div className="flex justify-between">
                    <span className="font-medium">{enrollment.ten_lop_full || enrollment.lop_chi_tiet_id}</span>
                    <Badge variant={
                      enrollment.tinh_trang_diem_danh === "present" ? "success" : 
                      enrollment.tinh_trang_diem_danh === "absent" ? "destructive" : 
                      enrollment.tinh_trang_diem_danh === "late" ? "warning" : 
                      "secondary"
                    }>
                      {enrollment.tinh_trang_diem_danh === "present" ? "Có mặt" : 
                       enrollment.tinh_trang_diem_danh === "absent" ? "Vắng mặt" : 
                       enrollment.tinh_trang_diem_danh === "late" ? "Đi trễ" : 
                       enrollment.tinh_trang_diem_danh || "Chưa điểm danh"}
                    </Badge>
                  </div>
                  {enrollment.ghi_chu && (
                    <p className="text-sm text-muted-foreground mt-1">{enrollment.ghi_chu}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">Học sinh chưa ghi danh vào lớp nào</p>
          )}
        </div>

        {student.mo_ta_hs && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
            <p className="text-sm">{student.mo_ta_hs}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;
