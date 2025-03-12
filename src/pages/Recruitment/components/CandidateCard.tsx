
import React from 'react';
import { Candidate } from '@/lib/supabase/recruitment-service';
import { format } from 'date-fns';
import { Briefcase, Calendar, Mail, Phone } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  onDragStart: (e: React.DragEvent, candidate: Candidate) => void;
  onClick: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onDragStart,
  onClick,
}) => {
  return (
    <div
      className="bg-card rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      draggable
      onDragStart={(e) => onDragStart(e, candidate)}
      onClick={onClick}
    >
      <div className="font-medium mb-2 truncate">{candidate.full_name}</div>
      
      {candidate.position_title && (
        <div className="flex items-center text-xs text-muted-foreground mb-1">
          <Briefcase className="h-3 w-3 mr-1" />
          <span className="truncate">{candidate.position_title}</span>
        </div>
      )}
      
      {candidate.email && (
        <div className="flex items-center text-xs text-muted-foreground mb-1">
          <Mail className="h-3 w-3 mr-1" />
          <span className="truncate">{candidate.email}</span>
        </div>
      )}
      
      {candidate.phone && (
        <div className="flex items-center text-xs text-muted-foreground mb-1">
          <Phone className="h-3 w-3 mr-1" />
          <span>{candidate.phone}</span>
        </div>
      )}
      
      {candidate.applied_date && (
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{format(new Date(candidate.applied_date), 'dd/MM/yyyy')}</span>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;
