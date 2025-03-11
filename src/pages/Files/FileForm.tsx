
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { fileSchema, FileFormValues } from './schemas/fileSchema';
import FileFormFields from './components/FileFormFields';
import { File } from '@/lib/types/file';
import { studentService, employeeService, facilityService, assetService, contactService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface FileFormProps {
  initialData?: Partial<File>;
  onSubmit: (data: FileFormValues) => void;
  onCancel: () => void;
}

interface EntityOption {
  id: string;
  name: string;
}

const FileForm: React.FC<FileFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [entityType, setEntityType] = useState<string>(initialData?.doi_tuong_lien_quan || '');
  const [entityOptions, setEntityOptions] = useState<EntityOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FileFormValues>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      ten_tai_lieu: initialData?.ten_tai_lieu || '',
      doi_tuong_lien_quan: initialData?.doi_tuong_lien_quan || '',
      nhom_tai_lieu: initialData?.nhom_tai_lieu || '',
      ngay_cap: initialData?.ngay_cap || null,
      han_tai_lieu: initialData?.han_tai_lieu || null,
      ghi_chu: initialData?.ghi_chu || '',
      trang_thai: initialData?.trang_thai || 'active',

      // Entity-specific fields (set default based on initialData)
      nhan_vien_id: initialData?.nhan_vien_ID || '',
      hoc_sinh_id: initialData?.hoc_sinh_id || '',
      co_so_id: initialData?.co_so_id || '',
      csvc_id: initialData?.CSVC_ID || '',
      lien_he_id: initialData?.lien_he_id || '',
    },
  });

  useEffect(() => {
    // Set initial entity type and load related entities
    if (initialData?.doi_tuong_lien_quan) {
      setEntityType(initialData.doi_tuong_lien_quan);
      fetchEntityOptions(initialData.doi_tuong_lien_quan);
    }
  }, [initialData]);

  useEffect(() => {
    // Fetch entity options when entity type changes
    if (entityType) {
      fetchEntityOptions(entityType);
    }
  }, [entityType]);

  const fetchEntityOptions = async (type: string) => {
    setIsLoading(true);
    try {
      let options: EntityOption[] = [];

      switch (type) {
        case 'nhan_vien':
          const employees = await employeeService.getAll();
          options = employees.map(emp => ({
            id: emp.id,
            name: emp.ten_nhan_su || 'Nhân viên không tên',
          }));
          break;
        case 'hoc_sinh':
          const students = await studentService.getAll();
          options = students.map(student => ({
            id: student.id,
            name: student.ten_hoc_sinh || student.ho_va_ten || 'Học sinh không tên',
          }));
          break;
        case 'co_so':
          const facilities = await facilityService.getAll();
          options = facilities.map(facility => ({
            id: facility.id,
            name: facility.ten_co_so || 'Cơ sở không tên',
          }));
          break;
        case 'csvc':
          const assets = await assetService.getAll();
          options = assets.map(asset => ({
            id: asset.id,
            name: asset.ten_CSVC || 'Tài sản không tên',
          }));
          break;
        case 'lien_he':
          const contacts = await contactService.getAll();
          options = contacts.map(contact => ({
            id: contact.id,
            name: contact.ten || 'Liên hệ không tên',
          }));
          break;
        default:
          options = [];
      }

      setEntityOptions(options);
    } catch (error) {
      console.error('Error fetching entity options:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu đối tượng',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEntitySelect = (entityId: string) => {
    // Update the appropriate entity ID field based on the selected entity type
    switch (entityType) {
      case 'nhan_vien':
        form.setValue('nhan_vien_id', entityId);
        break;
      case 'hoc_sinh':
        form.setValue('hoc_sinh_id', entityId);
        break;
      case 'co_so':
        form.setValue('co_so_id', entityId);
        break;
      case 'csvc':
        form.setValue('csvc_id', entityId);
        break;
      case 'lien_he':
        form.setValue('lien_he_id', entityId);
        break;
    }
  };

  const handleFormSubmit = (data: FileFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FileFormFields
          form={form}
          entityType={entityType}
          setEntityType={setEntityType}
          entityOptions={entityOptions}
          handleEntitySelect={handleEntitySelect}
        />

        <div className="pt-4 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Lưu thông tin'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FileForm;
