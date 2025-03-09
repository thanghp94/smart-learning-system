
import React from "react";
import { useNavigate } from "react-router-dom";
import { Student } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, Phone, MapPin, School, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";

interface StudentDetailProps {
  student: Student;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center text-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={student.hinh_anh_hoc_sinh} />
          <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
            {student.ten_hoc_sinh.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <h3 className="mt-4 text-xl font-bold">{student.ten_hoc_sinh}</h3>
        
        <div className="mt-1 flex items-center">
          <Badge className={cn(STATUS_COLORS[student.trang_thai as keyof typeof STATUS_COLORS] || STATUS_COLORS.default)}>
            {student.trang_thai === "active" && "Đang học"}
            {student.trang_thai === "inactive" && "Nghỉ học"}
            {student.trang_thai === "pending" && "Chờ xác nhận"}
            {!student.trang_thai && "-"}
          </Badge>
        </div>
        
        <p className="mt-2 text-sm text-muted-foreground">
          ID: {student.id}
        </p>
      </div>
      
      <Tabs defaultValue="info">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="classes">Lớp học</TabsTrigger>
          <TabsTrigger value="attendance">Điểm danh</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4 pt-4">
          <div className="grid gap-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="rounded-full p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm text-muted-foreground">Ngày sinh</p>
                <p className="font-medium">
                  {student.ngay_sinh 
                    ? new Date(student.ngay_sinh).toLocaleDateString("vi-VN")
                    : "-"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="rounded-full p-2 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <School className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm text-muted-foreground">Chương trình học</p>
                <p className="font-medium">{student.ct_hoc || "-"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="rounded-full p-2 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <Clock className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm text-muted-foreground">Hạn học phí</p>
                <p className="font-medium">
                  {student.han_hoc_phi 
                    ? new Date(student.han_hoc_phi).toLocaleDateString("vi-VN")
                    : "-"}
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="mb-4 text-sm font-semibold">Thông tin phụ huynh</h4>
            <div className="grid gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Tên phụ huynh</p>
                <p>{student.ten_PH || "-"}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <p>{student.sdt_ph1 || "-"}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <p>{student.email_ph1 || "-"}</p>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <p>{student.dia_chi || "-"}</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="classes" className="pt-4">
          <div className="rounded-lg border">
            <div className="p-4">
              <h4 className="font-medium">Lớp đang học</h4>
            </div>
            <div className="p-8 text-center text-muted-foreground">
              <p>Chưa có thông tin về lớp học</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/enrollments/add")}>
                Ghi danh lớp học
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="attendance" className="pt-4">
          <div className="rounded-lg border">
            <div className="flex items-center justify-between p-4">
              <h4 className="font-medium">Điểm danh gần đây</h4>
              <Button variant="outline" size="sm">Xem tất cả</Button>
            </div>
            <div className="p-8 text-center text-muted-foreground">
              <p>Chưa có thông tin điểm danh</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetail;
