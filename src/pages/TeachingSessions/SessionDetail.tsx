
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { teachingSessionService } from "@/lib/supabase";
import { TeachingSession, Class, Employee } from "@/lib/types";
import { format } from "date-fns";
import { classService, employeeService } from "@/lib/supabase";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const SessionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<TeachingSession | null>(null);
  const [classInfo, setClassInfo] = useState<Class | null>(null);
  const [teacher, setTeacher] = useState<Employee | null>(null);
  const [assistant, setAssistant] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        
        // Fetch session
        const sessionData = await teachingSessionService.getById(id);
        setSession(sessionData);
        
        if (sessionData) {
          // Fetch related class
          const classData = await classService.getById(sessionData.lop_chi_tiet_id);
          setClassInfo(classData);
          
          // Fetch teacher
          if (sessionData.giao_vien) {
            const teacherData = await employeeService.getById(sessionData.giao_vien);
            setTeacher(teacherData);
          }
          
          // Fetch assistant
          if (sessionData.tro_giang) {
            const assistantData = await employeeService.getById(sessionData.tro_giang);
            setAssistant(assistantData);
          }
        }
      } catch (error) {
        console.error("Error fetching session details:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin buổi học",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setDeleting(true);
      await teachingSessionService.delete(id);
      toast({
        title: "Thành công",
        description: "Đã xóa buổi học",
      });
      navigate("/teaching-sessions");
    } catch (error) {
      console.error("Error deleting session:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa buổi học",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        <span>Đang tải...</span>
      </div>
    );
  }

  if (!session) {
    return <div>Không tìm thấy buổi học</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Chi tiết buổi học
        </h2>
        <div className="flex space-x-2">
          <Button onClick={() => navigate(`/teaching-sessions/edit/${id}`)}>
            Chỉnh sửa
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Xóa</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa buổi học này? Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                  {deleting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="content">Nội dung</TabsTrigger>
          <TabsTrigger value="evaluation">Đánh giá</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin buổi học</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Lớp:</p>
                <p>{classInfo?.ten_lop_full || classInfo?.Ten_lop_full || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Loại bài học:</p>
                <p>{session.loai_bai_hoc || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Ngày học:</p>
                <p>{session.ngay_hoc ? format(new Date(session.ngay_hoc), "dd/MM/yyyy") : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Thời gian:</p>
                <p>{session.thoi_gian_bat_dau} - {session.thoi_gian_ket_thuc}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Giáo viên:</p>
                <p>{teacher?.ten_nhan_su || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Trợ giảng:</p>
                <p>{assistant?.ten_nhan_su || "Không có"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Phòng học:</p>
                <p>{session.phong_hoc_id || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Buổi học số:</p>
                <p>{session.session_id}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Nội dung buổi học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{session.noi_dung || "Không có nội dung"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="evaluation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá buổi học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Tiêu chí 1:</p>
                  <p>{session.nhan_xet_1 || "Chưa đánh giá"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tiêu chí 2:</p>
                  <p>{session.nhan_xet_2 || "Chưa đánh giá"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tiêu chí 3:</p>
                  <p>{session.nhan_xet_3 || "Chưa đánh giá"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tiêu chí 4:</p>
                  <p>{session.nhan_xet_4 || "Chưa đánh giá"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tiêu chí 5:</p>
                  <p>{session.nhan_xet_5 || "Chưa đánh giá"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tiêu chí 6:</p>
                  <p>{session.nhan_xet_6 || "Chưa đánh giá"}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <p className="text-sm font-medium">Điểm trung bình:</p>
                <Badge variant="outline" className="text-lg mt-1">
                  {session.trung_binh ? Number(session.trung_binh).toFixed(1) : "Chưa đánh giá"}
                </Badge>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <p className="text-sm font-medium">Nhận xét chung:</p>
                <p className="whitespace-pre-wrap">{session.nhan_xet_chung || "Không có nhận xét"}</p>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <p className="text-sm font-medium">Ghi chú:</p>
                <p className="whitespace-pre-wrap">{session.ghi_chu || "Không có ghi chú"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionDetail;
