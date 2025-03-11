
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

const emailSchema = z.object({
  to: z.string().email({ message: 'Vui lòng nhập email hợp lệ' }),
  subject: z.string().min(1, { message: 'Vui lòng nhập tiêu đề' }),
  content: z.string().min(1, { message: 'Vui lòng nhập nội dung' }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

interface StudentEmailButtonProps {
  studentName: string;
  email?: string;
}

const StudentEmailButton: React.FC<StudentEmailButtonProps> = ({ studentName, email }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  
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
    
    // This would normally connect to an email sending service
    try {
      // Simulate email sending with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Gửi email thành công',
        description: `Email đã được gửi đến ${values.to}`,
      });
      
      setIsOpen(false);
      form.reset();
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
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        disabled={!email}
        title={email ? 'Gửi email' : 'Học sinh chưa có email'}
      >
        <Mail className="h-4 w-4 mr-1" />
        Gửi email
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
                  onClick={() => setIsOpen(false)}
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

export default StudentEmailButton;
