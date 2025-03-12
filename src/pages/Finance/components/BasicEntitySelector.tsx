
import React, { useState, useEffect } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { studentService, employeeService, facilityService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface BasicEntitySelectorProps {
  form: any;
  entityType?: string;
  entityId?: string;
}

const BasicEntitySelector: React.FC<BasicEntitySelectorProps> = ({ form, entityType, entityId }) => {
  const [entityTypeValue, setEntityTypeValue] = useState(entityType || '');
  const [entities, setEntities] = useState<any[]>([]);
  const [isLoadingEntities, setIsLoadingEntities] = useState(false);
  const { toast } = useToast();

  // Watch for changes to entityType from parent form
  const watchEntityType = form.watch('loai_doi_tuong');
  
  // If entityType changes from parent component, update our local state
  useEffect(() => {
    if (watchEntityType && watchEntityType !== entityTypeValue) {
      setEntityTypeValue(watchEntityType);
      // Reset entity ID when type changes
      if (form.getValues('doi_tuong_id') && !entityId) {
        form.setValue('doi_tuong_id', '');
      }
    }
  }, [watchEntityType, entityTypeValue, form, entityId]);

  // Set initial values if provided
  useEffect(() => {
    if (entityType && entityId) {
      form.setValue('loai_doi_tuong', entityType);
      form.setValue('doi_tuong_id', entityId);
      setEntityTypeValue(entityType);
    }
  }, [entityType, entityId, form]);

  // Fetch entities based on type
  useEffect(() => {
    if (!entityTypeValue) return;
    
    const fetchEntities = async () => {
      setIsLoadingEntities(true);
      try {
        let data = [];
        
        switch (entityTypeValue) {
          case 'hoc_sinh':
            data = await studentService.getAll();
            break;
          case 'nhan_vien':
            data = await employeeService.getAll();
            break;
          case 'co_so':
            data = await facilityService.getAll();
            break;
          default:
            data = [];
        }
        
        console.log(`Fetched ${data.length} entities for type ${entityTypeValue}`);
        setEntities(data);
      } catch (error) {
        console.error('Error fetching entities:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách đối tượng',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingEntities(false);
      }
    };

    fetchEntities();
  }, [entityTypeValue, toast]);

  // Helper to get entity name based on type
  const getEntityName = (entity: any) => {
    if (!entity) return 'N/A';
    
    switch (entityTypeValue) {
      case 'hoc_sinh':
        return entity.ten_hoc_sinh || 'N/A';
      case 'nhan_vien':
        return entity.ten_nhan_su || 'N/A';
      case 'co_so':
        return entity.ten_co_so || 'N/A';
      default:
        return 'N/A';
    }
  };

  // Handle entity type change
  const handleEntityTypeChange = (value: string) => {
    console.log(`Changing entity type to: ${value}`);
    form.setValue('loai_doi_tuong', value);
    
    // Only reset entity ID when type changes and not explicitly provided
    if (!entityId || value !== entityType) {
      form.setValue('doi_tuong_id', '');
    }
    
    setEntityTypeValue(value);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="loai_doi_tuong"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loại đối tượng</FormLabel>
            <Select
              onValueChange={handleEntityTypeChange}
              value={field.value || ''}
              disabled={!!entityType}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại đối tượng" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="hoc_sinh">Học sinh</SelectItem>
                <SelectItem value="nhan_vien">Nhân viên</SelectItem>
                <SelectItem value="co_so">Cơ sở</SelectItem>
                <SelectItem value="khac">Khác</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {entityTypeValue && entityTypeValue !== 'khac' && (
        <FormField
          control={form.control}
          name="doi_tuong_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chi tiết đối tượng</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ''}
                disabled={isLoadingEntities || !!entityId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingEntities ? 'Đang tải...' : 'Chọn đối tượng'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {entities.length > 0 ? (
                    entities.map((entity: any) => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {getEntityName(entity)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      {isLoadingEntities ? 'Đang tải...' : 'Không có đối tượng'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default BasicEntitySelector;
