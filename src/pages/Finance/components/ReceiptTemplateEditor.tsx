import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { financeService } from '@/lib/supabase';
import { ReceiptTemplate } from '@/lib/types';

interface ReceiptTemplateEditorProps {
  templateId?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const ReceiptTemplateEditor: React.FC<ReceiptTemplateEditorProps> = ({ 
  templateId, 
  onCancel,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template_html: '',
    type: 'all',
    is_default: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId) return;
      
      setIsLoading(true);
      try {
        const template = await financeService.getReceiptTemplateById(templateId);
        if (template) {
          setFormData({
            name: template.name,
            description: template.description || '',
            template_html: template.template_html,
            type: template.type,
            is_default: template.is_default
          });
        }
      } catch (error) {
        console.error('Error loading template:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải mẫu biên lai',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTemplate();
  }, [templateId, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_default: checked }));
  };

  const handleTypeChange = (value: string) => {
    // Ensure type is one of the allowed values
    const validType = value === 'income' || value === 'expense' || value === 'all' 
      ? value 
      : 'all';
    
    setFormData(prev => ({ ...prev, type: validType }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a properly typed template object
    const templateData: Partial<ReceiptTemplate> = {
      name: formData.name,
      description: formData.description,
      template_html: formData.template_html,
      type: formData.type as 'income' | 'expense' | 'all',
      is_default: formData.is_default
    };
    
    setIsSaving(true);
    try {
      if (templateId) {
        await financeService.updateReceiptTemplate(templateId, templateData);
        toast({ title: 'Thành công', description: 'Đã cập nhật mẫu biên lai' });
      } else {
        await financeService.createReceiptTemplate(templateData);
        toast({ title: 'Thành công', description: 'Đã tạo mẫu biên lai mới' });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu mẫu biên lai',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderPlaceholders = () => {
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Các biến có sẵn:</h4>
        <ul className="list-disc pl-5 text-sm">
          <li><code>{{id}}</code> - ID giao dịch</li>
          <li><code>{{ngay}}</code> - Ngày giao dịch</li>
          <li><code>{{ten_phi}}</code> - Tên phí</li>
          <li><code>{{dien_giai}}</code> - Diễn giải</li>
          <li><code>{{loai_giao_dich}}</code> - Loại giao dịch</li>
          <li><code>{{so_luong}}</code> - Số lượng</li>
          <li><code>{{don_vi}}</code> - Đơn vị</li>
          <li><code>{{gia_tien}}</code> - Giá tiền</li>
          <li><code>{{tong_tien}}</code> - Tổng tiền</li>
          <li><code>{{bang_chu}}</code> - Bằng chữ</li>
          <li><code>{{kieu_thanh_toan}}</code> - Kiểu thanh toán</li>
          <li><code>{{ghi_chu}}</code> - Ghi chú</li>
          <li><code>{{tg_tao}}</code> - Thời gian tạo</li>
          <li><code>{{nguoi_tao}}</code> - Người tạo</li>
          <li><code>{{current_date}}</code> - Ngày hiện tại</li>
          <li><code>{{receipt_type}}</code> - Loại biên lai (PHIẾU THU/PHIẾU CHI)</li>
        </ul>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên mẫu</Label>
          <Input 
            type="text" 
            id="name" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Input 
            type="text" 
            id="description" 
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="template_html">Nội dung HTML</Label>
        <Textarea
          id="template_html"
          name="template_html"
          value={formData.template_html}
          onChange={handleInputChange}
          rows={8}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Loại mẫu</Label>
          <Select value={formData.type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="income">Phiếu thu</SelectItem>
              <SelectItem value="expense">Phiếu chi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="is_default">Mặc định</Label>
          <Switch
            id="is_default"
            checked={formData.is_default}
            onCheckedChange={handleSwitchChange}
          />
        </div>
      </div>

      <Tabs defaultValue="editor" className="space-y-4">
        <TabsList>
          <TabsTrigger value="editor">Chỉnh sửa</TabsTrigger>
          <TabsTrigger value="placeholders">Biến</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="space-y-4">
          {/* Editor content already in the form */}
        </TabsContent>
        <TabsContent value="placeholders">
          {renderPlaceholders()}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </div>
    </form>
  );
};

export default ReceiptTemplateEditor;
