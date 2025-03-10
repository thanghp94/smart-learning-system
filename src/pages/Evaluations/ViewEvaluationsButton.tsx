
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export interface ViewEvaluationsButtonProps {
  enrollmentId?: string;
  entityId?: string;
  entityType?: string;
  title?: string;
  studentId?: string;
  showAsSheet?: boolean;
}

const ViewEvaluationsButton: React.FC<ViewEvaluationsButtonProps> = ({ 
  enrollmentId, 
  entityId,
  entityType = 'enrollment', 
  title = 'View Evaluations',
  studentId,
  showAsSheet = false
}) => {
  const navigate = useNavigate();

  const handleViewEvaluations = () => {
    const id = enrollmentId || entityId || studentId;
    if (!id) {
      console.error('No ID provided to ViewEvaluationsButton');
      return;
    }
    
    navigate(`/evaluations?entityId=${id}&entityType=${entityType}`);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleViewEvaluations}>
      {title}
    </Button>
  );
};

export default ViewEvaluationsButton;
