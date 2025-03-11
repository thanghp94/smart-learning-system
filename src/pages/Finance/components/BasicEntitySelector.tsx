
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
  const watchEntityType = form.watch('loai_doi_tuong');
  
  useEffect(() => {
    if (entityType && entityId) {
      // If entity is provided from props, set the form values
      form.setValue('loai_doi_tuong', entityType);
      form.setValue('doi_tuong_id', entityId);
    }
    setSelectedEntityType(watchEntityType || entityType || '');
  }, [entityType, entityId, form, watchEntityType]);
  
  useEffect(() => {
    const fetchEntities = async () => {
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
              name: item.ten_lop_full
            })));
            break;
          
          default:
            setEntityOptions([]);
        }
      } catch (error) {
        console.error(`Error fetching ${selectedEntityType} entities:`, error);
        setEntityOptions([]);
      }
    };
    
    if (selectedEntityType && (!entityId || !entityType)) {
      fetchEntities();
    }
  }, [selectedEntityType, entityId, entityType]);
  
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
                form.setValue('doi_tuong_id', '');
              }}
              defaultValue={field.value}
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
                defaultValue={field.value}
                disabled={!!entityId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đối tượng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {entityOptions.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
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
