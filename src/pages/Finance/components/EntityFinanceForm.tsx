
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FinanceForm from '../FinanceForm';
import { useToast } from '@/hooks/use-toast';

const EntityFinanceForm = ({ onSubmit, onCancel }) => {
  const location = useLocation();
  const navigate = useNavigate();
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
      navigate('/finance'); // Redirect to finance page if missing required params
    }
  }, [entityType, entityId, toast, navigate]);

  const handleFormSubmit = (data) => {
    // Ensure entity data is properly set
    const formData = {
      ...data,
      loai_doi_tuong: entityType,
      doi_tuong_id: entityId
    };
    
    onSubmit(formData);
  };

  return (
    <FinanceForm
      onSubmit={handleFormSubmit}
      onCancel={onCancel}
      entityType={entityType || undefined}
      entityId={entityId || undefined}
    />
  );
};

export default EntityFinanceForm;
