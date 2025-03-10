
import React, { useState, useEffect } from "react";
import { Plus, Filter, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { Session } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import DetailPanel from "@/components/ui/DetailPanel";
import LessonDetail from "./LessonDetail";
import LessonForm from "./LessonForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase/client";
import ExportButton from "@/components/ui/ExportButton";

// Create a service for sessions
const sessionService = {
  getAll: async (): Promise<Session[]> => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching sessions:", error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error("Error in getAll sessions:", error);
      return [];
    }
  },
  
  create: async (sessionData: Partial<Session>): Promise<Session | null> => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert(sessionData)
        .select()
        .single();
      
      if (error) {
        console.error("Error creating session:", error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Error in create session:", error);
      throw error;
    }
  }
};

const Lessons = () => {
  const [lessons, setLessons] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Session | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      const data = await sessionService.getAll();
      console.log("Fetched sessions from database:", data);
      setLessons(data);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách bài học",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
      setIsLoading(true);
      const newLesson = await sessionService.create(formData);
      
      if (newLesson) {
        toast({
          title: "Thành công",
          description: "Thêm bài học mới thành công",
        });
        fetchLessons(); // Refresh the data
      }
      
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding lesson:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm bài học mới",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
      <ExportButton 
        data={lessons} 
        filename="Danh_sach_bai_hoc" 
        label="Xuất dữ liệu"
      />
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
            <DialogDescription>
              Nhập thông tin bài học mới vào biểu mẫu bên dưới
            </DialogDescription>
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
