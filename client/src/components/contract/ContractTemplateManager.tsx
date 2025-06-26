
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Download, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Employee } from '@/lib/types';

interface ContractTemplateManagerProps {
  employee?: Employee;
}

const ContractTemplateManager: React.FC<ContractTemplateManagerProps> = ({ employee }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [availableFields, setAvailableFields] = useState<string[]>([
    '{ten_nhan_su}', 
    '{chuc_danh}', 
    '{bo_phan}', 
    '{ngay_sinh}', 
    '{dia_chi}', 
    '{email}', 
    '{dien_thoai}',
    '{ngay_hien_tai}',
    '{ngay_ket_thuc}'
  ]);
  const [mergedFileUrl, setMergedFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadTemplate = () => {
    if (!selectedFile) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn một tệp mẫu để tải lên",
        variant: "destructive"
      });
      return;
    }

    if (!templateName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên cho mẫu này",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Simulating upload process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Thành công",
        description: "Đã tải lên mẫu hợp đồng thành công",
      });
      // Reset form after successful upload
      setSelectedFile(null);
      setTemplateName('');
      setTemplateDescription('');
    }, 1500);
  };

  const handleMergeDocument = () => {
    if (!employee) {
      toast({
        title: "Lỗi",
        description: "Không có thông tin nhân viên để tạo hợp đồng",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Simulating merge process
    setTimeout(() => {
      setIsLoading(false);
      setMergedFileUrl('https://example.com/merged-contract.pdf');
      toast({
        title: "Thành công",
        description: "Đã tạo hợp đồng thành công",
      });
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quản lý mẫu hợp đồng</CardTitle>
        <CardDescription>Tải lên và quản lý các mẫu hợp đồng cho nhân viên</CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Tải lên mẫu</TabsTrigger>
          <TabsTrigger value="merge">Tạo hợp đồng</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Tên mẫu</Label>
              <Input
                id="template-name"
                placeholder="Nhập tên mẫu"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template-description">Mô tả</Label>
              <Textarea
                id="template-description"
                placeholder="Nhập mô tả cho mẫu này"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Tệp mẫu</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Tải lên tệp DOC, DOCX hoặc PDF
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Sử dụng các biến như {'{ten_nhan_su}'} trong tệp mẫu để thay thế tự động
                </p>
                <Input
                  type="file"
                  accept=".doc,.docx,.pdf"
                  className="max-w-xs"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <div className="mt-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{selectedFile.name}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Các trường có thể sử dụng</Label>
              <div className="flex flex-wrap gap-2">
                {availableFields.map((field) => (
                  <Badge key={field} variant="outline" className="px-2 py-1">
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <CardFooter className="flex justify-end pt-4 px-0">
            <Button onClick={handleUploadTemplate} disabled={isLoading}>
              {isLoading ? (
                <>Đang tải lên...</>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Tải lên mẫu
                </>
              )}
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="merge" className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mẫu hợp đồng</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="cursor-pointer border-2 hover:border-primary">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Hợp đồng lao động</CardTitle>
                    <CardDescription>Mẫu hợp đồng lao động theo quy định</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <Badge>Mẫu mặc định</Badge>
                  </CardFooter>
                </Card>
                
                <Card className="cursor-pointer">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Phụ lục hợp đồng</CardTitle>
                    <CardDescription>Phụ lục bổ sung điều khoản</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <Badge variant="outline">Tùy chọn</Badge>
                  </CardFooter>
                </Card>
              </div>
            </div>
            
            {employee && (
              <div className="space-y-2">
                <Label>Thông tin nhân viên</Label>
                <Card>
                  <CardContent className="p-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium">Họ và tên</p>
                      <p>{employee.ten_nhan_su}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Chức danh</p>
                      <p>{employee.chuc_danh || 'Chưa có'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Bộ phận</p>
                      <p>{employee.bo_phan || 'Chưa có'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Điện thoại</p>
                      <p>{employee.dien_thoai || 'Chưa có'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {mergedFileUrl && (
              <div className="space-y-2">
                <Label>Hợp đồng đã tạo</Label>
                <Card className="bg-muted/50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      <span>Hợp đồng lao động - {employee?.ten_nhan_su}.pdf</span>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={mergedFileUrl} download>
                        <Download className="h-4 w-4 mr-1" /> Tải xuống
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          <CardFooter className="flex justify-end pt-4 px-0">
            <Button onClick={handleMergeDocument} disabled={isLoading || !employee}>
              {isLoading ? (
                <>Đang tạo hợp đồng...</>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> Tạo hợp đồng
                </>
              )}
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ContractTemplateManager;
