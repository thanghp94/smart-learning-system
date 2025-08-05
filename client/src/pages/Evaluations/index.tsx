
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import TablePageLayout from '@/components/common/TablePageLayout';
import PlaceholderPage from '@/components/common/PlaceholderPage';
import EvaluationList from './components/EvaluationList';
import EvaluationDetailPanel from './components/EvaluationDetailPanel';
import AddEvaluationDialog from './components/AddEvaluationDialog';
import { TeachingSession, Class, Employee } from '@/lib/types';
import { teachingSessionService, classService, employeeService } from "@/lib/database";
import { DEFAULT_EMPTY_SESSION } from './constants';

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
      
      // Use PostgreSQL API instead of teaching sessions
      const response = await fetch('/api/evaluations');
      if (!response.ok) {
        throw new Error('Failed to fetch evaluations');
      }
      
      const data = await response.json();
      console.log('Fetched evaluations:', data);
      
      // Fetch classes and teachers for displaying names
      const [classesData, teachersData] = await Promise.all([
        classService.getClasses(),
        fetch('/api/teachers').then(res => res.json()).catch(() => [])
      ]);
      
      // Create lookup objects for class and teacher data
      const classesLookup = (classesData || []).reduce((acc: any, cls: any) => {
        acc[cls.id] = cls;
        return acc;
      }, {} as Record<string, Class>);
      
      const teachersLookup = (teachersData || []).reduce((acc: any, teacher: any) => {
        acc[teacher.id] = teacher;
        return acc;
      }, {} as Record<string, Employee>);
      
      setClassesInfo(classesLookup);
      setTeachersInfo(teachersLookup);
      setEvaluations(data || []);
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
        >
          <EvaluationList 
            evaluations={evaluations}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            onAddClick={handleAddClick}
            onRefresh={fetchEvaluations}
            getClassName={getClassName}
            getTeacherName={getTeacherName}
          />
        </TablePageLayout>
      )}
      
      <EvaluationDetailPanel
        evaluation={selectedEvaluation}
        isOpen={showDetail}
        onClose={closeDetail}
        onSubmit={handleUpdateEvaluation}
        classInfo={selectedEvaluation ? classesInfo[selectedEvaluation.lop_chi_tiet_id || ''] : undefined}
        teacherInfo={selectedEvaluation ? teachersInfo[selectedEvaluation.giao_vien || ''] : undefined}
      />
      
      <AddEvaluationDialog
        isOpen={showAddForm}
        onClose={handleFormCancel}
        onSubmit={handleAddEvaluation}
        initialData={DEFAULT_EMPTY_SESSION as TeachingSession}
      />
    </>
  );
};

export default Evaluations;
