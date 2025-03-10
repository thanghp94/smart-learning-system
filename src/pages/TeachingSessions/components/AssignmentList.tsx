
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AssignmentForm from './AssignmentForm';
import { StudentAssignment, studentAssignmentService } from '@/lib/supabase/student-assignment-service';
import { formatDate } from '@/utils/format';
import { useToast } from '@/hooks/use-toast';

interface AssignmentListProps {
  teachingSessionId: string;
  classId: string;
}

const AssignmentList: React.FC<AssignmentListProps> = ({ teachingSessionId, classId }) => {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await studentAssignmentService.getByTeachingSession(teachingSessionId);
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách bài tập',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [teachingSessionId]);

  const handleSaveAssignment = async (data: Partial<StudentAssignment>) => {
    try {
      await studentAssignmentService.create(data);
      setIsAddDialogOpen(false);
      toast({
        title: 'Thành công',
        description: 'Đã thêm bài tập mới'
      });
      fetchAssignments();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tạo bài tập',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Bài tập học sinh</h3>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Thêm bài tập
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Thêm bài tập mới</DialogTitle>
              <AssignmentForm 
                teachingSessionId={teachingSessionId}
                classId={classId}
                onSubmit={handleSaveAssignment}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : assignments.length === 0 ? (
          <p className="text-muted-foreground">Chưa có bài tập nào được giao</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Ngày giao</TableHead>
                <TableHead>Hạn nộp</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.tieu_de}</TableCell>
                  <TableCell>{formatDate(assignment.ngay_giao)}</TableCell>
                  <TableCell>{assignment.han_nop ? formatDate(assignment.han_nop) : 'Không có'}</TableCell>
                  <TableCell>{assignment.trang_thai}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentList;
