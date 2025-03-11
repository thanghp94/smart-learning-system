import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fileSchema, FileFormValues } from './schemas/fileSchema';
import { File, Student, Employee, Facility, Asset } from '@/lib/types';
import { studentService, employeeService, facilityService, assetService } from '@/lib/supabase';

interface FileFormData {
  ten_tai_lieu: string;
  doi_tuong_lien_quan: string;
  nhom_tai_lieu?: string;
  ngay_cap?: string | null;
  han_tai_lieu?: string | null;
  ghi_chu?: string;
  trang_thai?: string;
  nhan_vien_id?: string;
  hoc_sinh_id?: string;
  co_so_id?: string;
  csvc_id?: string;
  lien_he_id?: string;
}

interface FileFormProps {
  initialData?: Partial<File>;
  onSubmit: (data: FileFormValues) => void;
  onCancel: () => void;
}

const FileForm = ({ initialData, onSubmit, onCancel }: FileFormProps) => {
  // State for entity lists
  const [students, setStudents] = useState<Student[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedEntityType, setSelectedEntityType] = useState<string>(initialData?.doi_tuong_lien_quan || '');

  // Process date values from initialData
  const defaultValues = {
    ten_tai_lieu: initialData?.ten_tai_lieu || '',
    doi_tuong_lien_quan: initialData?.doi_tuong_lien_quan || '',
    nhom_tai_lieu: initialData?.nhom_tai_lieu || '',
    ngay_cap: initialData?.ngay_cap || '',
    han_tai_lieu: initialData?.han_tai_lieu || '',
    ghi_chu: initialData?.ghi_chu || '',
    trang_thai: initialData?.trang_thai || 'active',
    nhan_vien_id: initialData?.nhan_vien_id || '',
    co_so_id: initialData?.co_so_id || '',
    lien_he_id: initialData?.lien_he_id || '',
    csvc_id: initialData?.csvc_id || '',
    hoc_sinh_id: initialData?.hoc_sinh_id || '',
  };

  const form = useForm<FileFormValues>({
    resolver: zodResolver(fileSchema),
    defaultValues
  });

  // Load entities when entity type changes
  useEffect(() => {
    const entityType = form.watch('doi_tuong_lien_quan');
    setSelectedEntityType(entityType);
    
    const loadEntities = async () => {
      try {
        switch (entityType) {
          case 'nhan_vien':
            const employeeData = await employeeService.getAll();
            setEmployees(employeeData);
            break;
          case 'hoc_sinh':
            const studentData = await studentService.getAll();
            setStudents(studentData);
            break;
          case 'co_so':
            const facilityData = await facilityService.getAll();
            setFacilities(facilityData);
            break;
          case 'CSVC':
            const assetData = await assetService.getAll();
            setAssets(assetData);
            break;
        }
      } catch (error) {
        console.error(`Error loading ${entityType} data:`, error);
      }
    };

    if (entityType) {
      loadEntities();
    }
  }, [form.watch('doi_tuong_lien_quan')]);

  const handleFormSubmit = (values: FileFormValues) => {
    // Filter out empty UUID fields
    const formData = {
      ...values,
      nhan_vien_id: values.nhan_vien_id || null,
      hoc_sinh_id: values.hoc_sinh_id || null,
      co_so_id: values.co_so_id || null,
      csvc_id: values.csvc_id || null,
      lien_he_id: values.lien_he_id || null,
    };
    
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="ten_tai_lieu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên tài liệu*</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên tài liệu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="doi_tuong_lien_quan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đối tượng liên quan*</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset related entity IDs when type changes
                  form.setValue('nhan_vien_id', '');
                  form.setValue('hoc_sinh_id', '');
                  form.setValue('co_so_id', '');
                  form.setValue('csvc_id', '');
                  form.setValue('lien_he_id', '');
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đối tượng liên quan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="nhan_vien">Nhân viên</SelectItem>
                  <SelectItem value="hoc_sinh">Học sinh</SelectItem>
                  <SelectItem value="co_so">Cơ sở</SelectItem>
                  <SelectItem value="CSVC">Tài sản</SelectItem>
                  <SelectItem value="lien_he">Liên hệ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedEntityType === 'nhan_vien' && (
          <FormField
            control={form.control}
            name="nhan_vien_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chọn nhân viên*</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhân viên" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.ten_nhan_su}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedEntityType === 'hoc_sinh' && (
          <FormField
            control={form.control}
            name="hoc_sinh_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chọn học sinh*</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn học sinh" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.ten_hoc_sinh}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedEntityType === 'co_so' && (
          <FormField
            control={form.control}
            name="co_so_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chọn cơ sở*</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cơ sở" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {facilities.map(facility => (
                      <SelectItem key={facility.id} value={facility.id}>
                        {facility.ten_co_so}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedEntityType === 'CSVC' && (
          <FormField
            control={form.control}
            name="csvc_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chọn tài sản*</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tài sản" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {assets.map(asset => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.ten_CSVC}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="nhom_tai_lieu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhóm tài liệu</FormLabel>
              <FormControl>
                <Input placeholder="Nhập nhóm tài liệu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ngay_cap"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày cấp</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    value={field.value || ''} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="han_tai_lieu"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Hạn tài liệu</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field}
                    value={field.value || ''} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ghi_chu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập ghi chú" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="trang_thai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="archived">Đã lưu trữ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
          <Button type="submit">Lưu thông tin</Button>
        </div>
      </form>
    </Form>
  );
};

export default FileForm;
