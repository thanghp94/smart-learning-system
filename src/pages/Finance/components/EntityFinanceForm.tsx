
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FinanceForm from '../FinanceForm';
import { useToast } from '@/hooks/use-toast';

const EntityFinanceForm = ({ onSubmit, onCancel }) => {
  const location = useLocation();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  const entityType = queryParams.get('entityType');
  const entityId = queryParams.get('entityId');

  useEffect(() => {
    if (!entityType || !entityId) {
      toast({
        title: "Thiếu thông tin",
        description: "Thiếu thông tin về đối tượng thu chi",
        variant: "destructive"
      });
    }
  }, [entityType, entityId, toast]);

  return (
    <FinanceForm
      onSubmit={onSubmit}
      onCancel={onCancel}
      entityType={entityType || undefined}
      entityId={entityId || undefined}
    />
  );
};

export default EntityFinanceForm;
