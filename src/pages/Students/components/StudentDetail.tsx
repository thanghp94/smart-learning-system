
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Phone, Mail, MapPin, Calendar, BookOpen, Info, Pencil, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Student, Enrollment } from "@/lib/types";
import { format } from "date-fns";
import { enrollmentService } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ui/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnrollStudentButton from "./EnrollStudentButton";
import ViewEvaluationsButton from "../../Evaluations/ViewEvaluationsButton";

interface StudentDetailProps {
  student: Student;
  onEdit?: () => void;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student, onEdit }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEnrollments();
  }, [student.id]);

  const fetchEnrollments = async () => {
    if (!student.id) return;
    
    try {
      setIsLoading(true);
      const data = await enrollmentService.getByStudent(student.id);
      console.log("Fetched enrollments:", data);
      setEnrollments(data || []);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách ghi danh của học sinh",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const enrollmentColumns = [
    {
      title: "Lớp",
      key: "ten_lop_full",
      sortable: true,
    },
    {
      title: "Chương trình",
      key: "ct_hoc",
      render: (value: string) => value || "-",
    },
    {
      title: "Trạng thái điểm danh",
      key: "tinh_trang_diem_danh",
      sortable: true,
      render: (value: string) => (
        <Badge variant={
          value === "present" ? "success" : 
          value === "absent" ? "destructive" : 
          "secondary"
        }>
          {value === "present" ? "Có mặt" : 
           value === "absent" ? "Vắng mặt" : 
           "Chưa điểm danh"}
        </Badge>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (_: any, record: Enrollment) => (
        <ViewEvaluationsButton 
          enrollmentId={record.id} 
          buttonLabel="Đánh giá"
          size="sm"
          variant="outline"
        />
      ),
    },
  ];

  // Generate avatar initials from student name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20 mb-4 sm:mb-0 sm:mr-4">
            {student.hinh_anh_hoc_sinh ? (
              <AvatarImage src={student.hinh_anh_hoc_sinh} alt={student.ten_hoc_sinh} />
            ) : null}
            <AvatarFallback className="text-lg">{getInitials(student.ten_hoc_sinh)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-2xl font-bold mb-1">{student.ten_hoc_sinh}</h3>
            <div className="flex items-center flex-wrap gap-2">
              <Badge variant={student.trang_thai === "active" ? "success" : "destructive"}>
                {student.trang_thai === "active" ? "Đang học" : "Ngừng học"}
              </Badge>
              {student.ct_hoc && (
                <Badge variant="outline" className="ml-2">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {student.ct_hoc}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          <ViewEvaluationsButton 
            studentId={student.id} 
            buttonLabel="Xem đánh giá"
            variant="outline"
          />
          <EnrollStudentButton 
            student={student} 
            onSuccess={fetchEnrollments}
          />
          {onEdit && (
            <Button onClick={onEdit} size="sm" variant="outline">
              <Pencil className="h-4 w-4 mr-1" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Thông tin cá nhân</h4>
          
          {student.gioi_tinh && (
            <div className="flex items-start">
              <Info className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Giới tính</p>
                <p>{student.gioi_tinh}</p>
              </div>
            </div>
          )}
          
          {student.ngay_sinh && (
            <div className="flex items-start">
              <Calendar className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Ngày sinh</p>
                <p>{format(new Date(student.ngay_sinh), 'dd/MM/yyyy')}</p>
              </div>
            </div>
          )}
          
          {student.dia_chi && (
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Địa chỉ</p>
                <p>{student.dia_chi}</p>
              </div>
            </div>
          )}
          
          {student.created_at && (
            <div className="flex items-start">
              <Clock className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Ngày tạo</p>
                <p>{format(new Date(student.created_at), 'dd/MM/yyyy')}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Thông tin phụ huynh</h4>
          
          {student.ten_PH && (
            <div className="flex items-start">
              <Info className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Tên phụ huynh</p>
                <p>{student.ten_PH}</p>
              </div>
            </div>
          )}
          
          {student.sdt_ph1 && (
            <div className="flex items-start">
              <Phone className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Số điện thoại</p>
                <p>{student.sdt_ph1}</p>
              </div>
            </div>
          )}
          
          {student.email_ph1 && (
            <div className="flex items-start">
              <Mail className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{student.email_ph1}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {student.ghi_chu && (
        <>
          <Separator />
          <div>
            <h4 className="text-sm font-semibold mb-2">Ghi chú</h4>
            <p className="text-muted-foreground">{student.ghi_chu}</p>
          </div>
        </>
      )}
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="text-sm font-semibold">Danh sách lớp học đã ghi danh</h4>
        <DataTable 
          columns={enrollmentColumns}
          data={enrollments}
          isLoading={isLoading}
          searchable={true}
          searchPlaceholder="Tìm kiếm lớp học..."
        />
      </div>
    </div>
  );
};

export default StudentDetail;
