import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import TablePageLayout from '@/components/common/TablePageLayout';
import DataTable from '@/components/ui/DataTable';
import DetailPanel from '@/components/ui/DetailPanel';
import { Class, Employee, TeachingSession } from '@/lib/types';
import { teachingSessionService } from '@/lib/supabase/teaching-session-service';
import { sessionService } from '@/lib/supabase/session-service';
import { classService, employeeService } from '@/lib/supabase';
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { Plus, FileDown, Filter, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EvaluationForm from './EvaluationForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PlaceholderPage from '@/components/common/PlaceholderPage';

// Default empty session for new evaluation forms
const DEFAULT_EMPTY_SESSION: Partial<TeachingSession> = {
  id: '',
  lop_chi_tiet_id: '',
  session_id: '',
  loai_bai_hoc: '',
  ngay_hoc: new Date().toISOString().split('T')[0],
  thoi_gian_bat_dau: '09:00',
  thoi_gian_ket_thuc: '10:30',
  giao_vien: '',
  nhan_xet_1: null,
  nhan_xet_2: null,
  nhan_xet_3: null,
  nhan_xet_4: null,
  nhan_xet_5: null,
  nhan_xet_6: null,
  trung_binh: null,
  phong_hoc_id: null,
  tro_giang: null,
  nhan_xet_chung: null,
  ghi_chu: null
};

const Evaluations = () => {
  const [evaluations, setEvaluations] = useState<TeachingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState<TeachingSession | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [classesInfo, setClassesInfo] = useState<Record<string, Class>>({});
  const [teachersInfo, setTeachersInfo] = useState<Record<string, Employee>>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchEvaluations();
  }, []);
  
  const fetchEvaluations = async () => {
    try {
      setIsLoading(true);
      
      // Fetch teaching sessions with average score
      const data = await teachingSessionService.getWithAvgScore();
      console.log('Fetched teaching sessions:', data);
      
      // Fetch classes and teachers for displaying names
      const [classesData, teachersData] = await Promise.all([
        classService.getAll(),
        employeeService.getByRole("Giáo viên")
      ]);
      
      // Create lookup objects for class and teacher data
      const classesLookup = classesData.reduce((acc, cls) => {
        acc[cls.id] = cls;
        return acc;
      }, {} as Record<string, Class>);
      
      const teachersLookup = teachersData.reduce((acc, teacher) => {
        acc[teacher.id] = teacher;
        return acc;
      }, {} as Record<string, Employee>);
      
      setClassesInfo(classesLookup);
      setTeachersInfo(teachersLookup);
      setEvaluations(data);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách đánh giá",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRowClick = (evaluation: TeachingSession) => {
    setSelectedEvaluation(evaluation);
    setShowDetail(true);
  };
  
  const closeDetail = () => {
    setShowDetail(false);
    setSelectedEvaluation(null);
  };
  
  const handleAddClick = () => {
    setSelectedEvaluation(DEFAULT_EMPTY_SESSION as TeachingSession);
    setShowAddForm(true);
  };
  
  const handleFormCancel = () => {
    setShowAddForm(false);
  };
  
  const handleAddEvaluation = async (formData: Partial<TeachingSession>) => {
    try {
      setIsLoading(true);
      
      // Create new teaching session
      const newSession = await teachingSessionService.create(formData);
      
      if (newSession) {
        toast({
          title: "Thành công",
          description: "Đã thêm đánh giá mới"
        });
        
        // Refresh the evaluations list
        fetchEvaluations();
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding session:', error);
      toast({
        title: "Lỗi",
        description: `Không thể thêm đánh giá: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateEvaluation = async (updatedData: Partial<TeachingSession>) => {
    if (!selectedEvaluation) return;
    
    try {
      setIsLoading(true);
      
      // Update the evaluation
      const updated = await teachingSessionService.update(selectedEvaluation.id, updatedData);
      
      if (updated) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật đánh giá"
        });
        
        // Refresh evaluations and close detail panel
        fetchEvaluations();
        closeDetail();
      }
    } catch (error) {
      console.error('Error updating evaluation:', error);
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật đánh giá: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getClassName = (classId: string) => {
    return classesInfo[classId]?.ten_lop_full || classesInfo[classId]?.Ten_lop_full || 'Unknown Class';
  };
  
  const getTeacherName = (teacherId: string) => {
    return teachersInfo[teacherId]?.ten_nhan_su || 'Unknown Teacher';
  };
  
  // Columns definition for DataTable
  const columns = [
    {
      title: "Lớp",
      key: "lop_chi_tiet_id",
      render: (value: string) => getClassName(value),
      sortable: true,
    },
    {
      title: "Giáo viên",
      key: "giao_vien",
      render: (value: string) => getTeacherName(value),
      sortable: true,
    },
    {
      title: "Ngày học",
      key: "ngay_hoc",
      render: (value: string) => value ? format(new Date(value), 'dd/MM/yyyy') : '',
      sortable: true,
    },
    {
      title: "Loại bài học",
      key: "loai_bai_hoc",
    },
    {
      title: "Điểm trung bình",
      key: "trung_binh",
      render: (value: number) => value ? value.toFixed(1) : 'N/A',
      sortable: true,
    }
  ];
  
  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchEvaluations}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm đánh giá
      </Button>
    </div>
  );
  
  return (
    <>
      {evaluations.length === 0 && !isLoading ? (
        <PlaceholderPage
          title="Đánh giá giảng dạy"
          description="Quản lý đánh giá giảng dạy của giáo viên"
          addButtonAction={handleAddClick}
        />
      ) : (
        <TablePageLayout
          title="Đánh giá giảng dạy"
          description="Quản lý đánh giá giảng dạy của giáo viên"
          actions={tableActions}
        >
          <DataTable
            columns={columns}
            data={evaluations}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            searchable={true}
            searchPlaceholder="Tìm kiếm đánh giá..."
          />
        </TablePageLayout>
      )}
      
      {selectedEvaluation && (
        <DetailPanel
          title="Chi tiết đánh giá"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <EvaluationForm
            initialData={selectedEvaluation}
            onSubmit={handleUpdateEvaluation}
            onCancel={closeDetail}
            classInfo={classesInfo[selectedEvaluation.lop_chi_tiet_id || '']}
            teacherInfo={teachersInfo[selectedEvaluation.giao_vien || '']}
          />
        </DetailPanel>
      )}
      
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Thêm đánh giá mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin đánh giá giảng dạy mới
            </DialogDescription>
          </DialogHeader>
          <EvaluationForm
            initialData={DEFAULT_EMPTY_SESSION as TeachingSession}
            onSubmit={handleAddEvaluation}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Evaluations;
