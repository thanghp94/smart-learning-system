import React, { useState, useEffect } from "react";
import { Class, TeachingSession, Enrollment, Employee } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { teachingSessionService, enrollmentService, employeeService } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import { useToast } from "@/hooks/use-toast";

const sampleSessions: TeachingSession[] = [
  {
    id: "1",
    lop_id: "1",
    session_id: 1,
    ngay_hoc: "2023-09-05",
    thoi_gian_bat_dau: "08:00",
    thoi_gian_ket_thuc: "09:30",
    giao_vien: "Nguyễn Văn A",
    ghi_chu: "Bài 1: Giới thiệu",
    trang_thai: "completed",
    trung_binh: 4.5
  },
  {
    id: "2",
    lop_id: "1", 
    session_id: 2,
    ngay_hoc: "2023-09-07",
    thoi_gian_bat_dau: "08:00",
    thoi_gian_ket_thuc: "09:30",
    giao_vien: "Nguyễn Văn A",
    ghi_chu: "Bài 2: Lý thuyết cơ bản",
    trang_thai: "completed",
    trung_binh: 4.2
  }
];

const sampleEnrollments: Enrollment[] = [
  {
    id: "1",
    lop_id: "1",
    hoc_sinh_id: "HS001",
    ngay_dang_ky: "2023-08-20",
    tinh_trang_diem_danh: "present",
    ghi_chu: "Học sinh chăm chỉ"
  },
  {
    id: "2",
    lop_id: "1",
    hoc_sinh_id: "HS002",
    ngay_dang_ky: "2023-08-22",
    tinh_trang_diem_danh: "absent",
    ghi_chu: "Vắng có phép"
  }
];

const sampleTeacher: Employee = {
  id: "NV001",
  ten_nhan_su: "Nguyễn Văn A",
  chuc_vu: "Giáo viên",
  bo_phan: "Giảng dạy",
  email: "teacher@example.com",
  phone: "0123456789",
  ngay_vao_lam: "2022-01-15",
  trang_thai: "active",
  co_so: "CS001"
};

interface ClassDetailProps {
  classItem: Class;
}

const ClassDetail = ({ classItem }: ClassDetailProps) => {
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [teacher, setTeacher] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        setIsLoading(true);
        
        if (isDemoMode) {
          setTimeout(() => {
            setSessions(sampleSessions);
            setEnrollments(sampleEnrollments);
            setTeacher(sampleTeacher);
            setIsLoading(false);
          }, 800);
          return;
        }
        
        const [sessionsData, enrollmentsData, teacherData] = await Promise.all([
          teachingSessionService.getByClass(classItem.id),
          enrollmentService.getByClass(classItem.id),
          employeeService.getById(classItem.GV_chinh)
        ]);
        
        setSessions(sessionsData);
        setEnrollments(enrollmentsData);
        setTeacher(teacherData);
      } catch (error) {
        console.error("Error fetching related data:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu liên quan đến lớp học",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRelatedData();
  }, [classItem.id, classItem.GV_chinh, isDemoMode]);

  const sessionColumns = [
    {
      title: "Buổi học số",
      key: "session_id",
      sortable: true,
    },
    {
      title: "Ngày học",
      key: "ngay_hoc",
      sortable: true,
      render: (value: string) => <span>{formatDate(value)}</span>,
    },
    {
      title: "Thời gian",
      key: "thoi_gian_bat_dau",
      render: (value: string, record: TeachingSession) => (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {value.substring(0, 5)} - {record.thoi_gian_ket_thuc.substring(0, 5)}
        </div>
      ),
    },
    {
      title: "Giáo viên",
      key: "giao_vien",
      sortable: true,
    },
    {
      title: "Đánh giá TB",
      key: "trung_binh",
      sortable: true,
      render: (value: number) => <span>{value?.toFixed(1) || "N/A"}</span>,
    },
  ];

  const enrollmentColumns = [
    {
      title: "Học sinh ID",
      key: "hoc_sinh_id",
      sortable: true,
    },
    {
      title: "Điểm danh",
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
           value === "late" ? "Đi muộn" : value}
        </Badge>
      ),
    },
    {
      title: "Ghi chú",
      key: "ghi_chu",
      render: (value: string) => <span>{value || "Không có"}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{classItem.Ten_lop_full}</h2>
        <p className="text-muted-foreground">Mã lớp: {classItem.ten_lop}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={classItem.tinh_trang === "active" ? "success" : "secondary"}>
            {classItem.tinh_trang === "active" ? "Đang hoạt động" : classItem.tinh_trang}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {classItem.ct_hoc}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Lớp Học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Chương trình:</span>
              <span className="text-sm col-span-2">{classItem.ct_hoc}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Giáo viên:</span>
              <span className="text-sm col-span-2">{teacher?.ten_nhan_su || classItem.GV_chinh}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Cơ sở:</span>
              <span className="text-sm col-span-2">{classItem.co_so}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Ngày bắt đầu:</span>
              <span className="text-sm col-span-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(classItem.ngay_bat_dau)}
                </div>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Số học sinh:</span>
              <span className="text-sm col-span-2">{classItem.so_hs || enrollments.length || 0}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Ghi chú:</span>
              <span className="text-sm col-span-2">{classItem.ghi_chu || "Không có"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {isDemoMode && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          <strong>Chế độ demo:</strong> Hiển thị dữ liệu mẫu cho các buổi học và ghi danh.
        </div>
      )}

      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions">Buổi Học</TabsTrigger>
          <TabsTrigger value="enrollments">Ghi Danh</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions" className="mt-4">
          <DataTable
            columns={sessionColumns}
            data={sessions}
            isLoading={isLoading}
            searchable={true}
            searchPlaceholder="Tìm kiếm buổi học..."
          />
        </TabsContent>
        
        <TabsContent value="enrollments" className="mt-4">
          <DataTable
            columns={enrollmentColumns}
            data={enrollments}
            isLoading={isLoading}
            searchable={true}
            searchPlaceholder="Tìm kiếm học sinh..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassDetail;
