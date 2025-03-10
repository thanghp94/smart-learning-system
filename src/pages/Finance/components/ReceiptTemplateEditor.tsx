
import React, { useState, useEffect } from 'react';
import { ReceiptTemplate } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Eye, Trash } from 'lucide-react';

// This is a simple component for creating/editing receipt templates
// You would typically add this to an admin section

interface ReceiptTemplateEditorProps {
  template?: ReceiptTemplate;
  onSave: (template: Partial<ReceiptTemplate>) => Promise<void>;
  onCancel: () => void;
  onDelete?: (id: string) => Promise<void>;
}

const DEFAULT_TEMPLATE_HTML = `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h1 style="margin: 0; color: #333; font-size: 24px;">{{receipt_type}}</h1>
    <p style="margin: 5px 0;">Ngày: {{ngay}}</p>
  </div>
  
  <div style="margin-bottom: 20px;">
    <table style="width: 100%;">
      <tr>
        <td style="width: 150px;"><strong>Số biên lai:</strong></td>
        <td>{{id}}</td>
      </tr>
      <tr>
        <td><strong>Loại giao dịch:</strong></td>
        <td>{{loai_giao_dich}}</td>
      </tr>
      <tr>
        <td><strong>Tên phí:</strong></td>
        <td>{{ten_phi}}</td>
      </tr>
      <tr>
        <td><strong>Diễn giải:</strong></td>
        <td>{{dien_giai}}</td>
      </tr>
    </table>
  </div>
  
  <div style="margin-bottom: 20px;">
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f3f4f6;">
          <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Số lượng</th>
          <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Đơn vị</th>
          <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Đơn giá</th>
          <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">{{so_luong}}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">{{don_vi}}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">{{gia_tien}}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">{{tong_tien}}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>Tổng cộng:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>{{tong_tien}}</strong></td>
        </tr>
      </tfoot>
    </table>
  </div>
  
  <div style="margin-bottom: 20px;">
    <p><strong>Bằng chữ:</strong> {{bang_chu}}</p>
    <p><strong>Hình thức thanh toán:</strong> {{kieu_thanh_toan}}</p>
    <p><strong>Ghi chú:</strong> {{ghi_chu}}</p>
  </div>
  
  <div style="display: flex; justify-content: space-between; margin-top: 40px;">
    <div style="text-align: center; width: 200px;">
      <p style="margin-bottom: 60px;">Người nhận tiền</p>
      <p>{{nguoi_tao}}</p>
    </div>
    <div style="text-align: center; width: 200px;">
      <p style="margin-bottom: 60px;">Người nộp tiền</p>
      <p>&nbsp;</p>
    </div>
  </div>
  
  <div style="margin-top: 20px; font-size: 12px; text-align: center; color: #666;">
    <p>In ngày: {{current_date}}</p>
  </div>
</div>
`;

const ReceiptTemplateEditor: React.FC<ReceiptTemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [html, setHtml] = useState(template?.template_html || DEFAULT_TEMPLATE_HTML);
  const [type, setType] = useState<'income' | 'expense' | 'all'>(template?.type || 'all');
  const [isDefault, setIsDefault] = useState(template?.is_default || false);
  const [preview, setPreview] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === 'preview') {
      updatePreview();
    }
  }, [activeTab]);

  const updatePreview = () => {
    // Replace placeholders with sample data
    let result = html;
    
    const replacements: Record<string, string> = {
      '{{id}}': 'RECEIPT-001',
      '{{ngay}}': new Date().toLocaleDateString('vi-VN'),
      '{{ten_phi}}': 'Học phí khóa học',
      '{{dien_giai}}': 'Thanh toán học phí khoá học Python cơ bản',
      '{{loai_giao_dich}}': 'Học phí',
      '{{so_luong}}': '1',
      '{{don_vi}}': 'Khóa',
      '{{gia_tien}}': '2.000.000 ₫',
      '{{tong_tien}}': '2.000.000 ₫',
      '{{bang_chu}}': 'Hai triệu đồng chẵn',
      '{{kieu_thanh_toan}}': 'Tiền mặt',
      '{{ghi_chu}}': 'Đã thanh toán đầy đủ',
      '{{tg_tao}}': new Date().toISOString(),
      '{{nguoi_tao}}': 'Nguyễn Văn A',
      '{{current_date}}': new Date().toLocaleDateString('vi-VN'),
      '{{receipt_type}}': type === 'income' ? 'PHIẾU THU' : (type === 'expense' ? 'PHIẾU CHI' : 'BIÊN LAI')
    };
    
    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(key, 'g'), value);
    }
    
    setPreview(result);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên mẫu biên lai không được để trống",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSave({
        id: template?.id,
        name,
        description,
        template_html: html,
        type,
        is_default: isDefault,
      });
      
      toast({
        title: "Thành công",
        description: template ? "Đã cập nhật mẫu biên lai" : "Đã tạo mẫu biên lai mới",
      });
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu mẫu biên lai. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!template?.id || !onDelete) return;
    
    if (!confirm("Bạn có chắc chắn muốn xóa mẫu biên lai này không?")) {
      return;
    }
    
    try {
      await onDelete(template.id);
      toast({
        title: "Thành công",
        description: "Đã xóa mẫu biên lai",
      });
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa mẫu biên lai. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{template ? 'Chỉnh sửa mẫu biên lai' : 'Tạo mẫu biên lai mới'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên mẫu biên lai:</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Nhập tên mẫu biên lai" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Loại biên lai:</label>
            <Select 
              value={type} 
              onValueChange={(value) => setType(value as 'income' | 'expense' | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại biên lai" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Phiếu thu</SelectItem>
                <SelectItem value="expense">Phiếu chi</SelectItem>
                <SelectItem value="all">Tất cả</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Mô tả:</label>
          <Textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Mô tả về mẫu biên lai này" 
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            checked={isDefault} 
            onCheckedChange={setIsDefault} 
            id="is-default"
          />
          <label htmlFor="is-default" className="text-sm font-medium cursor-pointer">
            Đặt làm mẫu mặc định
          </label>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="editor" className="flex-1">Mã HTML</TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">Xem trước</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="space-y-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mã HTML:</label>
              <div className="relative">
                <Textarea 
                  value={html} 
                  onChange={(e) => setHtml(e.target.value)} 
                  placeholder="Nhập mã HTML cho mẫu biên lai" 
                  className="min-h-[400px] font-mono text-sm"
                />
              </div>
              <p className="text-sm text-gray-500">
                Sử dụng các placeholder sau để chèn dữ liệu: {{'{{'}}id}}, {{'{{'}}ngay}}, {{'{{'}}dien_giai}}, 
                {{'{{'}}ten_phi}}, {{'{{'}}loai_giao_dich}}, {{'{{'}}so_luong}}, {{'{{'}}don_vi}}, 
                {{'{{'}}gia_tien}}, {{'{{'}}tong_tien}}, {{'{{'}}bang_chu}}, {{'{{'}}kieu_thanh_toan}}, 
                {{'{{'}}ghi_chu}}, {{'{{'}}nguoi_tao}}, {{'{{'}}current_date}}, {{'{{'}}receipt_type}}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="space-y-2">
              <div className="border rounded-md p-4 bg-white">
                <div dangerouslySetInnerHTML={{ __html: preview }} />
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={updatePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Cập nhật xem trước
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {template && onDelete && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash className="h-4 w-4 mr-2" />
              Xóa
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Lưu
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReceiptTemplateEditor;
