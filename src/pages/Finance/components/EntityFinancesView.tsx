
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Finance, Student, Employee, Contact } from '@/lib/types';
import { financeService, studentService, employeeService, contactService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import DataTable from '@/components/ui/DataTable';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface EntityFinancesViewProps {
  entityType: 'student' | 'employee' | 'contact';
  entityId?: string;
}

const EntityFinancesView: React.FC<EntityFinancesViewProps> = ({ entityType, entityId }) => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [entities, setEntities] = useState<(Student | Employee | Contact)[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(entityId || null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEntities();
  }, [entityType]);

  useEffect(() => {
    if (selectedEntity) {
      fetchFinances(selectedEntity);
    }
  }, [selectedEntity]);

  const fetchEntities = async () => {
    try {
      setIsLoading(true);
      let data: any[] = [];
      
      switch (entityType) {
        case 'student':
          data = await studentService.getAll();
          break;
        case 'employee':
          data = await employeeService.getAll();
          break;
        case 'contact':
          data = await contactService.getAll();
          break;
      }
      
      setEntities(data);
      
      // If we have an entity ID and no selected entity, set it
      if (entityId && !selectedEntity) {
        setSelectedEntity(entityId);
      }
    } catch (error) {
      console.error(`Error fetching ${entityType}s:`, error);
      toast({
        title: 'Lỗi',
        description: `Không thể tải danh sách ${getEntityLabel()}`,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFinances = async (id: string) => {
    try {
      setIsLoading(true);
      
      const data = await financeService.getByEntityId(entityType, id);
      setFinances(data);
    } catch (error) {
      console.error('Error fetching finances:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu tài chính',
        variant: 'destructive'
      });
      setFinances([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getEntityLabel = () => {
    switch (entityType) {
      case 'student':
        return 'học sinh';
      case 'employee':
        return 'nhân viên';
      case 'contact':
        return 'liên hệ';
      default:
        return 'đối tượng';
    }
  };

  const getEntityName = (entity: Student | Employee | Contact) => {
    if (entityType === 'student') {
      return (entity as Student).ten_hoc_sinh;
    } else if (entityType === 'employee') {
      return (entity as Employee).ten_nhan_su;
    } else {
      return (entity as Contact).ten_lien_he;
    }
  };

  const columns = [
    {
      title: 'Ngày',
      key: 'ngay',
      sortable: true,
      render: (value: string) => <span>{value || "-"}</span>
    },
    {
      title: 'Loại',
      key: 'loai_thu_chi',
      sortable: true,
      render: (value: string) => (
        <span className={value === 'thu' ? 'text-green-600' : 'text-red-600'}>
          {value === 'thu' ? 'Thu' : 'Chi'}
        </span>
      )
    },
    {
      title: 'Số tiền',
      key: 'tong_tien',
      sortable: true,
      render: (value: number) => (
        <span>{formatCurrency(value)}</span>
      )
    },
    {
      title: 'Diễn giải',
      key: 'dien_giai',
      render: (value: string) => <span>{value || "-"}</span>
    },
    {
      title: 'Trạng thái',
      key: 'tinh_trang',
      sortable: true,
      render: (value: string) => <span>{value || "Pending"}</span>
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tài chính của {getEntityLabel()}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {selectedEntity ? (
              <DataTable
                columns={columns}
                data={finances}
                isLoading={isLoading}
                searchable={true}
                searchPlaceholder={`Tìm kiếm giao dịch...`}
              />
            ) : (
              <div className="text-center p-4">
                <p>Vui lòng chọn {getEntityLabel()} để xem thông tin tài chính</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EntityFinancesView;
