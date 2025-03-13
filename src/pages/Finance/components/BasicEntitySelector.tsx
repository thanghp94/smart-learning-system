
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

  // Set initial values if provided
  useEffect(() => {
    if (entityType && entityId) {
      form.setValue('loai_doi_tuong', entityType);
      form.setValue('doi_tuong_id', entityId);
      setEntityTypeValue(entityType);
    }
  }, [entityType, entityId, form]);

  // Watch for changes to entityType from form
  const watchEntityType = form.watch('loai_doi_tuong');
  
  useEffect(() => {
    if (watchEntityType && watchEntityType !== entityTypeValue) {
      setEntityTypeValue(watchEntityType);
      // Only reset the entity ID if we're not working with a provided entityId
      if (!entityId) {
        form.setValue('doi_tuong_id', '');
      }
    }
  }, [watchEntityType, entityTypeValue, form, entityId]);

  // Fetch entities based on type
  useEffect(() => {
    const fetchEntities = async () => {
      if (!entityTypeValue) return;
      
      setIsLoadingEntities(true);
      try {
        let data = [];
        
        switch (entityTypeValue) {
          case 'hoc_sinh':
          case 'student':
            data = await studentService.getAll();
            break;
          case 'nhan_vien':
          case 'employee':
            data = await employeeService.getAll();
            break;
          case 'co_so':
          case 'facility':
            data = await facilityService.getAll();
            break;
          default:
            data = [];
        }
        
        setEntities(data || []);
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
      case 'student':
        return entity.ten_hoc_sinh || 'N/A';
      case 'nhan_vien':
      case 'employee':
        return entity.ten_nhan_su || 'N/A';
      case 'co_so':
      case 'facility':
        return entity.ten_co_so || 'N/A';
      default:
        return 'N/A';
    }
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
              onValueChange={(value) => {
                field.onChange(value);
                setEntityTypeValue(value);
              }}
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
                    <SelectItem value="placeholder" disabled>
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
