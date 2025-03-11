
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
} from "@/components/ui/select"
import { File as FileType, Contact, Employee, Facility, Class } from '@/lib/types';
import { fileSchema, FileFormData } from './schemas/fileSchema';
import { contactService, employeeService, facilityService, classService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const form = useForm<FileFormData>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      ten_tai_lieu: initialData?.ten_tai_lieu || '',
      loai_doi_tuong: initialData?.doi_tuong_lien_quan || 'contact',
      doi_tuong_id: initialData?.lien_he_id || initialData?.nhan_vien_id || initialData?.co_so_id || initialData?.csvc_id || initialData?.hoc_sinh_id || '',
      duong_dan: initialData?.file1 || '',
      ghi_chu: initialData?.ghi_chu || '',
      nhom_tai_lieu: initialData?.nhom_tai_lieu || '',
      ngay_cap: initialData?.ngay_cap || null,
      han_tai_lieu: initialData?.han_tai_lieu || null,
      trang_thai: initialData?.trang_thai || 'active',
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
    onSubmit(data);
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

        <FormField
          control={form.control}
          name="duong_dan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đường dẫn</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
