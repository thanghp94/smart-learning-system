
import React from 'react';
import { Candidate, CandidateStatus } from '@/lib/supabase/recruitment-service';
import CandidateCard from './CandidateCard';

interface KanbanColumnProps {
  status: CandidateStatus;
  title: string;
  candidates: Candidate[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: CandidateStatus) => void;
  onDragStart: (e: React.DragEvent, candidate: Candidate) => void;
  onCandidateClick: (candidate: Candidate) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  candidates,
  onDragOver,
  onDrop,
  onDragStart,
  onCandidateClick,
}) => {
  return (
    <div
      className="bg-muted/30 rounded-lg p-3 min-h-[500px] flex flex-col"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-sm">{title}</h3>
        <span className="bg-primary/10 text-primary text-xs font-medium rounded-full px-2 py-1">
          {candidates.length}
        </span>
      </div>
      
      <div className="space-y-2 overflow-auto">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onDragStart={onDragStart}
            onClick={() => onCandidateClick(candidate)}
          />
        ))}
        
        {candidates.length === 0 && (
          <div className="border border-dashed border-muted-foreground/20 rounded-lg p-4 text-center text-muted-foreground text-sm">
            Không có ứng viên
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
