
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
import { employeeService, studentService, facilityService, classService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface BasicEntitySelectorProps {
  form: any;
  entityType?: string;
  entityId?: string;
}

const BasicEntitySelector: React.FC<BasicEntitySelectorProps> = ({ 
  form,
  entityType,
  entityId
}) => {
  const [entityOptions, setEntityOptions] = useState<any[]>([]);
  const [selectedEntityType, setSelectedEntityType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const watchEntityType = form.watch('loai_doi_tuong');
  
  // Set initial values from props
  useEffect(() => {
    if (entityType && entityId) {
      form.setValue('loai_doi_tuong', entityType);
      form.setValue('doi_tuong_id', entityId);
      setSelectedEntityType(entityType);
    } else if (watchEntityType) {
      setSelectedEntityType(watchEntityType);
    }
  }, [entityType, entityId, form, watchEntityType]);
  
  // Fetch entities when entity type changes
  useEffect(() => {
    const fetchEntities = async () => {
      if (!selectedEntityType) return;
      
      setIsLoading(true);
      try {
        let data: any[] = [];
        
        switch (selectedEntityType) {
          case 'nhan_vien':
            data = await employeeService.getAll();
            setEntityOptions(data.map(item => ({
              id: item.id,
              name: item.ten_nhan_su
            })));
            break;
          
          case 'hoc_sinh':
            data = await studentService.getAll();
            setEntityOptions(data.map(item => ({
              id: item.id,
              name: item.ten_hoc_sinh || item.ho_va_ten
            })));
            break;
          
          case 'co_so':
            data = await facilityService.getAll();
            setEntityOptions(data.map(item => ({
              id: item.id,
              name: item.ten_co_so
            })));
            break;
          
          case 'lop':
            data = await classService.getAll();
            setEntityOptions(data.map(item => ({
              id: item.id,
              name: item.ten_lop_full || item.ten_lop
            })));
            break;
          
          default:
            setEntityOptions([]);
        }
        
      } catch (error) {
        console.error(`Error fetching ${selectedEntityType} entities:`, error);
        toast({
          title: 'Lỗi',
          description: `Không thể tải dữ liệu ${selectedEntityType}`,
          variant: 'destructive'
        });
        setEntityOptions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntities();
  }, [selectedEntityType, toast]);
  
  return (
    <>
      <FormField
        control={form.control}
        name="loai_doi_tuong"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loại đối tượng</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                setSelectedEntityType(value);
                // Clear the entity ID when changing entity type
                form.setValue('doi_tuong_id', '');
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
                <SelectItem value="nhan_vien">Nhân viên</SelectItem>
                <SelectItem value="hoc_sinh">Học sinh</SelectItem>
                <SelectItem value="co_so">Cơ sở</SelectItem>
                <SelectItem value="lop">Lớp</SelectItem>
                <SelectItem value="chung">Chung</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedEntityType && selectedEntityType !== 'chung' && (
        <FormField
          control={form.control}
          name="doi_tuong_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đối tượng chi tiết</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ''}
                disabled={!!entityId || isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoading ? "Đang tải..." : "Chọn đối tượng"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {entityOptions.length > 0 ? (
                    entityOptions.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      {isLoading ? 'Đang tải...' : 'Không có dữ liệu'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default BasicEntitySelector;
