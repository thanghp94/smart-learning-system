
import React, { useState, useEffect } from 'react';
import { recruitmentPositionService, RecruitmentPosition } from '@/lib/supabase/recruitment-service';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/DataTable';
import { format } from 'date-fns';

interface PositionsTableProps {
  onRowClick: (id: string) => void;
  onAddClick: () => void;
}

const PositionsTable: React.FC<PositionsTableProps> = ({ onRowClick, onAddClick }) => {
  const [positions, setPositions] = useState<RecruitmentPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setIsLoading(true);
      const data = await recruitmentPositionService.getAll();
      setPositions(data);
    } catch (error) {
      console.error('Error fetching positions:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách vị trí tuyển dụng',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Tiêu đề",
      key: "title",
      sortable: true,
    },
    {
      title: "Phòng ban",
      key: "department",
      sortable: true,
    },
    {
      title: "Trạng thái",
      key: "is_active",
      sortable: true,
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Đang tuyển' : 'Đã đóng'}
        </Badge>
      ),
    },
    {
      title: "Ngày tạo",
      key: "created_at",
      sortable: true,
      render: (value: string) => format(new Date(value), 'dd/MM/yyyy'),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={positions}
      isLoading={isLoading}
      onRowClick={(row: RecruitmentPosition) => onRowClick(row.id)}
      searchable={true}
      searchPlaceholder="Tìm kiếm vị trí tuyển dụng..."
    />
  );
};

export default PositionsTable;
