
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { emailTemplateService, EmailTemplate } from '@/lib/supabase/email-template-service';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

interface EmailDialogProps {
  open: boolean;
  onClose: () => void;
  recipientEmail: string;
  recipientName: string;
  recipientType: 'student' | 'employee' | 'candidate';
}

const EmailDialog: React.FC<EmailDialogProps> = ({
  open,
  onClose,
  recipientEmail,
  recipientName,
  recipientType,
}) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open, recipientType]);

  const loadTemplates = async () => {
    try {
      const templateData = await emailTemplateService.getByType(recipientType);
      setTemplates(templateData);
      
      // Set default template if available
      const defaultTemplate = templateData.find(t => t.is_default);
      if (defaultTemplate) {
        setSelectedTemplate(defaultTemplate.id);
        setSubject(defaultTemplate.subject);
        setBody(replaceTemplateVariables(defaultTemplate.body));
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải mẫu email',
        variant: 'destructive',
      });
    }
  };

  const replaceTemplateVariables = (text: string) => {
    return text
      .replace(/{{student_name}}/g, recipientType === 'student' ? recipientName : '')
      .replace(/{{employee_name}}/g, recipientType === 'employee' ? recipientName : '')
      .replace(/{{candidate_name}}/g, recipientType === 'candidate' ? recipientName : '')
      .replace(/{{name}}/g, recipientName);
  };

  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplate(templateId);
    
    if (!templateId) return;
    
    try {
      const template = await emailTemplateService.getById(templateId);
      setSubject(template.subject);
      setBody(replaceTemplateVariables(template.body));
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  const handleSendEmail = async () => {
    if (!subject.trim() || !body.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập tiêu đề và nội dung email',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: recipientEmail,
          subject,
          html: body,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Thành công',
        description: 'Email đã được gửi thành công',
      });
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể gửi email. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gửi email đến {recipientName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tới:</Label>
            <Input value={recipientEmail} readOnly className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Mẫu Email:</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn mẫu email" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tiêu đề:</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Label className="text-right mt-2">Nội dung:</Label>
            <div className="col-span-3">
              <Tabs defaultValue="rich-text">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="rich-text">Soạn email</TabsTrigger>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                </TabsList>
                <TabsContent value="rich-text">
                  <Textarea
                    value={body.replace(/<[^>]*>/g, '')}
                    onChange={(e) => setBody(e.target.value)}
                    className="min-h-[200px]"
                  />
                </TabsContent>
                <TabsContent value="html">
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSendEmail} disabled={isSending}>
            {isSending ? 'Đang gửi...' : 'Gửi email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;
