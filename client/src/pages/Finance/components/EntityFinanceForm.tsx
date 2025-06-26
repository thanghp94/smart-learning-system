
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FinanceForm from '../FinanceForm';
import { useToast } from '@/hooks/use-toast';
import { studentService, employeeService, facilityService } from '@/lib/supabase';

interface EntityFinanceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const EntityFinanceForm: React.FC<EntityFinanceFormProps> = ({ onSubmit, onCancel }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  const entityType = queryParams.get('entityType');
  const entityId = queryParams.get('entityId');
  const [entityName, setEntityName] = useState<string>('');

  useEffect(() => {
    if (!entityType || !entityId) {
      toast({
        title: "Thiếu thông tin",
        description: "Thiếu thông tin về đối tượng thu chi",
        variant: "destructive"
      });
      navigate('/finance'); // Redirect to finance page if missing required params
      return;
    }

    // Fetch entity name for display
    const fetchEntityName = async () => {
      try {
        let name = '';
        switch (entityType) {
          case 'hoc_sinh':
            const student = await studentService.getById(entityId);
            name = student?.ten_hoc_sinh || 'Học sinh';
            break;
          case 'nhan_vien':
            const employee = await employeeService.getById(entityId);
            name = employee?.ten_nhan_su || 'Nhân viên';
            break;
          case 'co_so':
            const facility = await facilityService.getById(entityId);
            name = facility?.ten_co_so || 'Cơ sở';
            break;
          default:
            name = 'Đối tượng';
        }
        setEntityName(name);
      } catch (error) {
        console.error('Error fetching entity details:', error);
      }
    };

    fetchEntityName();
  }, [entityType, entityId, toast, navigate]);

  const handleFormSubmit = (data: any) => {
    // Ensure entity data is properly set
    const formData = {
      ...data,
      loai_doi_tuong: entityType,
      doi_tuong_id: entityId
    };
    
    // If nguoi_tao is empty string, set it to null to avoid UUID parsing error
    if (formData.nguoi_tao === '') {
      formData.nguoi_tao = null;
    }
    
    // Make sure co_so is a valid UUID or null
    if (formData.co_so === '') {
      formData.co_so = null;
    }
    
    onSubmit(formData);
  };

  return (
    <div>
      {entityName && (
        <div className="mb-4 p-3 bg-muted rounded-md">
          <p className="text-sm font-medium">Đối tượng: <span className="font-bold">{entityName}</span></p>
          <p className="text-xs text-muted-foreground">Loại: {
            entityType === 'hoc_sinh' ? 'Học sinh' : 
            entityType === 'nhan_vien' ? 'Nhân viên' : 
            entityType === 'co_so' ? 'Cơ sở' : 'Khác'
          }</p>
        </div>
      )}
      
      <FinanceForm
        onSubmit={handleFormSubmit}
        onCancel={onCancel}
        entityType={entityType || undefined}
        entityId={entityId || undefined}
      />
    </div>
  );
};

export default EntityFinanceForm;
