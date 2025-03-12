
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Student } from '@/lib/types';

const emailSchema = z.object({
  to: z.string().email({ message: 'Vui lòng nhập email hợp lệ' }),
  subject: z.string().min(1, { message: 'Vui lòng nhập tiêu đề' }),
  content: z.string().min(1, { message: 'Vui lòng nhập nội dung' }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

interface StudentEmailFormProps {
  student: Student;
  onClose: () => void;
}

const StudentEmailForm: React.FC<StudentEmailFormProps> = ({ student, onClose }) => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  
  const studentName = student.ho_va_ten || student.ten_hoc_sinh;
  const email = student.email || student.email_ph1;
  
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      to: email || '',
      subject: `Thông tin học sinh: ${studentName}`,
      content: `Kính gửi phụ huynh học sinh ${studentName},\n\n`,
    },
  });
  
  const handleSubmit = async (values: EmailFormValues) => {
    setIsSending(true);
    
    // In a real app, this would connect to an email sending service
    try {
      // Simulate email sending with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Gửi email thành công',
        description: `Email đã được gửi đến ${values.to}`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Gửi email thất bại',
        description: 'Có lỗi xảy ra, vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Người nhận</FormLabel>
              <FormControl>
                <Input {...field} disabled={isSending} />
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
                <Input {...field} disabled={isSending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  rows={10} 
                  disabled={isSending} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSending}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isSending}>
            {isSending ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
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
