
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { Session } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import DetailPanel from "@/components/ui/DetailPanel";
import LessonDetail from "./LessonDetail";
import LessonForm from "./LessonForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import { format } from "date-fns";

const Lessons = () => {
  const [lessons, setLessons] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Session | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  // Sample data for development
  const sampleLessons: Session[] = [
    {
      id: "1",
      unit_id: "1",
      buoi_hoc_so: "1",
      noi_dung_bai_hoc: "Giới thiệu về phương pháp học tập",
      tsi_lesson_plan: "Làm quen với học sinh và giới thiệu phương pháp học tập",
      rep_lesson_plan: "Giới thiệu và làm các bài tập nhóm",
      bai_tap: "Bài tập về nhà: Đọc chương 1",
      tg_tao: new Date().toISOString()
    },
    {
      id: "2",
      unit_id: "1",
      buoi_hoc_so: "2",
      noi_dung_bai_hoc: "Luyện tập kỹ năng cơ bản",
      tsi_lesson_plan: "Thực hành các kỹ năng đã học",
      rep_lesson_plan: "Chia nhóm và làm bài tập thực hành",
      bai_tap: "Bài tập về nhà: Hoàn thành phần bài tập",
      tg_tao: new Date().toISOString()
    }
  ];

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        setLessons(sampleLessons);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách bài học",
        variant: "destructive"
      });
    }
  };

  const handleRowClick = (lesson: Session) => {
    setSelectedLesson(lesson);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddFormCancel = () => {
    setShowAddForm(false);
  };

  const handleAddFormSubmit = async (formData: Partial<Session>) => {
    try {
      // In a real app, this would be an API call
      const newLesson: Session = {
        id: String(lessons.length + 1),
        unit_id: formData.unit_id || "",
        buoi_hoc_so: formData.buoi_hoc_so || "",
        noi_dung_bai_hoc: formData.noi_dung_bai_hoc || "",
        tsi_lesson_plan: formData.tsi_lesson_plan,
        rep_lesson_plan: formData.rep_lesson_plan,
        bai_tap: formData.bai_tap,
        tg_tao: new Date().toISOString()
      };
      
      setLessons([...lessons, newLesson]);
      toast({
        title: "Thành công",
        description: "Thêm bài học mới thành công",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding lesson:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm bài học mới",
        variant: "destructive"
      });
    }
  };

  const columns = [
    {
      title: "Buổi Học Số",
      key: "buoi_hoc_so",
      sortable: true,
    },
    {
      title: "Nội Dung Bài Học",
      key: "noi_dung_bai_hoc",
    },
    {
      title: "Unit ID",
      key: "unit_id",
    },
    {
      title: "Ngày Tạo",
      key: "tg_tao",
      sortable: true,
      render: (value: string) => value ? format(new Date(value), 'dd/MM/yyyy') : '',
    }
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchLessons}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Bài Học
      </Button>
    </div>
  );

  return (
    <>
      {lessons.length === 0 && !isLoading ? (
        <PlaceholderPage
          title="Bài Học"
          description="Quản lý thông tin bài học"
          addButtonAction={handleAddClick}
        />
      ) : (
        <TablePageLayout
          title="Bài Học"
          description="Quản lý thông tin bài học"
          actions={tableActions}
        >
          <DataTable
            columns={columns}
            data={lessons}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            searchable={true}
            searchPlaceholder="Tìm kiếm bài học..."
          />
        </TablePageLayout>
      )}

      {selectedLesson && (
        <DetailPanel
          title="Thông Tin Bài Học"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <LessonDetail lesson={selectedLesson} />
        </DetailPanel>
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Bài Học Mới</DialogTitle>
          </DialogHeader>
          <LessonForm 
            onSubmit={handleAddFormSubmit}
            onCancel={handleAddFormCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Lessons;
