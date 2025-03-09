import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { teachingSessionService, classService, employeeService } from "@/lib/supabase";
import { TeachingSession, Class, Employee, Evaluation } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import DetailPanel from "@/components/ui/DetailPanel";
import EvaluationForm from "./EvaluationForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Evaluations = () => {
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [classes, setClasses] = useState<Record<string, Class>>({});
  const [teachers, setTeachers] = useState<Record<string, Employee>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<TeachingSession | null>(null);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const sessionsData = await teachingSessionService.getWithAvgScore();
      setSessions(sessionsData);
      
      const classIds = [...new Set(sessionsData.map(s => s.lop_chi_tiet_id))];
      const teacherIds = [...new Set(sessionsData.map(s => s.giao_vien))];
      
      const [classesData, teachersData] = await Promise.all([
        Promise.all(classIds.map(id => classService.getById(id))),
        Promise.all(teacherIds.map(id => employeeService.getById(id)))
      ]);
      
      const classesDict = classesData.reduce((acc, cls) => {
        if (cls) {
          const normalizedClass = {
            ...cls,
            id: cls.id || crypto.randomUUID(),
            ten_lop_full: cls.ten_lop_full || cls.Ten_lop_full || '',
            ten_lop: cls.ten_lop || '',
            ct_hoc: cls.ct_hoc || '',
            co_so: cls.co_so || '',
            gv_chinh: cls.gv_chinh || '',
            tinh_trang: cls.tinh_trang || 'pending'
          } as Class;
          acc[normalizedClass.id] = normalizedClass;
        }
        return acc;
      }, {} as Record<string, Class>);
      
      const teachersDict = teachersData.reduce((acc, teacher) => {
        if (teacher) acc[teacher.id] = teacher;
        return acc;
      }, {} as Record<string, Employee>);
      
      setClasses(classesDict);
      setTeachers(teachersDict);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu đánh giá",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluateSession = (session: TeachingSession) => {
    setSelectedSession(session);
    setShowEvaluationForm(true);
  };

  const handleSubmitEvaluation = async (evaluationData: Partial<TeachingSession>) => {
    try {
      if (!selectedSession) return;
      
      const scores = [
        Number(evaluationData.nhan_xet_1 || 0),
        Number(evaluationData.nhan_xet_2 || 0),
        Number(evaluationData.nhan_xet_3 || 0),
        Number(evaluationData.nhan_xet_4 || 0),
        Number(evaluationData.nhan_xet_5 || 0),
        Number(evaluationData.nhan_xet_6 || 0)
      ].filter(score => score > 0);
      
      const avg = scores.length > 0 
        ? scores.reduce((acc, score) => acc + score, 0) / scores.length
        : 0;
      
      await teachingSessionService.update(selectedSession.id, {
        ...evaluationData,
        trung_binh: avg
      });
      
      toast({
        title: "Thành công",
        description: "Đã cập nhật đánh giá buổi học",
      });
      
      setShowEvaluationForm(false);
      fetchData();
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật đánh giá",
        variant: "destructive"
      });
    }
  };

  const columns = [
    {
      title: "Lớp",
      key: "lop_chi_tiet_id",
      sortable: true,
      render: (value: string) => <span>{classes[value]?.Ten_lop_full || value}</span>,
    },
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
      title: "Giáo viên",
      key: "giao_vien",
      sortable: true,
      render: (value: string) => <span>{teachers[value]?.ten_nhan_su || value}</span>,
    },
    {
      title: "Đánh giá TB",
      key: "trung_binh",
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{value?.toFixed(1) || "N/A"}</span>
        </div>
      ),
    },
    {
      title: "Loại bài học",
      key: "loai_bai_hoc",
      sortable: true,
    },
    {
      title: "",
      key: "actions",
      render: (_: any, record: TeachingSession) => (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            handleEvaluateSession(record);
          }}
        >
          Đánh giá
        </Button>
      ),
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
    </div>
  );

  return (
    <TablePageLayout
      title="Đánh Giá Buổi Dạy"
      description="Quản lý đánh giá chất lượng buổi dạy trong hệ thống"
      actions={tableActions}
    >
      <DataTable
        columns={columns}
        data={sessions}
        isLoading={isLoading}
        searchable={true}
        searchPlaceholder="Tìm kiếm buổi học..."
      />

      <Dialog open={showEvaluationForm} onOpenChange={setShowEvaluationForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Đánh Giá Buổi Dạy</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <EvaluationForm 
              initialData={selectedSession} 
              onSubmit={handleSubmitEvaluation}
              classInfo={classes[selectedSession.lop_chi_tiet_id]}
              teacherInfo={teachers[selectedSession.giao_vien]}
            />
          )}
        </DialogContent>
      </Dialog>
    </TablePageLayout>
  );
};

export default Evaluations;
