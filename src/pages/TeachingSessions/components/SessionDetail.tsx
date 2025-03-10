
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { TeachingSession } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Save, PlusCircle, FileText, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageUploadForm from './ImageUploadForm';
import AssignmentForm from './AssignmentForm';
import AssignmentList from './AssignmentList';

interface SessionDetailProps {
  session: TeachingSession;
  onSave: (updatedSession: Partial<TeachingSession>) => Promise<void>;
}

const SessionDetail: React.FC<SessionDetailProps> = ({ session, onSave }) => {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(session.ghi_chu || '');
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      await onSave({ ghi_chu: notes });
      setEditingNotes(false);
      toast({
        title: 'Thành công',
        description: 'Đã lưu ghi chú buổi học',
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu ghi chú. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline">Đã lên lịch</Badge>;
      case 'completed':
        return <Badge variant="success">Đã hoàn thành</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Đã hủy</Badge>;
      case 'in_progress':
        return <Badge variant="default">Đang diễn ra</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleImageUploadComplete = async (imageId: string, imagePath: string) => {
    setIsImageDialogOpen(false);
    toast({
      title: 'Tải ảnh thành công',
      description: 'Hình ảnh đã được thêm vào buổi học',
    });
    // You might want to refresh the session data here
  };

  const handleAssignmentAdded = async () => {
    setIsAssignmentDialogOpen(false);
    toast({
      title: 'Thành công',
      description: 'Đã thêm bài tập mới',
    });
    // You might want to refresh the session data here
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Buổi {session.buoi_so} - {session.unit_name}
          </h2>
          {formatStatus(session.trang_thai)}
        </div>
        <div className="text-muted-foreground">
          {session.ngay_hoc && format(new Date(session.ngay_hoc), 'dd/MM/yyyy')} | {session.gio_bat_dau} - {session.gio_ket_thuc}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="materials">Tài liệu</TabsTrigger>
          <TabsTrigger value="homework">Bài tập</TabsTrigger>
          <TabsTrigger value="attendance">Điểm danh</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 grid-cols-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Nội dung buổi học</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {session.noi_dung || 'Chưa có nội dung cho buổi học này.'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ghi chú</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setEditingNotes(!editingNotes)}
                  disabled={isSaving}
                >
                  {editingNotes ? (
                    <Save className="h-4 w-4 mr-1" />
                  ) : (
                    <Edit2 className="h-4 w-4 mr-1" />
                  )}
                  {editingNotes ? 'Lưu' : 'Sửa'}
                </Button>
              </CardHeader>
              <CardContent>
                {editingNotes ? (
                  <div className="space-y-4">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Nhập ghi chú về buổi học..."
                      rows={5}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setNotes(session.ghi_chu || '');
                          setEditingNotes(false);
                        }}
                        disabled={isSaving}
                      >
                        Hủy
                      </Button>
                      <Button 
                        onClick={handleSaveNotes}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Đang lưu...' : 'Lưu ghi chú'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    {notes || 'Chưa có ghi chú nào.'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Hình ảnh & Tài liệu</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setIsImageDialogOpen(true)}>
                  <Camera className="h-4 w-4 mr-1" /> Thêm hình ảnh
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" /> Thêm tài liệu
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Images would be displayed here */}
                <div className="flex items-center justify-center h-40 border rounded bg-gray-50 text-gray-400">
                  Chưa có hình ảnh
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homework">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Bài tập</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsAssignmentDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-1" /> Thêm bài tập
              </Button>
            </CardHeader>
            <CardContent>
              <AssignmentList sessionId={session.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Điểm danh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Dữ liệu điểm danh sẽ hiển thị ở đây
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image Upload Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tải lên hình ảnh</DialogTitle>
          </DialogHeader>
          <ImageUploadForm 
            sessionId={session.id}
            onUploadComplete={handleImageUploadComplete}
          />
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm bài tập mới</DialogTitle>
          </DialogHeader>
          <AssignmentForm 
            sessionId={session.id}
            onSuccess={handleAssignmentAdded}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionDetail;
