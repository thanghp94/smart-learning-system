import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Update the component props interface to include entityType:
export interface ViewEvaluationsButtonProps {
  enrollmentId: string;
  entityType?: string;
  title?: string;
}

const ViewEvaluationsButton: React.FC<ViewEvaluationsButtonProps> = ({ enrollmentId, entityType = 'enrollment', title = 'View Evaluations' }) => {
  const navigate = useNavigate();

  const handleViewEvaluations = () => {
    navigate(`/evaluations?entityId=${enrollmentId}&entityType=${entityType}`);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleViewEvaluations}>
      {title}
    </Button>
  );
};

export default ViewEvaluationsButton;
