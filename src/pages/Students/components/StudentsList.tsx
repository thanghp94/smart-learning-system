
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, PenBox, Trash2, X, Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import DataTable from '@/components/ui/DataTable';
import { Student, Enrollment } from '@/lib/types';
import { studentService, enrollmentService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';
import StudentDetail from './StudentDetail';
import EnrollStudentButton from './EnrollStudentButton';

interface StudentsListProps {
  data: Student[];
  isLoading: boolean;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
}

const StudentsList: React.FC<StudentsListProps> = ({
  data,
  isLoading,
  onDelete,
  onRefresh,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentEnrollments, setStudentEnrollments] = useState<Enrollment[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const handleViewClick = async (student: Student) => {
    setSelectedStudent(student);
    
    // Fetch enrollments for this student
    if (student.id) {
      try {
        const enrollments = await enrollmentService.getByStudent(student.id);
        setStudentEnrollments(enrollments);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      }
    }
    
    setShowDetail(true);
  };

  const handleEditClick = (id: string) => {
    navigate(`/students/edit/${id}`);
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    
    try {
      await studentService.delete(studentToDelete.id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa học sinh',
      });
      
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
      
      if (onDelete) {
        onDelete(studentToDelete.id);
      }
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa học sinh',
        variant: 'destructive',
      });
    }
  };

  const columns = [
    {
      title: "Tên học sinh",
      key: "ten_hoc_sinh",
      sortable: true,
    },
    {
      title: "Phụ huynh",
      key: "ten_PH",
      sortable: true,
      render: (value: string) => value || '-',
    },
    {
      title: "Số điện thoại",
      key: "sdt_ph1",
      sortable: true,
      render: (value: string) => value || '-',
    },
    {
      title: "Ngày sinh",
      key: "ngay_sinh",
      sortable: true,
      render: (value: string) => (value ? formatDate(value) : '-'),
    },
    {
      title: "Hạn học phí",
      key: "han_hoc_phi",
      sortable: true,
      render: (value: string) => (value ? formatDate(value) : '-'),
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'destructive'}>
          {value === 'active' ? 'Đang học' : 'Đã nghỉ'}
        </Badge>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      sortable: false,
      render: (_: any, record: Student) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewClick(record)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEditClick(record.id)}
          >
            <PenBox className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(record)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <EnrollStudentButton
            student={record}
            onSuccess={onRefresh}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchable={true}
        searchPlaceholder="Tìm kiếm học sinh..."
      />

      {/* Use either Dialog on desktop or Drawer on mobile */}
      {isMobile ? (
        <Drawer open={showDetail} onOpenChange={setShowDetail}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex items-center justify-between">
                {selectedStudent?.ten_hoc_sinh}
                <Button variant="ghost" size="icon" onClick={() => setShowDetail(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </DrawerTitle>
              <DrawerDescription>
                Chi tiết thông tin học sinh
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-8">
              {selectedStudent && (
                <StudentDetail student={selectedStudent} />
              )}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thông tin học sinh: {selectedStudent?.ten_hoc_sinh}</DialogTitle>
              <DialogDescription>
                Chi tiết thông tin học sinh và danh sách lớp học đã ghi danh
              </DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <StudentDetail student={selectedStudent} />
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Xác nhận xóa học sinh
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa học sinh "{studentToDelete?.ten_hoc_sinh}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StudentsList;
