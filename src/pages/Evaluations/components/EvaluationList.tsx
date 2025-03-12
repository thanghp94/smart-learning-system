
import React from 'react';
import { format } from 'date-fns';
import { Plus, FileDown, Filter, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/DataTable';
import { TeachingSession } from '@/lib/types';

interface EvaluationListProps {
  evaluations: TeachingSession[];
  isLoading: boolean;
  onRowClick: (evaluation: TeachingSession) => void;
  onAddClick: () => void;
  onRefresh: () => void;
  getClassName: (classId: string) => string;
  getTeacherName: (teacherId: string) => string;
}

const EvaluationList: React.FC<EvaluationListProps> = ({
  evaluations,
  isLoading,
  onRowClick,
  onAddClick,
  onRefresh,
  getClassName,
  getTeacherName
}) => {
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
      <Button variant="outline" size="sm" className="h-8" onClick={onRefresh}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm đánh giá
      </Button>
    </div>
  );

  return (
    <>
      <div className="mb-4">{tableActions}</div>
      <DataTable
        columns={columns}
        data={evaluations}
        isLoading={isLoading}
        onRowClick={onRowClick}
        searchable={true}
        searchPlaceholder="Tìm kiếm đánh giá..."
      />
    </>
  );
};

export default EvaluationList;
