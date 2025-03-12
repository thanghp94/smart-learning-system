
import React, { useState, useEffect } from 'react';
import { fileService } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { File } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Upload, Download, Trash, Eye, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface EmployeeFilesTabProps {
  employeeId: string;
}

// Extended File type to include additional properties
interface EmployeeFile extends File {
  loai_doi_tuong?: string;
}

const fileSchema = z.object({
  ten_file: z.string().min(1, { message: 'Tên file không được để trống' }),
  mo_ta: z.string().optional(),
  file_type: z.string().min(1, { message: 'Loại file không được để trống' }),
  loai_doi_tuong: z.string().optional(),
});

type FileFormValues = z.infer<typeof fileSchema>;

const EmployeeFilesTab: React.FC<EmployeeFilesTabProps> = ({ employeeId }) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<EmployeeFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [fileTypeFilter, setFileTypeFilter] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  
  const form = useForm<FileFormValues>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      ten_file: '',
      mo_ta: '',
      file_type: '',
      loai_doi_tuong: 'employee',
    }
  });

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true);
        const data = await fileService.getByEntityId(employeeId, 'employee');
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách tài liệu',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (employeeId) {
      fetchFiles();
    }
  }, [employeeId, toast]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadedFile(file);
      
      // Extract filename to use as default for ten_file
      const fileName = file.name.split('.').slice(0, -1).join('.');
      form.setValue('ten_file', fileName);
      
      // Set file type based on extension
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (fileExt) {
        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
          form.setValue('file_type', 'image');
        } else if (['pdf', 'doc', 'docx', 'txt'].includes(fileExt)) {
          form.setValue('file_type', 'document');
        } else if (['xls', 'xlsx', 'csv'].includes(fileExt)) {
          form.setValue('file_type', 'spreadsheet');
        } else {
          form.setValue('file_type', 'other');
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải lên tệp tin',
        variant: 'destructive',
      });
    }
  };

  const filteredFiles = fileTypeFilter 
    ? files.filter(file => file.file_type === fileTypeFilter)
    : files;

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này không?')) return;
    
    try {
      await fileService.delete(fileId);
      setFiles(files.filter(file => file.id !== fileId));
      toast({
        title: 'Thành công',
        description: 'Đã xóa tài liệu',
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa tài liệu',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (values: FileFormValues) => {
    if (!uploadedFile) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng tải lên một tệp tin',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Upload file to storage
      const uploadResult = await fileService.upload(
        uploadedFile, 
        'employee_files', 
        `${employeeId}/${uploadedFile.name}`
      );
      
      if (!uploadResult.url) throw new Error('File upload failed');
      
      // Create file record in database
      const newFile: Partial<EmployeeFile> = {
        ten_file: values.ten_file,
        mo_ta: values.mo_ta,
        file_url: uploadResult.url,
        file_type: values.file_type,
        file_extension: uploadedFile.name.split('.').pop(),
        file_size: uploadedFile.size,
        entity_id: employeeId,
        entity_type: 'employee',
        // Using loai_doi_tuong as a custom field for the file record
        loai_doi_tuong: values.loai_doi_tuong,
      };
      
      const createdFile = await fileService.create(newFile);
      setFiles([createdFile as EmployeeFile, ...files]);
      
      // Reset form
      form.reset();
      setUploadedFile(null);
      setFileUrl(null);
      setShowAddDialog(false);
      
      toast({
        title: 'Thành công',
        description: 'Đã tải lên tài liệu mới',
      });
    } catch (error) {
      console.error('Error saving file:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu tài liệu',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tài liệu nhân viên</h3>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm tài liệu
        </Button>
      </div>
      
      <div className="mb-4">
        <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tất cả loại tài liệu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tất cả loại tài liệu</SelectItem>
            <SelectItem value="image">Hình ảnh</SelectItem>
            <SelectItem value="document">Tài liệu</SelectItem>
            <SelectItem value="spreadsheet">Bảng tính</SelectItem>
            <SelectItem value="other">Khác</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="text-center py-4">Đang tải dữ liệu...</div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Không có tài liệu nào được tìm thấy
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên tài liệu</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-500" />
                        <div>
                          <div className="font-medium">{file.ten_file}</div>
                          <div className="text-sm text-muted-foreground">{file.mo_ta}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{file.file_type}</TableCell>
                    <TableCell>
                      {file.created_at && format(new Date(file.created_at), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => window.open(file.file_url, '_blank')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => window.open(file.file_url, '_blank')}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteFile(file.id)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Thêm tài liệu mới</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="ten_file"
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
                  name="mo_ta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="file_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại tài liệu</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại tài liệu" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="image">Hình ảnh</SelectItem>
                          <SelectItem value="document">Tài liệu</SelectItem>
                          <SelectItem value="spreadsheet">Bảng tính</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormItem>
                  <FormLabel>Tải lên tệp tin</FormLabel>
                  <FormControl>
                    <Input type="file" onChange={handleFileUpload} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                
                {uploadedFile && (
                  <div className="p-2 border rounded bg-gray-50">
                    <p className="text-sm font-medium">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={!uploadedFile}>Lưu tài liệu</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeFilesTab;
