
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, Upload, Plus } from 'lucide-react';
import { fileService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';

export interface EmployeeFilesTabProps {
  employeeId: string;
  onFileUpload: (file: File) => Promise<void>;
}

const EmployeeFilesTab: React.FC<EmployeeFilesTabProps> = ({ employeeId, onFileUpload }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true);
        const data = await fileService.getByEntity('employee', employeeId);
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách tài liệu',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [employeeId, toast]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await onFileUpload(file);
      toast({
        title: 'Thành công',
        description: 'Tải lên tài liệu thành công'
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải lên tài liệu',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tài liệu nhân viên</h3>
        <div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button asChild variant="outline" size="sm">
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Tải lên tài liệu
              </span>
            </Button>
          </label>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <File className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Chưa có tài liệu nào</p>
          <div className="mt-4">
            <label htmlFor="file-upload-empty">
              <Button asChild variant="outline" size="sm">
                <span>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm tài liệu
                </span>
              </Button>
            </label>
            <input
              type="file"
              id="file-upload-empty"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Tài liệu đã đính kèm</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {files.map((file) => (
                <div key={file.id} className="p-4 hover:bg-muted flex justify-between items-center">
                  <div className="flex items-center">
                    <File className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <h4 className="font-medium text-sm">{file.ten_tai_lieu}</h4>
                      <p className="text-sm text-muted-foreground">
                        {file.nhom_tai_lieu} • {formatDate(file.created_at || '')}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Xem
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeFilesTab;
