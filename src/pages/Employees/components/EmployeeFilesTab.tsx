
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, ExternalLink, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fileService } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FileForm from '@/pages/Files/FileForm';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface EmployeeFilesTabProps {
  employeeId: string;
}

const EmployeeFilesTab: React.FC<EmployeeFilesTabProps> = ({ employeeId }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFiles();
  }, [employeeId]);

  const fetchFiles = async () => {
    if (!employeeId) return;

    setIsLoading(true);
    try {
      const data = await fileService.getByEntity('nhan_vien', employeeId);
      setFiles(data || []);
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

  const handleAddFile = async (data: any) => {
    try {
      // Ensure the correct entity type and ID are set
      const fileData = {
        ...data,
        nhan_vien_ID: employeeId,
      };
      
      await fileService.create(fileData);
      
      toast({
        title: 'Thành công',
        description: 'Đã thêm tài liệu mới',
      });
      
      setShowAddForm(false);
      fetchFiles();
    } catch (error) {
      console.error('Error adding file:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm tài liệu mới: ' + (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này không?')) return;
    
    try {
      await fileService.delete(id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa tài liệu',
      });
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa tài liệu',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const getFileNameFromUrl = (url?: string) => {
    if (!url) return 'Không có tài liệu';
    
    try {
      const fileName = url.split('/').pop() || 'Tài liệu';
      return fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;
    } catch (error) {
      return 'Tài liệu';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Tài liệu</CardTitle>
        <Button onClick={() => setShowAddForm(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Thêm tài liệu
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Đang tải dữ liệu...</div>
        ) : files.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Không có tài liệu nào
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {files.map((file) => (
              <div key={file.id} className="border rounded-lg p-4 relative">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{file.ten_tai_lieu}</h3>
                    <p className="text-sm text-muted-foreground">
                      {file.nhom_tai_lieu || 'Tài liệu khác'}
                    </p>
                  </div>
                  <Badge variant={file.trang_thai === 'active' ? 'default' : 'secondary'}>
                    {file.trang_thai === 'active' ? 'Hiệu lực' : 'Không hiệu lực'}
                  </Badge>
                </div>
                
                <div className="flex items-center text-sm mb-2">
                  <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{getFileNameFromUrl(file.file1)}</span>
                </div>
                
                {file.ngay_cap && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Ngày cấp:</span> {formatDate(file.ngay_cap)}
                  </div>
                )}
                
                {file.han_tai_lieu && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Hạn đến:</span> {formatDate(file.han_tai_lieu)}
                  </div>
                )}
                
                {file.ghi_chu && (
                  <div className="text-sm mt-2 italic">
                    {file.ghi_chu}
                  </div>
                )}
                
                <div className="flex justify-end mt-3 space-x-2">
                  {file.file1 && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={file.file1} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Xem
                      </a>
                    </Button>
                  )}
                  
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(file.id)}>
                    <Trash className="h-4 w-4 mr-1" />
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Thêm tài liệu mới</DialogTitle>
            </DialogHeader>
            <FileForm 
              onSubmit={handleAddFile}
              onCancel={() => setShowAddForm(false)}
              initialData={{
                loai_doi_tuong: 'nhan_vien',
                doi_tuong_id: employeeId
              }}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EmployeeFilesTab;
