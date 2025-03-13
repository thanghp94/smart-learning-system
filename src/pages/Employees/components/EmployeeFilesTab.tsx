
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
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
import FileUploader, { FileInfo } from '@/components/common/FileUploader';
import FileStorageService, { ExtendedFile } from '@/lib/services/fileService';

interface EmployeeFilesTabProps {
  employeeId: string;
}

const fileSchema = z.object({
  ten_file: z.string().min(1, { message: 'Tên file không được để trống' }),
  mo_ta: z.string().optional(),
  file_type: z.string().min(1, { message: 'Loại file không được để trống' }),
});

type FileFormValues = z.infer<typeof fileSchema>;

const EmployeeFilesTab: React.FC<EmployeeFilesTabProps> = ({ employeeId }) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<ExtendedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [fileTypeFilter, setFileTypeFilter] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  
  const form = useForm<FileFormValues>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      ten_file: '',
      mo_ta: '',
      file_type: '',
    }
  });

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true);
        const data = await FileStorageService.getByEntityId(employeeId, 'employee');
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

  const handleFileSelected = (fileInfo: FileInfo) => {
    setSelectedFile(fileInfo);
      
    // Extract filename to use as default for ten_file
    const fileName = fileInfo.name.split('.').slice(0, -1).join('.');
    form.setValue('ten_file', fileName);
    
    // Set file type based on extension
    const fileExt = fileInfo.extension.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
      form.setValue('file_type', 'image');
    } else if (['pdf', 'doc', 'docx', 'txt'].includes(fileExt)) {
      form.setValue('file_type', 'document');
    } else if (['xls', 'xlsx', 'csv'].includes(fileExt)) {
      form.setValue('file_type', 'spreadsheet');
    } else {
      form.setValue('file_type', 'other');
    }
  };

  const filteredFiles = fileTypeFilter 
    ? files.filter(file => file.file_type === fileTypeFilter)
    : files;

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này không?')) return;
    
    try {
      await FileStorageService.delete(fileId);
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
    if (!selectedFile) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng tải lên một tệp tin',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Upload file to storage
      const uploadResult = await FileStorageService.upload(
        selectedFile.file, 
        'employee_files', 
        `${employeeId}/${selectedFile.name}`
      );
      
      if (!uploadResult.url) throw new Error('File upload failed');
      
      // Create file record in database
      const newFile: Partial<ExtendedFile> = {
        ten_file: values.ten_file,
        mo_ta: values.mo_ta,
        file_url: uploadResult.url,
        file_type: values.file_type,
        file_extension: selectedFile.extension,
        file_size: selectedFile.size,
        entity_id: employeeId,
        entity_type: 'employee',
      };
      
      const createdFile = await FileStorageService.create(newFile);
      setFiles([createdFile, ...files]);
      
      // Reset form
      form.reset();
      setSelectedFile(null);
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
                          <div className="font-medium">{file.ten_file || file.ten_tai_lieu}</div>
                          <div className="text-sm text-muted-foreground">{file.mo_ta || file.ghi_chu}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{file.file_type || file.nhom_tai_lieu}</TableCell>
                    <TableCell>
                      {file.created_at && format(new Date(file.created_at), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => window.open(file.file_url || file.file1, '_blank')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => window.open(file.file_url || file.file1, '_blank')}>
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
                    <FileUploader 
                      onFileSelected={handleFileSelected} 
                      label="Chọn tệp tin"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                
                {selectedFile && (
                  <div className="p-2 border rounded bg-gray-50">
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={!selectedFile}>Lưu tài liệu</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeFilesTab;
