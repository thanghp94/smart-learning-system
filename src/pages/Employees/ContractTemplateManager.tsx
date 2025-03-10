
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Employee } from '@/lib/types';
import { FileUp, FilePlus, Download, Save, FileText } from 'lucide-react';

interface ContractTemplateManagerProps {
  employee?: Employee;
  onClose?: () => void;
}

const ContractTemplateManager: React.FC<ContractTemplateManagerProps> = ({ 
  employee,
  onClose 
}) => {
  const { toast } = useToast();
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [mergedContent, setMergedContent] = useState('');
  const [savedTemplates, setSavedTemplates] = useState<{id: string, name: string}[]>([
    { id: '1', name: 'Hợp đồng lao động toàn thời gian' },
    { id: '2', name: 'Hợp đồng lao động bán thời gian' },
    { id: '3', name: 'Hợp đồng thử việc' }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleUploadTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setTemplateContent(e.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSaveTemplate = () => {
    if (!templateName || !templateContent) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên mẫu và nội dung mẫu",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would save to the database
    const newTemplate = { id: Date.now().toString(), name: templateName };
    setSavedTemplates([...savedTemplates, newTemplate]);
    toast({
      title: "Thành công",
      description: "Đã lưu mẫu hợp đồng mới"
    });
    setTemplateName('');
  };

  const handleMergeTemplate = () => {
    if (!selectedTemplate && !templateContent) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn hoặc tải lên một mẫu hợp đồng",
        variant: "destructive"
      });
      return;
    }

    if (!employee) {
      toast({
        title: "Lỗi",
        description: "Không có thông tin nhân viên để ghép vào mẫu",
        variant: "destructive"
      });
      return;
    }

    // Simple mail merge example
    let content = templateContent;
    content = content.replace(/{ten_nhan_vien}/g, employee.ten_nhan_su || '');
    content = content.replace(/{chuc_danh}/g, employee.chuc_danh || '');
    content = content.replace(/{bo_phan}/g, employee.bo_phan || '');
    content = content.replace(/{ngay_sinh}/g, employee.ngay_sinh || '');
    content = content.replace(/{dia_chi}/g, employee.dia_chi || '');
    content = content.replace(/{email}/g, employee.email || '');
    content = content.replace(/{dien_thoai}/g, employee.dien_thoai || '');

    setMergedContent(content);
    setActiveTab('preview');
    toast({
      title: "Thành công",
      description: "Đã ghép dữ liệu nhân viên vào mẫu hợp đồng"
    });
  };

  const handleDownloadMergedDocument = () => {
    if (!mergedContent) {
      toast({
        title: "Lỗi",
        description: "Không có nội dung để tải xuống",
        variant: "destructive"
      });
      return;
    }

    const blob = new Blob([mergedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hop_dong_${employee?.ten_nhan_su || 'nhan_vien'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    // In a real app, this would fetch the template content from the database
    setTemplateContent(`Đây là nội dung mẫu hợp đồng với ID ${templateId}.
    
Người lao động: {ten_nhan_vien}
Chức danh: {chuc_danh}
Bộ phận: {bo_phan}
Ngày sinh: {ngay_sinh}
Địa chỉ: {dia_chi}
Email: {email}
Điện thoại: {dien_thoai}

Nội dung hợp đồng sẽ được hiển thị ở đây...`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Quản lý mẫu hợp đồng</CardTitle>
        <CardDescription>
          Tạo và quản lý các mẫu hợp đồng, đồng thời ghép dữ liệu nhân viên vào mẫu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="templates">Mẫu đã lưu</TabsTrigger>
            <TabsTrigger value="upload">Tải lên mẫu mới</TabsTrigger>
            <TabsTrigger value="preview">Xem trước</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4">
              <h3 className="text-lg font-medium">Chọn mẫu hợp đồng</h3>
              <div className="space-y-2">
                {savedTemplates.map(template => (
                  <div 
                    key={template.id} 
                    className={`p-3 border rounded-md cursor-pointer flex items-center ${selectedTemplate === template.id ? 'border-primary bg-primary/10' : 'border-border'}`}
                    onClick={() => handleSelectTemplate(template.id)}
                  >
                    <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span>{template.name}</span>
                  </div>
                ))}
              </div>
              
              {selectedTemplate && (
                <div className="mt-4">
                  <Button onClick={handleMergeTemplate} className="mr-2">
                    Ghép dữ liệu
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Tên mẫu hợp đồng</Label>
                <Input 
                  id="templateName" 
                  placeholder="Nhập tên mẫu hợp đồng" 
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tải lên mẫu</Label>
                <div className="border border-dashed rounded-md p-6 text-center">
                  <FileUp className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Kéo và thả tệp hoặc bấm để chọn
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Hỗ trợ các định dạng .txt, .docx
                  </p>
                  <Input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    accept=".txt,.doc,.docx"
                    onChange={handleUploadTemplate}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('fileUpload')?.click()}
                  >
                    Chọn tệp
                  </Button>
                  {uploadedFile && (
                    <p className="mt-2 text-sm text-green-600">
                      Đã tải lên: {uploadedFile.name}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="templateContent">Nội dung mẫu</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Sử dụng {'{ten_nhan_vien}'}, {'{chuc_danh}'}, {'{bo_phan}'}, v.v. để đánh dấu trường dữ liệu cần thay thế
                </p>
                <Textarea 
                  id="templateContent" 
                  rows={12} 
                  placeholder="Nhập hoặc dán nội dung mẫu hợp đồng" 
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSaveTemplate} className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Lưu mẫu
                </Button>
                {templateContent && (
                  <Button onClick={handleMergeTemplate} className="flex items-center">
                    <FilePlus className="mr-2 h-4 w-4" />
                    Ghép dữ liệu
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            <div className="grid gap-4">
              <h3 className="text-lg font-medium">Xem trước hợp đồng</h3>
              <div className="border rounded-md p-4 bg-background">
                <pre className="whitespace-pre-wrap text-sm font-normal">{mergedContent || 'Chưa có nội dung để hiển thị. Vui lòng ghép dữ liệu trước.'}</pre>
              </div>
              
              {mergedContent && (
                <Button onClick={handleDownloadMergedDocument} className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Tải xuống tệp
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-4">
        <Button variant="outline" onClick={onClose}>Đóng</Button>
      </CardFooter>
    </Card>
  );
};

export default ContractTemplateManager;
