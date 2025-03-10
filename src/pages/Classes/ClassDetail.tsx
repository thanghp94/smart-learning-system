
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, User, Users, BookOpen, Clock, UserPlus, Calendar, ClipboardList } from "lucide-react";
import { Class, Enrollment, TeachingSession } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { enrollmentService, teachingSessionService } from "@/lib/supabase";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/DataTable";
import ViewEvaluationsButton from "../Evaluations/ViewEvaluationsButton";
import AddTeachingSessionButton from "./AddTeachingSessionButton";

const ClassDetail = ({ classData }: { classData: Class }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [teachingSessions, setTeachingSessions] = useState<TeachingSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Ensure we handle both capitalization variants
  const className = classData.ten_lop_full || classData.Ten_lop_full || '';
  const teacher = classData.gv_chinh || classData.GV_chinh || '';

  useEffect(() => {
    fetchClassData();
  }, [classData.id]);

  const fetchClassData = async () => {
    setIsLoading(true);
    try {
      // Fetch enrollments for this class
      const enrollmentsData = await enrollmentService.getByClass(classData.id);
      setEnrollments(enrollmentsData || []);
      
      // Fetch teaching sessions for this class
      const sessionsData = await teachingSessionService.getByClass(classData.id);
      setTeachingSessions(sessionsData || []);
    } catch (error) {
      console.error("Error fetching class data:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu lớp học",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const enrollmentColumns = [
    {
      title: "Học sinh",
      key: "ten_hoc_sinh",
      sortable: true,
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
      title: "Ghi chú",
      key: "ghi_chu",
      render: (value: string) => value || "-",
    },
    {
      title: "",
      key: "actions",
      render: (_: any, record: Enrollment) => (
        <div className="flex space-x-2">
          <ViewEvaluationsButton 
            enrollmentId={record.id} 
            buttonLabel="Đánh giá"
            size="sm"
            variant="outline"
          />
        </div>
      ),
    },
  ];

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
      render: (value: string) => value ? format(new Date(value), 'dd/MM/yyyy') : '',
    },
    {
      title: "Thời gian",
      key: "thoi_gian_bat_dau",
      render: (value: string, record: TeachingSession) => (
        `${value?.substring(0, 5) || ""} - ${record.thoi_gian_ket_thuc?.substring(0, 5) || ""}`
      ),
    },
    {
      title: "Đánh giá TB",
      key: "trung_binh",
      sortable: true,
      render: (value: number) => <span>{value?.toFixed(1) || "N/A"}</span>,
    },
  ];

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
              {classData.ngay_bat_dau ? new Date(classData.ngay_bat_dau).toLocaleDateString("vi-VN") : 'N/A'}
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
              <p className="font-medium">{classData.so_hs || enrollments.length}</p>
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

      <Separator />

      <Tabs defaultValue="enrollments" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="enrollments">Danh sách học sinh</TabsTrigger>
            <TabsTrigger value="sessions">Buổi học</TabsTrigger>
          </TabsList>
          <div className="flex space-x-2">
            <ViewEvaluationsButton 
              studentId={classData.id} 
              buttonLabel="Xem đánh giá"
              variant="outline"
            />
            <AddTeachingSessionButton 
              classData={classData} 
              onSuccess={fetchClassData}
            />
          </div>
        </div>
        
        <TabsContent value="enrollments" className="mt-4">
          <DataTable 
            columns={enrollmentColumns}
            data={enrollments}
            isLoading={isLoading}
            searchable={true}
            searchPlaceholder="Tìm kiếm học sinh..."
          />
        </TabsContent>
        
        <TabsContent value="sessions" className="mt-4">
          <DataTable 
            columns={sessionColumns}
            data={teachingSessions}
            isLoading={isLoading}
            searchable={true}
            searchPlaceholder="Tìm kiếm buổi học..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassDetail;
