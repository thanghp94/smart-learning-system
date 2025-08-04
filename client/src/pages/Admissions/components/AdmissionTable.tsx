
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import { useToast } from '@/hooks/use-toast';
import { Admission } from '@/lib/types/admission';
import { admissionService } from "@/lib/database";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const AdmissionTable = () => {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        setIsLoading(true);
        const data = await admissionService.getAll();
        setAdmissions(data);
      } catch (error) {
        console.error('Error fetching admissions:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu tuyển sinh',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmissions();
  }, [toast]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const getStatusBadge = (status: string) => {
    const statusVariants: Record<string, string> = {
      'tim_hieu': 'bg-blue-100 text-blue-800',
      'tu_van': 'bg-yellow-100 text-yellow-800',
      'hoc_thu': 'bg-purple-100 text-purple-800',
      'chot': 'bg-green-100 text-green-800',
      'huy': 'bg-red-100 text-red-800'
    };
    
    const statusLabels: Record<string, string> = {
      'tim_hieu': 'Tìm hiểu',
      'tu_van': 'Tư vấn',
      'hoc_thu': 'Học thử',
      'chot': 'Đã chốt',
      'huy': 'Huỷ'
    };
    
    return (
      <Badge className={statusVariants[status] || 'bg-gray-100 text-gray-800'}>
        {statusLabels[status] || status}
      </Badge>
    );
  };

  const columns = [
    {
      title: 'Tên học sinh',
      key: 'ten_hoc_sinh',
      sortable: true,
    },
    {
      title: 'Email',
      key: 'email',
      sortable: true,
      render: (value: string) => value || '--',
    },
    {
      title: 'Số điện thoại',
      key: 'so_dien_thoai',
      sortable: true,
      render: (value: string) => value || '--',
    },
    {
      title: 'Tên phụ huynh',
      key: 'ten_phu_huynh',
      sortable: true,
      render: (value: string) => value || '--',
    },
    {
      title: 'Ngày sinh',
      key: 'ngay_sinh',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Trạng thái',
      key: 'trang_thai',
      sortable: true,
      render: (value: string) => getStatusBadge(value),
    },
    {
      title: 'Ngày liên hệ đầu',
      key: 'ngay_lien_he_dau',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={admissions}
      searchable={true}
      searchPlaceholder="Tìm kiếm học sinh..."
      isLoading={isLoading}
    />
  );
};

export default AdmissionTable;
