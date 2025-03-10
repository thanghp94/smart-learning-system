
import React, { useState, useEffect } from 'react';
import { Finance, ReceiptTemplate, GeneratedReceipt } from '@/lib/types';
import { financeService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Save, Printer } from 'lucide-react';

interface ReceiptGeneratorProps {
  finance: Finance;
  onClose: () => void;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ finance, onClose }) => {
  const [templates, setTemplates] = useState<ReceiptTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [activeReceipt, setActiveReceipt] = useState<GeneratedReceipt | null>(null);
  const [existingReceipts, setExistingReceipts] = useState<GeneratedReceipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load templates applicable to this finance type
        const templateType = finance.loai_thu_chi === 'income' ? 'income' : 'expense';
        const templatesData = await financeService.getReceiptTemplates(templateType);
        setTemplates(templatesData);
        
        // Set default template if available
        const defaultTemplate = templatesData.find(t => t.is_default);
        if (defaultTemplate) {
          setSelectedTemplateId(defaultTemplate.id);
        } else if (templatesData.length > 0) {
          setSelectedTemplateId(templatesData[0].id);
        }
        
        // Load existing receipts for this finance
        const receiptsData = await financeService.getReceiptsByFinanceId(finance.id);
        setExistingReceipts(receiptsData);
        
        // Set first receipt as active if exists
        if (receiptsData.length > 0) {
          setActiveReceipt(receiptsData[0]);
          setActiveTab('view'); // Switch to view tab if receipts exist
        }
      } catch (error) {
        console.error("Error loading receipt data:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải mẫu biên lai. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [finance.id, finance.loai_thu_chi, toast]);

  const handleGenerateReceipt = async () => {
    if (!selectedTemplateId) {
      toast({
        title: "Cảnh báo",
        description: "Vui lòng chọn mẫu biên lai trước khi tạo.",
        variant: "default",
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const generatedReceipt = await financeService.generateReceipt(finance.id, selectedTemplateId);
      
      toast({
        title: "Thành công",
        description: "Đã tạo biên lai mới",
      });
      
      // Add to existing receipts and set as active
      setExistingReceipts([generatedReceipt, ...existingReceipts]);
      setActiveReceipt(generatedReceipt);
      setActiveTab('view'); // Switch to view tab
    } catch (error) {
      console.error("Error generating receipt:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo biên lai. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintReceipt = async () => {
    if (!activeReceipt) return;
    
    try {
      // Create a new window with the receipt HTML
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: "Lỗi",
          description: "Không thể mở cửa sổ in. Vui lòng kiểm tra trình duyệt của bạn.",
          variant: "destructive",
        });
        return;
      }
      
      // Add styles and content
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Biên lai ${finance.ten_phi || finance.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            @media print {
              body { padding: 0; }
              button { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div>${activeReceipt.generated_html}</div>
          <button onclick="window.print();window.close();" style="margin-top: 20px; padding: 8px 16px;">In biên lai</button>
        </body>
        </html>
      `);
      
      // Mark receipt as printed
      await financeService.markReceiptAsPrinted(activeReceipt.id);
      
      // Refresh receipt list to update printed status
      const updatedReceipts = await financeService.getReceiptsByFinanceId(finance.id);
      setExistingReceipts(updatedReceipts);
      
      // Find and set the updated active receipt
      const updatedActiveReceipt = updatedReceipts.find(r => r.id === activeReceipt.id) || null;
      if (updatedActiveReceipt) {
        setActiveReceipt(updatedActiveReceipt);
      }
    } catch (error) {
      console.error("Error printing receipt:", error);
      toast({
        title: "Lỗi",
        description: "Không thể in biên lai. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadReceipt = async () => {
    if (!activeReceipt) return;
    
    try {
      // Convert HTML to PDF (in a real implementation, this would be server-side)
      // For now, we'll just download the HTML
      const blob = new Blob([activeReceipt.generated_html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Receipt-${finance.id}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      // Mark receipt as printed
      await financeService.markReceiptAsPrinted(activeReceipt.id);
      
      // Refresh receipt list
      const updatedReceipts = await financeService.getReceiptsByFinanceId(finance.id);
      setExistingReceipts(updatedReceipts);
      
      const updatedActiveReceipt = updatedReceipts.find(r => r.id === activeReceipt.id) || null;
      if (updatedActiveReceipt) {
        setActiveReceipt(updatedActiveReceipt);
      }
    } catch (error) {
      console.error("Error downloading receipt:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải xuống biên lai. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleFinalizeReceipt = async () => {
    if (!activeReceipt) return;
    
    try {
      await financeService.finalizeReceipt(activeReceipt.id);
      
      toast({
        title: "Thành công",
        description: "Đã hoàn tất biên lai",
      });
      
      // Refresh receipt list
      const updatedReceipts = await financeService.getReceiptsByFinanceId(finance.id);
      setExistingReceipts(updatedReceipts);
      
      const updatedActiveReceipt = updatedReceipts.find(r => r.id === activeReceipt.id) || null;
      if (updatedActiveReceipt) {
        setActiveReceipt(updatedActiveReceipt);
      }
    } catch (error) {
      console.error("Error finalizing receipt:", error);
      toast({
        title: "Lỗi",
        description: "Không thể hoàn tất biên lai. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="generate" className="flex-1">Tạo Biên Lai Mới</TabsTrigger>
          <TabsTrigger 
            value="view" 
            className="flex-1" 
            disabled={existingReceipts.length === 0}
          >
            Xem Biên Lai ({existingReceipts.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tạo Biên Lai Mới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Chọn Mẫu Biên Lai:</label>
                <Select 
                  value={selectedTemplateId} 
                  onValueChange={setSelectedTemplateId}
                  disabled={templates.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mẫu biên lai" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} {template.is_default && "(Mặc định)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {templates.length === 0 && (
                  <p className="text-sm text-red-500">Không có mẫu biên lai cho loại giao dịch này</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button 
                onClick={handleGenerateReceipt} 
                disabled={!selectedTemplateId || isGenerating}
              >
                {isGenerating ? <Spinner className="mr-2" size="sm" /> : <FileText className="h-4 w-4 mr-2" />}
                Tạo Biên Lai
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Xem Biên Lai</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {existingReceipts.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chọn Biên Lai:</label>
                    <Select 
                      value={activeReceipt?.id || ''} 
                      onValueChange={(id) => {
                        const selected = existingReceipts.find(r => r.id === id) || null;
                        setActiveReceipt(selected);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn biên lai" />
                      </SelectTrigger>
                      <SelectContent>
                        {existingReceipts.map(receipt => (
                          <SelectItem key={receipt.id} value={receipt.id}>
                            {new Date(receipt.created_at || '').toLocaleString()} - 
                            {receipt.status === 'final' ? ' Hoàn tất' : ' Bản nháp'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {activeReceipt && (
                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <h3 className="text-lg font-medium mb-2">Trạng thái biên lai</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Trạng thái:</span> 
                            <span className={`ml-2 ${activeReceipt.status === 'final' ? 'text-green-600' : 'text-amber-600'}`}>
                              {activeReceipt.status === 'final' ? 'Hoàn tất' : 'Bản nháp'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Ngày tạo:</span> 
                            <span className="ml-2">
                              {new Date(activeReceipt.created_at || '').toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Lần in cuối:</span> 
                            <span className="ml-2">
                              {activeReceipt.printed_at ? new Date(activeReceipt.printed_at).toLocaleString() : 'Chưa in'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-2">
                        <div className="bg-white border rounded-md p-4" dangerouslySetInnerHTML={{ __html: activeReceipt.generated_html }} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có biên lai nào được tạo</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab('generate')}
                  >
                    Tạo biên lai mới
                  </Button>
                </div>
              )}
            </CardContent>
            {activeReceipt && (
              <CardFooter className="flex justify-between">
                <div>
                  {activeReceipt.status !== 'final' && (
                    <Button variant="outline" onClick={handleFinalizeReceipt}>
                      <Save className="h-4 w-4 mr-2" />
                      Hoàn tất
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={onClose}>
                    Đóng
                  </Button>
                  <Button variant="outline" onClick={handleDownloadReceipt}>
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống
                  </Button>
                  <Button onClick={handlePrintReceipt}>
                    <Printer className="h-4 w-4 mr-2" />
                    In biên lai
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReceiptGenerator;
