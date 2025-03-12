import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { File as FileType, Contact, Employee, Facility, Class } from '@/lib/types';
import { fileSchema, FileFormData } from './schemas/fileSchema';
import { contactService, employeeService, facilityService, classService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/common/ImageUpload';
import { format } from 'date-fns';

interface FileFormProps {
  initialData?: Partial<FileType>;
  onSubmit: (data: FileFormData) => void;
  onCancel: () => void;
}

const FileForm = ({ initialData, onSubmit, onCancel }: FileFormProps) => {
  const [selectedEntityType, setSelectedEntityType] = useState<string>(initialData?.doi_tuong_lien_quan || 'contact');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<FileFormData>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      ten_tai_lieu: initialData?.ten_tai_lieu || '',
      loai_doi_tuong: initialData?.doi_tuong_lien_quan || 'contact',
      doi_tuong_id: initialData?.lien_he_id || initialData?.nhan_vien_ID || initialData?.co_so_id || initialData?.CSVC_ID || initialData?.hoc_sinh_id || '',
      duong_dan: initialData?.file1 || '',
      ghi_chu: initialData?.ghi_chu || '',
      nhom_tai_lieu: initialData?.nhom_tai_lieu || '',
      ngay_cap: initialData?.ngay_cap ? format(new Date(initialData.ngay_cap), 'yyyy-MM-dd') : '',
      han_tai_lieu: initialData?.han_tai_lieu ? format(new Date(initialData.han_tai_lieu), 'yyyy-MM-dd') : '',
      trang_thai: initialData?.trang_thai || 'active',
      uploaded_file: null,
    },
  });

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const [contactsData, employeesData, facilitiesData, classesData] = await Promise.all([
          contactService.getAll(),
          employeeService.getAll(),
          facilityService.getAll(),
          classService.getAll()
        ]);

        setContacts(contactsData);
        setEmployees(employeesData);
        setFacilities(facilitiesData);
        setClasses(classesData);
      } catch (error) {
        console.error('Error fetching entities:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
          variant: 'destructive',
        });
      }
    };

    fetchEntities();
  }, [toast]);

  const handleFormSubmit = (data: FileFormData) => {
    const mappedData = { ...data };
    
    mappedData.nhan_vien_ID = undefined;
    mappedData.lien_he_id = undefined;
    mappedData.co_so_id = undefined;
    mappedData.CSVC_ID = undefined;
    mappedData.hoc_sinh_id = undefined;
    
    switch (data.loai_doi_tuong) {
      case 'employee':
      case 'nhan_vien':
        mappedData.nhan_vien_ID = data.doi_tuong_id;
        break;
      case 'contact':
      case 'lien_he':
        mappedData.lien_he_id = data.doi_tuong_id;
        break;
      case 'facility':
      case 'co_so':
        mappedData.co_so_id = data.doi_tuong_id;
        break;
      case 'asset':
      case 'CSVC':
        mappedData.CSVC_ID = data.doi_tuong_id;
        break;
      case 'class':
      case 'lop':
        mappedData.hoc_sinh_id = data.doi_tuong_id;
        break;
    }
    
    if (uploadedFileUrl) {
      mappedData.file1 = uploadedFileUrl;
      mappedData.duong_dan = uploadedFileUrl;
    } else {
      mappedData.file1 = data.duong_dan;
    }
    
    console.log("Submitting file with mapped data:", mappedData);
    onSubmit(mappedData);
  };

  const handleFileUpload = (url: string) => {
    setUploadedFileUrl(url);
    form.setValue('duong_dan', url);
  };

  const renderEntityOptions = () => {
    switch (selectedEntityType) {
      case 'contact':
        return contacts.map(contact => ({
          value: contact.id,
          label: contact.ten_lien_he || 'Không có tên'
        }));
      case 'employee':
        return employees.map(employee => ({
          value: employee.id,
          label: employee.ten_nhan_su || 'Không có tên'
        }));
      case 'facility':
        return facilities.map(facility => ({
          value: facility.id,
          label: facility.ten_co_so || 'Không có tên'
        }));
      case 'class':
        return classes.map(clazz => ({
          value: clazz.id,
          label: clazz.ten_lop || 'Không có tên'
        }));
      default:
        return [];
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="ten_tai_lieu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên tài liệu</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="loai_doi_tuong"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại đối tượng</FormLabel>
              <Select
                onValueChange={(value) => {
                  setSelectedEntityType(value);
                  form.setValue('loai_doi_tuong', value);
                  form.setValue('doi_tuong_id', ''); // Reset doi_tuong_id when entity type changes
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại đối tượng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="contact">Liên hệ</SelectItem>
                  <SelectItem value="employee">Nhân viên</SelectItem>
                  <SelectItem value="facility">Cơ sở</SelectItem>
                  <SelectItem value="class">Lớp</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="doi_tuong_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đối tượng</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đối tượng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {renderEntityOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 border p-4 rounded-md">
          <h4 className="text-sm font-medium">Tệp đính kèm</h4>
          
          <FormField
            control={form.control}
            name="uploaded_file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tải lên tài liệu/hình ảnh</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={uploadedFileUrl || field.value}
                    onChange={handleFileUpload}
                    onRemove={() => {
                      setUploadedFileUrl('');
                      form.setValue('duong_dan', '');
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duong_dan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hoặc nhập đường dẫn</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nhập URL tài liệu" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="nhom_tai_lieu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhóm tài liệu</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhóm tài liệu" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="hop_dong">Hợp đồng</SelectItem>
                  <SelectItem value="ho_so">Hồ sơ</SelectItem>
                  <SelectItem value="chung_chi">Chứng chỉ</SelectItem>
                  <SelectItem value="bao_cao">Báo cáo</SelectItem>
                  <SelectItem value="tai_lieu_khac">Tài liệu khác</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ghi_chu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">Lưu thông tin</Button>
        </div>
      </form>
    </Form>
  );
};

export default FileForm;
