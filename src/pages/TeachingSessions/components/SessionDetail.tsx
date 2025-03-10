
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeachingSession, Image as ImageType } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Upload, Image, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { imageService } from "@/lib/supabase";
import { studentAssignmentService, StudentAssignment } from "@/lib/supabase/student-assignment-service";
import AssignmentForm from "./AssignmentForm";
import ImageUploadForm from "./ImageUploadForm";

interface SessionDetailProps {
  session: TeachingSession;
}

const SessionDetail: React.FC<SessionDetailProps> = ({ session }) => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
    fetchAssignments();
  }, [session.id]);

  const fetchImages = async () => {
    try {
      const data = await imageService.getByEntity("teaching_session", session.id);
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const data = await studentAssignmentService.getByTeachingSession(session.id);
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const handleImageUploadComplete = () => {
    setShowImageUpload(false);
    fetchImages();
  };

  const handleAssignmentSubmit = async (data: Partial<StudentAssignment>) => {
    try {
      await studentAssignmentService.create(data);
      toast({
        title: "Thành công",
        description: "Đã tạo bài tập mới thành công",
      });
      setShowAssignmentForm(false);
      fetchAssignments();
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo bài tập. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: vi });
    } catch (e) {
      return String(date);
    }
  };

  const formatTime = (time: string | undefined) => {
    if (!time) return "N/A";
    return time.substring(0, 5);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{session.class_name || "Buổi học"}</h2>
        <p className="text-muted-foreground">
          Ngày học: {formatDate(session.ngay_hoc)} | Thời gian: {formatTime(session.thoi_gian_bat_dau)} - {formatTime(session.thoi_gian_ket_thuc)}
        </p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Buổi học số:</p>
          <p>{session.session_id}</p>
        </div>
        <div>
          <p className="font-medium">Giáo viên:</p>
          <p>{session.teacher_name || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Trợ giảng:</p>
          <p>{session.assistant_name || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Loại bài học:</p>
          <p>{session.loai_bai_hoc || "Học mới"}</p>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="content">Nội dung</TabsTrigger>
          <TabsTrigger value="assignments">Bài tập</TabsTrigger>
          <TabsTrigger value="images">Hình ảnh</TabsTrigger>
          <TabsTrigger value="evaluation">Đánh giá</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="pt-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Nội dung bài học</h3>
              <p className="mt-1 whitespace-pre-line">{session.lesson_content || "Không có nội dung"}</p>
            </div>

            {session.ghi_chu && (
              <div>
                <h3 className="font-semibold">Ghi chú</h3>
                <p className="mt-1 whitespace-pre-line">{session.ghi_chu}</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="pt-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowAssignmentForm(true)}>
              <Plus className="h-4 w-4 mr-1" /> Thêm bài tập
            </Button>
          </div>

          {assignments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Chưa có bài tập nào cho buổi học này</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader className="py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{assignment.tieu_de}</CardTitle>
                      <Badge variant={assignment.trang_thai === "assigned" ? "outline" : "default"}>
                        {assignment.trang_thai === "assigned" ? "Đã giao" : 
                         assignment.trang_thai === "submitted" ? "Đã nộp" : 
                         assignment.trang_thai === "reviewed" ? "Đã chấm" : 
                         assignment.trang_thai === "late" ? "Nộp trễ" : "Đã giao"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    {assignment.mo_ta && (
                      <p className="text-sm text-muted-foreground mb-2">{assignment.mo_ta}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="font-medium">Ngày giao:</span> {formatDate(assignment.ngay_giao)}
                      </div>
                      {assignment.han_nop && (
                        <div>
                          <span className="font-medium">Hạn nộp:</span> {formatDate(assignment.han_nop)}
                        </div>
                      )}
                      {assignment.file && (
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>Có tệp đính kèm</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="images" className="pt-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowImageUpload(true)}>
              <Upload className="h-4 w-4 mr-1" /> Tải lên ảnh
            </Button>
          </div>

          {images.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Chưa có hình ảnh nào cho buổi học này</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-video relative bg-muted">
                    <img 
                      src={imageService.getPublicUrl("images", image.image || "")} 
                      alt={image.caption || "Hình ảnh buổi học"} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-2">
                    <p className="text-sm text-muted-foreground truncate">{image.caption || "Hình ảnh buổi học"}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="evaluation" className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((index) => {
              const key = `nhan_xet_${index}` as keyof TeachingSession;
              const value = session[key];
              return (
                <Card key={index}>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Tiêu chí {index}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-2xl font-semibold text-center">{value || "-"}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-4">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Điểm trung bình</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-2xl font-semibold text-center">{session.trung_binh?.toFixed(1) || "-"}</p>
            </CardContent>
          </Card>

          {session.nhan_xet_chung && (
            <div className="mt-4">
              <h3 className="font-semibold">Nhận xét chung</h3>
              <p className="mt-1 whitespace-pre-line">{session.nhan_xet_chung}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Image Upload Dialog */}
      <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tải lên hình ảnh</DialogTitle>
          </DialogHeader>
          <ImageUploadForm 
            sessionId={session.id} 
            onUploadComplete={handleImageUploadComplete}
            onCancel={() => setShowImageUpload(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Assignment Form Dialog */}
      <Dialog open={showAssignmentForm} onOpenChange={setShowAssignmentForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm bài tập mới</DialogTitle>
          </DialogHeader>
          <AssignmentForm 
            teachingSessionId={session.id}
            classId={session.lop_chi_tiet_id}
            onSubmit={handleAssignmentSubmit}
            onCancel={() => setShowAssignmentForm(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionDetail;
