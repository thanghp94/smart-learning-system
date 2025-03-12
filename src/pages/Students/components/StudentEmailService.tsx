
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Student } from '@/lib/types';

const emailSchema = z.object({
  to: z.string().email({ message: 'Vui lòng nhập email hợp lệ' }),
  subject: z.string().min(1, { message: 'Vui lòng nhập tiêu đề' }),
  content: z.string().min(1, { message: 'Vui lòng nhập nội dung' }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

interface StudentEmailServiceProps {
  student: Student;
  buttonLabel?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null;
  buttonSize?: "default" | "sm" | "lg" | "icon" | null;
  className?: string;
  onClose?: () => void;
}

const StudentEmailService: React.FC<StudentEmailServiceProps> = ({
  student,
  buttonLabel = "Gửi email",
  buttonVariant = "outline",
  buttonSize = "sm",
  className = "",
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
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
    
    try {
      console.log('Sending email with data:', values);
      
      // In a real implementation, this would call an Edge Function
      // that would handle the actual email sending
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Gửi email thành công',
        description: `Email đã được gửi đến ${values.to}`,
      });
      
      handleClose();
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
  
  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };
  
  return (
    <>
      <Button 
        variant={buttonVariant as any} 
        size={buttonSize as any} 
        onClick={() => setIsOpen(true)}
        disabled={!email}
        title={email ? 'Gửi email' : 'Học sinh chưa có email'}
        className={className}
      >
        <Mail className="h-4 w-4 mr-1" />
        {buttonLabel}
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Gửi email cho học sinh</DialogTitle>
            <DialogDescription>
              Gửi email thông tin cho phụ huynh học sinh {studentName}
            </DialogDescription>
          </DialogHeader>
          
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
                  onClick={handleClose}
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudentEmailService;
