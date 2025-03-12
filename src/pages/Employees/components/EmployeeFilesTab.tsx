import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Download, Trash } from 'lucide-react';
import { fileService } from '@/lib/supabase';
import { File as FileDocument } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface EmployeeFilesTabProps {
  employeeId: string;
  onFileUpload: (fileId: string) => void;
}

type EmployeeFile = FileDocument;

const EmployeeFilesTab: React.FC<EmployeeFilesTabProps> = ({ employeeId, onFileUpload }) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<EmployeeFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, [employeeId]);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const employeeFiles = await fileService.getByEntity('nhan_vien', employeeId);
      setFiles(employeeFiles);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDocumentTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentTitle(e.target.value);
  };

  const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFileType(e.target.value);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !documentTitle) {
      toast({
        title: 'Thông tin thiếu',
        description: 'Vui lòng nhập tiêu đề và chọn tệp',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // First, upload the file to storage
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('entityType', 'nhan_vien');
      formData.append('entityId', employeeId);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }
      
      const uploadData = await uploadResponse.json();
      const fileUrl = uploadData.url;
      
      // Then create the file record in the database
      const fileData: Partial<EmployeeFile> = {
        ten_tai_lieu: documentTitle,
        doi_tuong_lien_quan: 'nhan_vien',
        nhan_vien_ID: employeeId,
        nhom_tai_lieu: selectedFileType || 'general',
        file1: fileUrl,
        trang_thai: 'active'
      };
      
      const newFile = await fileService.create(fileData);
      
      setFiles(prev => [...prev, newFile]);
      setSelectedFile(null);
      setDocumentTitle('');
      setSelectedFileType('');
      
      toast({
        title: 'Thành công',
        description: 'Tải lên tài liệu thành công',
      });
      onFileUpload(newFile.id);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Lỗi',
        description: 'Tải lên tài liệu không thành công',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      return;
    }
    
    try {
      await fileService.delete(fileId);
      setFiles(files.filter(file => file.id !== fileId));
      
      toast({
        title: 'Thành công',
        description: 'Xóa tài liệu thành công',
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Lỗi',
        description: 'Xóa tài liệu không thành công',
        variant: 'destructive',
      });
    }
  };

  const renderFileItem = (file: EmployeeFile) => {
    return (
      <div key={file.id} className="flex items-center p-3 border-b">
        <div className="mr-3">
          <FileText className="h-8 w-8 text-blue-500" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{file.ten_tai_lieu}</h4>
          <p className="text-sm text-muted-foreground">{file.nhom_tai_lieu || 'Tài liệu'}</p>
          <p className="text-xs text-muted-foreground">
            Ngày tạo: {new Date(file.created_at || '').toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <a href={file.file1} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(file.id)}>
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center">Đang tải...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Tài liệu nhân viên</h3>
          
          <form onSubmit={handleUpload} className="space-y-4 mb-6 p-4 border rounded-md bg-muted/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="documentTitle">Tiêu đề tài liệu</Label>
                <Input
                  id="documentTitle"
                  value={documentTitle}
                  onChange={handleDocumentTitleChange}
                  placeholder="Nhập tiêu đề tài liệu"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="documentType">Loại tài liệu</Label>
                <Select
                  value={selectedFileType}
                  onValueChange={(value) => setSelectedFileType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại tài liệu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hop_dong">Hợp đồng</SelectItem>
                    <SelectItem value="chung_chi">Chứng chỉ</SelectItem>
                    <SelectItem value="cv">CV</SelectItem>
                    <SelectItem value="bang_cap">Bằng cấp</SelectItem>
                    <SelectItem value="cmnd">CMND/CCCD</SelectItem>
                    <SelectItem value="khac">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="file">Tệp tài liệu</Label>
              <div className="flex items-center mt-1">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex-1 border rounded-md p-2 bg-background">
                  {selectedFile ? (
                    <div className="text-sm">
                      {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">Chưa chọn tệp</div>
                  )}
                </div>
                <label htmlFor="file">
                  <Button type="button" variant="outline" className="ml-2" asChild>
                    <span><Upload className="h-4 w-4 mr-2" /> Chọn</span>
                  </Button>
                </label>
              </div>
            </div>
            
            <div>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Đang tải lên...' : 'Tải lên tài liệu'}
              </Button>
            </div>
          </form>
        </div>
        
        <div>
          <h4 className="font-medium mb-3">Danh sách tài liệu</h4>
          {files.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              {files.map(renderFileItem)}
            </div>
          ) : (
            <p className="text-center text-muted-foreground p-4 border rounded-md">
              Chưa có tài liệu nào
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeFilesTab;
