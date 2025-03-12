
import React, { useState, useEffect } from 'react';
import { candidateService, Candidate, CandidateStatus } from '@/lib/supabase/recruitment-service';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/DataTable';
import { format } from 'date-fns';
import EmailButton from '@/components/common/EmailButton';

interface CandidatesTableProps {
  onRowClick: (id: string) => void;
  onAddClick: () => void;
}

const STATUS_LABELS: Record<CandidateStatus, string> = {
  new_application: 'Hồ sơ mới',
  cv_reviewing: 'Đang xem xét CV',
  interview_scheduled: 'Đã lên lịch phỏng vấn',
  passed_interview: 'Đã qua phỏng vấn',
  offer_sent: 'Đã gửi đề nghị',
  hired: 'Đã tuyển',
  rejected: 'Từ chối'
};

const STATUS_VARIANTS: Record<CandidateStatus, string> = {
  new_application: 'default',
  cv_reviewing: 'secondary',
  interview_scheduled: 'default',
  passed_interview: 'success',
  offer_sent: 'warning',
  hired: 'success',
  rejected: 'destructive'
};

const CandidatesTable: React.FC<CandidatesTableProps> = ({ onRowClick, onAddClick }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setIsLoading(true);
      const data = await candidateService.getAll();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách ứng viên',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Họ Tên",
      key: "full_name",
      sortable: true,
    },
    {
      title: "Email",
      key: "email",
      sortable: true,
    },
    {
      title: "Điện thoại",
      key: "phone",
      sortable: true,
    },
    {
      title: "Vị trí ứng tuyển",
      key: "position_title",
      sortable: true,
      render: (value: string) => value || 'Chưa xác định',
    },
    {
      title: "Kinh nghiệm",
      key: "years_of_experience",
      sortable: true,
      render: (value: number) => value ? `${value} năm` : 'Chưa có',
    },
    {
      title: "Ngày ứng tuyển",
      key: "applied_date",
      sortable: true,
      render: (value: string) => value ? format(new Date(value), 'dd/MM/yyyy') : 'N/A',
    },
    {
      title: "Trạng thái",
      key: "current_status",
      sortable: true,
      render: (value: CandidateStatus) => (
        <Badge variant={STATUS_VARIANTS[value] as any}>
          {STATUS_LABELS[value]}
        </Badge>
      ),
    },
    {
      title: "Liên hệ",
      key: "actions",
      render: (_: any, candidate: Candidate) => (
        <div className="flex space-x-2">
          <EmailButton 
            recipientEmail={candidate.email}
            recipientName={candidate.full_name}
            recipientType="candidate"
            size="sm"
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={candidates}
      isLoading={isLoading}
      onRowClick={(row: Candidate) => onRowClick(row.id)}
      searchable={true}
      searchPlaceholder="Tìm kiếm ứng viên..."
    />
  );
};

export default CandidatesTable;
