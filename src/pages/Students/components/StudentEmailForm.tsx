
import React, { useState } from 'react';
import { Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

// Email templates
const EMAIL_TEMPLATES = [
  {
    id: 'trial_invitation',
    name: 'Mời học thử',
    subject: 'Mời tham gia lớp học thử tại [Tên trung tâm]',
    body: `Kính gửi Phụ huynh {parentName},

Chúng tôi xin thông báo buổi học thử cho bé {studentName} đã được sắp xếp vào ngày [Ngày học thử] tại [Địa chỉ trung tâm].

Thông tin chi tiết:
- Thời gian: [Giờ bắt đầu] - [Giờ kết thúc]
- Lớp: [Tên lớp]
- Giáo viên: [Tên giáo viên]

Vui lòng đến trước 15 phút để làm thủ tục.

Xin cảm ơn và mong gặp lại Phụ huynh và bé vào ngày học thử!

Trân trọng,
[Tên trung tâm]`
  },
  {
    id: 'payment_confirmation',
    name: 'Xác nhận đóng học phí',
    subject: 'Xác nhận thanh toán học phí',
    body: `Kính gửi Phụ huynh {parentName},

Trung tâm xin xác nhận đã nhận được khoản thanh toán học phí của bé {studentName} với thông tin như sau:

- Học phí khóa: [Tên khóa học]
- Số tiền: [Số tiền] VNĐ
- Ngày thanh toán: [Ngày thanh toán]
- Phương thức thanh toán: [Phương thức thanh toán]

Cảm ơn Phụ huynh đã tin tưởng trung tâm. Chúng tôi sẽ luôn cố gắng mang đến những trải nghiệm học tập tốt nhất cho bé.

Trân trọng,
[Tên trung tâm]`
  },
  {
    id: 'class_reminder',
    name: 'Nhắc lịch học',
    subject: 'Nhắc lịch học ngày mai',
    body: `Kính gửi Phụ huynh {parentName},

Trung tâm xin nhắc lịch học ngày mai của bé {studentName} như sau:

- Thời gian: [Giờ bắt đầu] - [Giờ kết thúc]
- Lớp: [Tên lớp]
- Phòng: [Số phòng]
- Giáo viên: [Tên giáo viên]

Xin vui lòng đưa bé đến đúng giờ.

Trân trọng,
[Tên trung tâm]`
  },
  {
    id: 'custom',
    name: 'Tùy chỉnh email',
    subject: '',
    body: ''
  }
];

interface StudentEmailFormProps {
  student: Student;
  onClose: () => void;
}

const formSchema = z.object({
  templateId: z.string(),
  to: z.string().email("Email không hợp lệ"),
  subject: z.string().min(1, "Vui lòng nhập tiêu đề"),
  body: z.string().min(1, "Vui lòng nhập nội dung email"),
});

const StudentEmailForm: React.FC<StudentEmailFormProps> = ({ student, onClose }) => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateId: 'trial_invitation',
      to: student.email || '',
      subject: EMAIL_TEMPLATES[0].subject,
      body: EMAIL_TEMPLATES[0].body
        .replace('{studentName}', student.ho_va_ten || student.ten_hoc_sinh || '')
        .replace('{parentName}', student.ten_phu_huynh || 'Phụ huynh')
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSending(true);
    try {
      // In a real implementation, send the email via an API or edge function
      console.log('Sending email with values:', values);
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Gửi email thành công',
        description: `Email đã được gửi tới ${values.to}`,
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
  
  const handleTemplateChange = (templateId: string) => {
    const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      let subject = template.subject;
      let body = template.body;
      
      // Replace placeholders
      body = body
        .replace('{studentName}', student.ho_va_ten || student.ten_hoc_sinh || '')
        .replace('{parentName}', student.ten_phu_huynh || 'Phụ huynh');
      
      form.setValue('subject', subject);
      form.setValue('body', body);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="templateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mẫu email</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleTemplateChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mẫu email" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EMAIL_TEMPLATES.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Người nhận</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Email người nhận" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nhập tiêu đề email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Nhập nội dung email" 
                  className="min-h-[200px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSending}>
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang gửi...
              </>
            ) : (
              'Gửi email'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StudentEmailForm;
