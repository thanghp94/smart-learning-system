
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PenSquare, Trash2, Calendar, Clock, User, Users, Image as ImageIcon } from 'lucide-react';
import { formatDate, formatTime } from '@/utils/format';
import { teachingSessionService } from '@/lib/supabase/teaching-session-service';
import { TeachingSession } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import EnrollmentsTable from '@/pages/Enrollments/EnrollmentsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploadForm from './ImageUploadForm';
import { imageService } from '@/lib/supabase/image-service';
import { Image } from '@/lib/types';
import AssignmentList from './AssignmentList';

interface SessionDetailProps {
  sessionId: string;
  onUpdate?: () => void;
}

const SessionDetail: React.FC<SessionDetailProps> = ({ sessionId, onUpdate }) => {
  const [session, setSession] = useState<TeachingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const data = await teachingSessionService.getById(sessionId);
        setSession(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Could not load session details');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  useEffect(() => {
    const fetchImages = async () => {
      if (session) {
        try {
          const images = await imageService.getByEntity('teaching_session', session.id);
          setImages(images);
        } catch (err) {
          console.error('Error fetching images:', err);
        }
      }
    };

    fetchImages();
  }, [session]);

  const handleDelete = async () => {
    try {
      await teachingSessionService.delete(sessionId);
      toast({
        title: 'Thành công',
        description: 'Buổi dạy đã được xóa'
      });
      navigate('/teaching-sessions');
    } catch (err) {
      console.error('Error deleting session:', err);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa buổi dạy',
        variant: 'destructive'
      });
    }
  };

  const handleImageUpload = async () => {
    setIsImageDialogOpen(false);
    
    if (session) {
      try {
        const images = await imageService.getByEntity('teaching_session', session.id);
        setImages(images);
        toast({
          title: 'Thành công',
          description: 'Hình ảnh đã được tải lên'
        });
      } catch (err) {
        console.error('Error refreshing images:', err);
      }
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error || !session) {
    return <Alert variant="destructive"><AlertDescription>{error || 'Không tìm thấy thông tin buổi dạy'}</AlertDescription></Alert>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Chi tiết buổi dạy</h2>
          <p className="text-muted-foreground">
            {formatDate(session.ngay_hoc)} | {formatTime(session.thoi_gian_bat_dau)} - {formatTime(session.thoi_gian_ket_thuc)}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <ImageIcon className="h-4 w-4" /> Ảnh buổi dạy
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tải lên hình ảnh buổi dạy</DialogTitle>
              </DialogHeader>
              <ImageUploadForm 
                entityType="teaching_session"
                entityId={session.id}
                onSuccess={handleImageUpload}
              />
            </DialogContent>
          </Dialog>
          <Button onClick={() => navigate(`/teaching-sessions/edit/${sessionId}`)} className="flex items-center gap-1">
            <PenSquare className="h-4 w-4" /> Sửa
          </Button>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-1">
                <Trash2 className="h-4 w-4" /> Xóa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xác nhận xóa</DialogTitle>
              </DialogHeader>
              <p>Bạn có chắc chắn muốn xóa buổi dạy này không? Hành động này không thể hoàn tác.</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
                <Button variant="destructive" onClick={handleDelete}>Xóa</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Thông tin</TabsTrigger>
          <TabsTrigger value="enrollments">Điểm danh</TabsTrigger>
          <TabsTrigger value="assignments">Bài tập</TabsTrigger>
          <TabsTrigger value="images">Hình ảnh</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin buổi dạy</CardTitle>
              <CardDescription>Chi tiết về buổi dạy và đánh giá</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Lớp</Label>
                  <p className="font-medium">{session.lop_chi_tiet_id}</p>
                </div>
                <div>
                  <Label>Bài học</Label>
                  <p className="font-medium">{session.session_id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 opacity-70" />
                  <div>
                    <Label>Ngày học</Label>
                    <p className="font-medium">{formatDate(session.ngay_hoc)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 opacity-70" />
                  <div>
                    <Label>Thời gian</Label>
                    <p className="font-medium">{formatTime(session.thoi_gian_bat_dau)} - {formatTime(session.thoi_gian_ket_thuc)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 opacity-70" />
                  <div>
                    <Label>Giáo viên</Label>
                    <p className="font-medium">{session.giao_vien}</p>
                  </div>
                </div>
                {session.tro_giang && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 opacity-70" />
                    <div>
                      <Label>Trợ giảng</Label>
                      <p className="font-medium">{session.tro_giang}</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />
              
              <div>
                <Label>Đánh giá</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  {session.nhan_xet_1 && (
                    <div>
                      <Label>Đánh giá 1</Label>
                      <p>{session.nhan_xet_1}</p>
                    </div>
                  )}
                  {session.nhan_xet_2 && (
                    <div>
                      <Label>Đánh giá 2</Label>
                      <p>{session.nhan_xet_2}</p>
                    </div>
                  )}
                  {session.nhan_xet_3 && (
                    <div>
                      <Label>Đánh giá 3</Label>
                      <p>{session.nhan_xet_3}</p>
                    </div>
                  )}
                  {session.nhan_xet_4 && (
                    <div>
                      <Label>Đánh giá 4</Label>
                      <p>{session.nhan_xet_4}</p>
                    </div>
                  )}
                  {session.nhan_xet_5 && (
                    <div>
                      <Label>Đánh giá 5</Label>
                      <p>{session.nhan_xet_5}</p>
                    </div>
                  )}
                  {session.nhan_xet_6 && (
                    <div>
                      <Label>Đánh giá 6</Label>
                      <p>{session.nhan_xet_6}</p>
                    </div>
                  )}
                </div>
                
                {session.trung_binh && (
                  <div className="mt-4">
                    <Label>Điểm trung bình</Label>
                    <p className="font-bold text-lg">{session.trung_binh}</p>
                  </div>
                )}
                
                {session.nhan_xet_chung && (
                  <div className="mt-4">
                    <Label>Nhận xét chung</Label>
                    <p>{session.nhan_xet_chung}</p>
                  </div>
                )}
              </div>
              
              {session.ghi_chu && (
                <div>
                  <Label>Ghi chú</Label>
                  <p>{session.ghi_chu}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-6">
              <p className="text-xs text-muted-foreground">
                Last updated: {formatDate(session.updated_at)}
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="enrollments">
          <Card>
            <CardHeader>
              <CardTitle>Điểm danh</CardTitle>
              <CardDescription>Danh sách học sinh và tình trạng điểm danh</CardDescription>
            </CardHeader>
            <CardContent>
              <EnrollmentsTable classId={session.lop_chi_tiet_id} sessionId={session.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentList 
            teachingSessionId={session.id}
            classId={session.lop_chi_tiet_id}
          />
        </TabsContent>
        
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh buổi dạy</CardTitle>
              <CardDescription>Hình ảnh được chụp trong buổi dạy</CardDescription>
            </CardHeader>
            <CardContent>
              {images.length === 0 ? (
                <p className="text-muted-foreground">Chưa có hình ảnh nào. Nhấn "Ảnh buổi dạy" để tải lên.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map(image => {
                    const imageUrl = image.image ? image.image : '';
                    return (
                      <div key={image.id} className="relative aspect-square rounded-md overflow-hidden bg-muted">
                        <img 
                          src={imageUrl}
                          alt={image.caption || 'Teaching session image'}
                          className="object-cover w-full h-full hover:scale-105 transition-transform"
                        />
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                            {image.caption}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => setIsImageDialogOpen(true)}
              >
                <ImageIcon className="h-4 w-4" /> Tải lên thêm ảnh
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionDetail;
