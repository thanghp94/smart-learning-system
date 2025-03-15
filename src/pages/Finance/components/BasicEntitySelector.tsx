
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { studentService, employeeService, contactService } from '@/lib/supabase';
import { UseFormReturn } from 'react-hook-form';
import EntitySelect from './EntitySelect';

interface BasicEntitySelectorProps {
  form: UseFormReturn<any>;
  entityType?: string;
  entityId?: string;
  onEntityChange?: (entityType: string, entityId: string, entityName: string) => void;
}

const BasicEntitySelector: React.FC<BasicEntitySelectorProps> = ({ 
  form, 
  entityType, 
  entityId,
  onEntityChange 
}) => {
  const [selectedEntityType, setSelectedEntityType] = useState<string | null>(entityType || null);

  const handleEntityTypeChange = (value: string) => {
    setSelectedEntityType(value);
    form.setValue('loai_doi_tuong', value);
    
    // Reset entity ID when type changes
    form.setValue('doi_tuong_id', '');
    
    // Notify parent component
    if (onEntityChange) {
      onEntityChange(value, '', '');
    }
  };

  const handleEntityNameChange = (entityId: string, entityName: string) => {
    if (onEntityChange && selectedEntityType) {
      onEntityChange(selectedEntityType, entityId, entityName);
    }
  };

  return (
    <div>
      <EntitySelect
        form={form}
        selectedEntityType={selectedEntityType}
        onEntityTypeChange={handleEntityTypeChange}
        onEntityNameChange={handleEntityNameChange}
      />
    </div>
  );
};

export default BasicEntitySelector;
