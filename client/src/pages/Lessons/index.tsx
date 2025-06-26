
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import TablePageLayout from '@/components/common/TablePageLayout';
import DataTable from '@/components/ui/DataTable';
import { Session } from '@/lib/types';
import { sessionService } from '@/lib/supabase/session-service';
import { format } from 'date-fns';
import { Plus, FileDown, Filter, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlaceholderPage from '@/components/common/PlaceholderPage';

const Lessons = () => {
  const [lessons, setLessons] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      const data = await sessionService.getAll();
      setLessons(data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
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
    navigate(`/lessons/${lesson.id}`);
  };

  const handleAddClick = () => {
    navigate('/lessons/add');
  };

  const columns = [
    {
      title: "Buổi học số",
      key: "buoi_hoc_so",
      sortable: true,
    },
    {
      title: "Nội dung bài học",
      key: "noi_dung_bai_hoc",
      render: (value: string) => (
        <div className="max-w-md truncate">{value}</div>
      )
    },
    {
      title: "Unit ID",
      key: "unit_id",
      sortable: true,
    },
    {
      title: "Ngày tạo",
      key: "tg_tao",
      sortable: true,
      render: (value: string) => value ? format(new Date(value), 'dd/MM/yyyy') : '',
    }
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchLessons}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm bài học
      </Button>
    </div>
  );

  return (
    <>
      {lessons.length === 0 && !isLoading ? (
        <PlaceholderPage
          title="Bài học"
          description="Quản lý thông tin bài học"
          addButtonAction={handleAddClick}
        />
      ) : (
        <TablePageLayout
          title="Bài học"
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
    </>
  );
};

export default Lessons;
