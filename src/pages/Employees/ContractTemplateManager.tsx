import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Employee } from '@/lib/types';
import { FileUp, FilePlus, Download, Save, FileText, Link2, Plus, Copy } from 'lucide-react';
import { employeeService } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

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
  const [googleDocsUrl, setGoogleDocsUrl] = useState('');
  const [activeTab, setActiveTab] = useState('templates');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [mergedContent, setMergedContent] = useState('');
  const [savedTemplates, setSavedTemplates] = useState<{id: string, name: string, isGoogleDoc?: boolean, url?: string}[]>([
    { id: '1', name: 'Hợp đồng lao động toàn thời gian' },
    { id: '2', name: 'Hợp đồng lao động bán thời gian' },
    { id: '3', name: 'Hợp đồng thử việc' }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>(employee?.id || '');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showPlaceholderHelp, setShowPlaceholderHelp] = useState(false);
  const [exportFields, setExportFields] = useState<Record<string, boolean>>({
    ten_nhan_vien: true,
    chuc_danh: true,
    bo_phan: true,
    ngay_sinh: true,
    dia_chi: true,
    email: true,
    dien_thoai: true,
    luong_co_ban: true,
    ngay_vao_lam: true,
  });

  const getTemplateDataContext = (employee: Employee) => {
    if (!employee) return {};
    
    // Format date for display if available
    const formattedBirthDate = employee.ngay_sinh 
      ? format(new Date(employee.ngay_sinh), 'dd/MM/yyyy') 
      : '';
    
    const formattedStartDate = employee.ngay_vao_lam 
      ? format(new Date(employee.ngay_vao_lam), 'dd/MM/yyyy') 
      : '';
    
    return {
      TEN_NHAN_VIEN: employee.ten_nhan_su || '',
      CHUC_DANH: employee.chuc_danh || '',
      NGAY_SINH: formattedBirthDate,
      DIA_CHI: employee.dia_chi || '',
      SDT: employee.dien_thoai || '',
      EMAIL: employee.email || '',
      BO_PHAN: employee.bo_phan || '',
      LUONG_CO_BAN: employee.luong_co_ban || '',
      NGAY_VAO_LAM: formattedStartDate,
      // Add more fields as needed
    };
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getAll();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách nhân viên',
          variant: 'destructive'
        });
      }
    };

    fetchEmployees();
  }, [toast]);

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
    if ((!templateName || (!templateContent && !googleDocsUrl))) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên mẫu và nội dung mẫu hoặc liên kết Google Docs",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would save to the database
    const newTemplate = { 
      id: Date.now().toString(), 
      name: templateName,
      isGoogleDoc: !!googleDocsUrl,
      url: googleDocsUrl || undefined
    };
    setSavedTemplates([...savedTemplates, newTemplate]);
    toast({
      title: "Thành công",
      description: "Đã lưu mẫu hợp đồng mới"
    });
    setTemplateName('');
    setGoogleDocsUrl('');
    setTemplateContent('');
  };

  const handleMergeTemplate = () => {
    if ((!selectedTemplate || (!templateContent && !googleDocsUrl)) && !selectedEmployee) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn mẫu hợp đồng và nhân viên",
        variant: "destructive"
      });
      return;
    }

    const selectedEmp = employee || employees.find(emp => emp.id === selectedEmployee);
    if (!selectedEmp) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin nhân viên",
        variant: "destructive"
      });
      return;
    }

    const template = savedTemplates.find(t => t.id === selectedTemplate);
    if (template?.isGoogleDoc && template?.url) {
      // For Google Docs, open in a new tab
      window.open(`${template.url}?usp=sharing`, '_blank');
      toast({
        title: "Thành công",
        description: "Đã mở mẫu Google Docs. Hãy sử dụng tính năng 'Make a copy' và sau đó sử dụng công cụ Mail Merge để ghép dữ liệu."
      });
      return;
    }

    // Simple mail merge example
    let content = templateContent;
    
    // Only include fields marked for export
    if (exportFields.ten_nhan_vien) {
      content = content.replace(/{ten_nhan_vien}/g, selectedEmp.ten_nhan_su || '');
    }
    if (exportFields.chuc_danh) {
      content = content.replace(/{chuc_danh}/g, selectedEmp.chuc_danh || '');
    }
    if (exportFields.bo_phan) {
      content = content.replace(/{bo_phan}/g, selectedEmp.bo_phan || '');
    }
    if (exportFields.ngay_sinh) {
      content = content.replace(/{ngay_sinh}/g, selectedEmp.ngay_sinh || '');
    }
    if (exportFields.dia_chi) {
      content = content.replace(/{dia_chi}/g, selectedEmp.dia_chi || '');
    }
    if (exportFields.email) {
      content = content.replace(/{email}/g, selectedEmp.email || '');
    }
    if (exportFields.dien_thoai) {
      content = content.replace(/{dien_thoai}/g, selectedEmp.dien_thoai || '');
    }
    if (exportFields.luong_co_ban) {
      content = content.replace(/{luong_co_ban}/g, selectedEmp.luong_co_ban?.toString() || '');
    }
    if (exportFields.ngay_vao_lam) {
      content = content.replace(/{ngay_vao_lam}/g, selectedEmp.ngay_vao_lam || '');
    }

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
    
    const template = savedTemplates.find(t => t.id === templateId);
    if (template?.isGoogleDoc) {
      setTemplateContent(''); // Clear text content for Google Docs
      return;
    }
    
    // In a real app, this would fetch the template content from the database
    setTemplateContent(`Đây là nội dung mẫu hợp đồng với ID ${templateId}.
    
Người lao động: {ten_nhan_vien}
Chức danh: {chuc_danh}
Bộ phận: {bo_phan}
Ngày sinh: {ngay_sinh}
Địa chỉ: {dia_chi}
Email: {email}
Điện thoại: {dien_thoai}
Lương cơ bản: {luong_co_ban}
Ngày vào làm: {ngay_vao_lam}

Nội dung hợp đồng sẽ được hiển thị ở đây...`);
  };

  const handleCopyGoogleDocsInstructions = () => {
    navigator.clipboard.writeText(`Các trường dữ liệu có thể sử dụng trong Mail Merge:
- ten_nhan_vien: Tên nhân viên
- chuc_danh: Chức danh
- bo_phan: Bộ phận
- ngay_sinh: Ngày sinh
- dia_chi: Địa chỉ
- email: Email
- dien_thoai: Điện thoại
- luong_co_ban: Lương cơ bản
- ngay_vao_lam: Ngày vào làm`);
    
    toast({
      title: "Thành công",
      description: "Đã sao chép thông tin trường dữ liệu vào clipboard"
    });
  };

  const renderPlaceholderHelp = () => (
    <Dialog open={showPlaceholderHelp} onOpenChange={setShowPlaceholderHelp}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Trợ giúp về trường dữ liệu</DialogTitle>
          <DialogDescription>
            Sử dụng các trường dữ liệu sau trong mẫu của bạn để thay thế bằng thông tin nhân viên.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Trường</div>
              <div className="font-medium">Mô tả</div>
              <div><code>{'{'}<span className="text-blue-500">ten_nhan_vien</span>{'}'}</code></div>
              <div>Tên nhân viên</div>
              <div><code>{'{'}<span className="text-blue-500">chuc_danh</span>{'}'}</code></div>
              <div>Chức danh</div>
              <div><code>{'{'}<span className="text-blue-500">bo_phan</span>{'}'}</code></div>
              <div>Bộ phận</div>
              <div><code>{'{'}<span className="text-blue-500">ngay_sinh</span>{'}'}</code></div>
              <div>Ngày sinh</div>
              <div><code>{'{'}<span className="text-blue-500">dia_chi</span>{'}'}</code></div>
              <div>Địa chỉ</div>
              <div><code>{'{'}<span className="text-blue-500">email</span>{'}'}</code></div>
              <div>Email</div>
              <div><code>{'{'}<span className="text-blue-500">dien_thoai</span>{'}'}</code></div>
              <div>Điện thoại</div>
              <div><code>{'{'}<span className="text-blue-500">luong_co_ban</span>{'}'}</code></div>
              <div>Lương cơ bản</div>
              <div><code>{'{'}<span className="text-blue-500">ngay_vao_lam</span>{'}'}</code></div>
              <div>Ngày vào làm</div>
            </div>
          </div>
          <Button 
            onClick={handleCopyGoogleDocsInstructions} 
            variant="outline" 
            className="w-full mt-4"
          >
            <Copy className="h-4 w-4 mr-2" /> Sao chép tất cả
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={() => setShowPlaceholderHelp(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

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
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Chọn mẫu hợp đồng</h3>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                    {savedTemplates.map(template => (
                      <div 
                        key={template.id} 
                        className={`p-3 border rounded-md cursor-pointer flex items-center ${selectedTemplate === template.id ? 'border-primary bg-primary/10' : 'border-border'}`}
                        onClick={() => handleSelectTemplate(template.id)}
                      >
                        {template.isGoogleDoc ? (
                          <Link2 className="mr-2 h-5 w-5 text-blue-500" />
                        ) : (
                          <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                        )}
                        <span>{template.name}</span>
                        {template.isGoogleDoc && (
                          <span className="ml-auto text-xs text-blue-500">Google Docs</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Thông tin nhân viên</h3>
                  
                  {!employee && (
                    <Select 
                      value={selectedEmployee} 
                      onValueChange={setSelectedEmployee}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhân viên" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.ten_nhan_su}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {(employee || selectedEmployee) && (
                    <div className="p-3 border rounded-md">
                      <h4 className="font-medium mb-2">Trường dữ liệu xuất ra</h4>
                      <div className="space-y-2">
                        {Object.entries({
                          ten_nhan_vien: 'Tên nhân viên',
                          chuc_danh: 'Chức danh',
                          bo_phan: 'Bộ phận',
                          ngay_sinh: 'Ngày sinh',
                          dia_chi: 'Địa chỉ',
                          email: 'Email',
                          dien_thoai: 'Điện thoại',
                          luong_co_ban: 'Lương cơ bản',
                          ngay_vao_lam: 'Ngày vào làm'
                        }).map(([field, label]) => (
                          <div key={field} className="flex items-center space-x-2">
                            <Checkbox 
                              id={field}
                              checked={!!exportFields[field]}
                              onCheckedChange={(checked) => 
                                setExportFields({...exportFields, [field]: !!checked})
                              }
                            />
                            <label 
                              htmlFor={field}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedTemplate && (selectedEmployee || employee) && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleMergeTemplate} className="flex items-center">
                    <FilePlus className="mr-2 h-4 w-4" />
                    Ghép dữ liệu
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
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
                  <div className="flex justify-between">
                    <Label>Liên kết Google Docs</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => setShowPlaceholderHelp(true)}
                    >
                      Xem hướng dẫn trường dữ liệu
                    </Button>
                  </div>
                  <Input 
                    placeholder="https://docs.google.com/document/d/..." 
                    value={googleDocsUrl}
                    onChange={(e) => setGoogleDocsUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nhập liên kết đến tài liệu Google Docs của bạn. Đảm bảo rằng đã đặt quyền chia sẻ để mọi người có thể xem.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Hoặc tải lên mẫu</Label>
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
            </div>
            
            {(!googleDocsUrl || templateContent) && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="templateContent">Nội dung mẫu</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs"
                    onClick={() => setShowPlaceholderHelp(true)}
                  >
                    Xem trợ giúp
                  </Button>
                </div>
                <Textarea 
                  id="templateContent" 
                  rows={12} 
                  placeholder="Nhập hoặc dán nội dung mẫu hợp đồng" 
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                />
              </div>
            )}
              
            <div className="flex gap-2">
              <Button onClick={handleSaveTemplate} className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Lưu mẫu
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            <div className="grid gap-4">
              <h3 className="text-lg font-medium">Xem trước hợp đồng</h3>
              <div className="border rounded-md p-4 bg-background min-h-[200px]">
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
        
        {renderPlaceholderHelp()}
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-4">
        <Button variant="outline" onClick={onClose}>Đóng</Button>
      </CardFooter>
    </Card>
  );
};

export default ContractTemplateManager;
