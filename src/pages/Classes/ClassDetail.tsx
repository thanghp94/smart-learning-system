
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, User, Users, BookOpen, Clock } from "lucide-react";
import { Class } from "@/lib/types";

const ClassDetail = ({ classData }: { classData: Class }) => {
  // Ensure we handle both capitalization variants
  const className = classData.ten_lop_full || classData.Ten_lop_full || '';
  const teacher = classData.gv_chinh || classData.GV_chinh || '';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">{className}</h3>
        <p className="text-muted-foreground">ID: {classData.id}</p>
        <div className="mt-2 flex justify-center">
          <Badge variant={classData.tinh_trang === "active" ? "success" : "destructive"}>
            {classData.tinh_trang === "active" ? "Đang hoạt động" : "Đã kết thúc"}
          </Badge>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Giáo viên chính</p>
            <p className="font-medium">{teacher}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Chương trình</p>
            <p className="font-medium">{classData.ct_hoc}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
            <p className="font-medium">
              {new Date(classData.ngay_bat_dau).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {classData.so_hs !== undefined && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Số học sinh</p>
              <p className="font-medium">{classData.so_hs}</p>
            </div>
          </div>
        )}

        {classData.tg_tao && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ngày tạo</p>
              <p className="font-medium">
                {new Date(classData.tg_tao).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        )}
      </div>

      {classData.ghi_chu && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Ghi chú</h4>
            <p className="text-muted-foreground">{classData.ghi_chu}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassDetail;
