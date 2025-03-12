
import React, { useState, useEffect } from 'react';
import { candidateService, Candidate, CandidateStatus } from '@/lib/supabase/recruitment-service';
import { useToast } from '@/hooks/use-toast';
import KanbanColumn from './components/KanbanColumn';
import CandidateDetail from './components/CandidateDetail';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface KanbanViewProps {
  onCandidateEdit: (id: string) => void;
}

const RECRUITMENT_STATUS: Record<CandidateStatus, string> = {
  new_application: 'Hồ sơ mới',
  cv_reviewing: 'Đang xem xét CV',
  interview_scheduled: 'Đã lên lịch phỏng vấn',
  passed_interview: 'Đã qua phỏng vấn',
  offer_sent: 'Đã gửi đề nghị',
  hired: 'Đã tuyển',
  rejected: 'Từ chối'
};

const KanbanView: React.FC<KanbanViewProps> = ({ onCandidateEdit }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
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

  const getCandidatesByStatus = (status: CandidateStatus) => {
    return candidates.filter(candidate => candidate.current_status === status);
  };

  const handleDragStart = (e: React.DragEvent, candidate: Candidate) => {
    e.dataTransfer.setData('candidateId', candidate.id);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = async (e: React.DragEvent, status: CandidateStatus) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('candidateId');

    // Find the candidate that was dragged
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate || candidate.current_status === status) return;

    // Update status in UI immediately for responsive feel
    setCandidates(prev => prev.map(c => c.id === candidateId ? {
      ...c,
      current_status: status
    } : c));

    // Then update in database
    try {
      await candidateService.updateStatus(candidateId, status);
      toast({
        title: 'Cập nhật trạng thái',
        description: `${candidate.full_name} đã được chuyển sang ${RECRUITMENT_STATUS[status]}`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      // Rollback UI change
      setCandidates(prev => prev.map(c => c.id === candidateId ? {
        ...c,
        current_status: candidate.current_status
      } : c));
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái',
        variant: 'destructive'
      });
    }
  };

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedCandidate(null);
  };

  const handleEdit = () => {
    if (selectedCandidate) {
      onCandidateEdit(selectedCandidate.id);
      handleCloseDetail();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statuses: CandidateStatus[] = [
    'new_application',
    'cv_reviewing',
    'interview_scheduled',
    'passed_interview',
    'offer_sent',
    'hired'
  ];

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {statuses.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            title={RECRUITMENT_STATUS[status]}
            candidates={getCandidatesByStatus(status)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onCandidateClick={handleCandidateClick}
          />
        ))}
      </div>

      {/* Candidate Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Chi tiết ứng viên
            </DialogTitle>
          </DialogHeader>
          {selectedCandidate && (
            <CandidateDetail 
              candidate={selectedCandidate} 
              onEdit={handleEdit}
              onClose={handleCloseDetail}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanView;
