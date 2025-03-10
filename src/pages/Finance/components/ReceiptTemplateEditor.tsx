
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReceiptTemplate } from '@/lib/types';
import { financeService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ReceiptTemplateEditorProps {
  template?: ReceiptTemplate;
  onSave: (template: ReceiptTemplate) => void;
  onCancel: () => void;
}

const defaultTemplate = {
  name: '',
  description: '',
  template_html: `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
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
      <p style="margin-bottom: 60px;">Người thực hiện</p>
      <p>{{nguoi_tao}}</p>
    </div>
    <div style="text-align: center; width: 200px;">
      <p style="margin-bottom: 60px;">Người nhận/chi tiền</p>
      <p>&nbsp;</p>
    </div>
  </div>
  
  <div style="margin-top: 20px; font-size: 12px; text-align: center; color: #666;">
    <p>In ngày: {{current_date}}</p>
  </div>
</div>`,
  type: 'all',
  is_default: false
};

const ReceiptTemplateEditor: React.FC<ReceiptTemplateEditorProps> = ({ 
  template, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Partial<ReceiptTemplate>>(
    template || defaultTemplate
  );
  const [activeTab, setActiveTab] = useState<string>('edit');
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // Generate preview when template changes or tab switches
    if (activeTab === 'preview') {
      generatePreview();
    }
  }, [formData.template_html, activeTab]);

  const generatePreview = () => {
    // Create a sample finance data for preview
    const sampleData = {
      id: 'SAMPLE-ID-12345',
      ngay: new Date().toLocaleDateString('vi-VN'),
      loai_thu_chi: formData.type === 'income' ? 'income' : 'expense',
      loai_giao_dich: 'Học phí',
      ten_phi: 'Học phí tháng 6/2023',
      dien_giai: 'Thanh toán học phí khóa học Toán nâng cao',
      so_luong: 1,
      don_vi: 1,
      gia_tien: 2000000,
      tong_tien: 2000000,
      bang_chu: 'Hai triệu đồng',
      kieu_thanh_toan: 'Tiền mặt',
      ghi_chu: 'Đã thanh toán đầy đủ',
      nguoi_tao: 'Nguyễn Văn A',
      tg_tao: new Date().toISOString(),
    };

    // Simple template engine to replace placeholders
    let html = formData.template_html || '';
    
    // Replace each placeholder with sample data
    html = html.replace(/{{id}}/g, sampleData.id);
    html = html.replace(/{{ngay}}/g, sampleData.ngay);
    html = html.replace(/{{ten_phi}}/g, sampleData.ten_phi);
    html = html.replace(/{{dien_giai}}/g, sampleData.dien_giai);
    html = html.replace(/{{loai_giao_dich}}/g, sampleData.loai_giao_dich);
    html = html.replace(/{{so_luong}}/g, sampleData.so_luong.toString());
    html = html.replace(/{{don_vi}}/g, sampleData.don_vi.toString());
    html = html.replace(/{{gia_tien}}/g, new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sampleData.gia_tien));
    html = html.replace(/{{tong_tien}}/g, new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sampleData.tong_tien));
    html = html.replace(/{{bang_chu}}/g, sampleData.bang_chu);
    html = html.replace(/{{kieu_thanh_toan}}/g, sampleData.kieu_thanh_toan);
    html = html.replace(/{{ghi_chu}}/g, sampleData.ghi_chu);
    html = html.replace(/{{nguoi_tao}}/g, sampleData.nguoi_tao);
    html = html.replace(/{{current_date}}/g, new Date().toLocaleDateString('vi-VN'));
    html = html.replace(/{{receipt_type}}/g, sampleData.loai_thu_chi === 'income' ? 'PHIẾU THU' : 'PHIẾU CHI');
    
    setPreviewHtml(html);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value as 'income' | 'expense' | 'all' }));
  };

  const handleDefaultChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_default: checked }));
  };

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.template_html) {
        toast({
          title: "Lỗi",
          description: "Vui lòng điền đầy đủ thông tin mẫu biên lai",
          variant: "destructive"
        });
        return;
      }

      // Call the onSave callback with the current form data
      onSave(formData as ReceiptTemplate);
      
      toast({
        title: "Thành công",
        description: "Đã lưu mẫu biên lai thành công",
      });
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu mẫu biên lai. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Chỉnh sửa mẫu</TabsTrigger>
          <TabsTrigger value="preview">Xem trước</TabsTrigger>
          <TabsTrigger value="placeholders">Danh sách biến</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Tên mẫu biên lai</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Nhập tên mẫu biên lai..."
              />
            </div>
            
            <div>
              <Label htmlFor="type">Loại biên lai</Label>
              <RadioGroup 
                value={formData.type} 
                onValueChange={handleTypeChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income">Thu</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense">Chi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">Cả hai</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description || ''} 
              onChange={handleInputChange}
              placeholder="Nhập mô tả ngắn về mẫu biên lai này..."
              rows={2}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="is_default" 
              checked={formData.is_default}
              onCheckedChange={handleDefaultChange}
            />
            <Label htmlFor="is_default">Đặt làm mẫu mặc định</Label>
          </div>
          
          <div>
            <Label htmlFor="template_html">Mã HTML</Label>
            <Textarea 
              id="template_html" 
              name="template_html" 
              value={formData.template_html || ''} 
              onChange={handleInputChange}
              placeholder="Nhập mã HTML cho mẫu biên lai..."
              rows={15}
              className="font-mono text-sm"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card className="p-4 border">
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </Card>
        </TabsContent>
        
        <TabsContent value="placeholders">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Các biến có thể sử dụng trong mẫu</h3>
            <p className="mb-4 text-sm text-gray-500">
              Sử dụng các biến sau trong mẫu HTML của bạn. Mỗi biến phải được đặt trong cặp dấu
              ngoặc nhọn kép: <code className="bg-gray-100 px-1 py-0.5 rounded">{'{{biến}}'}</code>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="text-sm"><code>{'{{id}}'}</code>: ID của giao dịch</div>
              <div className="text-sm"><code>{'{{ngay}}'}</code>: Ngày giao dịch</div>
              <div className="text-sm"><code>{'{{ten_phi}}'}</code>: Tên phí</div>
              <div className="text-sm"><code>{'{{dien_giai}}'}</code>: Diễn giải</div>
              <div className="text-sm"><code>{'{{loai_giao_dich}}'}</code>: Loại giao dịch</div>
              <div className="text-sm"><code>{'{{so_luong}}'}</code>: Số lượng</div>
              <div className="text-sm"><code>{'{{don_vi}}'}</code>: Đơn vị</div>
              <div className="text-sm"><code>{'{{gia_tien}}'}</code>: Giá tiền</div>
              <div className="text-sm"><code>{'{{tong_tien}}'}</code>: Tổng tiền</div>
              <div className="text-sm"><code>{'{{bang_chu}}'}</code>: Bằng chữ</div>
              <div className="text-sm"><code>{'{{kieu_thanh_toan}}'}</code>: Kiểu thanh toán</div>
              <div className="text-sm"><code>{'{{nguoi_tao}}'}</code>: Người tạo</div>
              <div className="text-sm"><code>{'{{ghi_chu}}'}</code>: Ghi chú</div>
              <div className="text-sm"><code>{'{{current_date}}'}</code>: Ngày hiện tại</div>
              <div className="text-sm"><code>{'{{receipt_type}}'}</code>: "PHIẾU THU" hoặc "PHIẾU CHI"</div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onCancel}>Hủy</Button>
        <Button onClick={handleSave}>Lưu mẫu</Button>
      </div>
    </div>
  );
};

export default ReceiptTemplateEditor;
