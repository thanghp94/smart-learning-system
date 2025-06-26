import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const assignmentSchema = z.object({
  title: z.string().min(3, { message: 'Tiêu đề phải có ít nhất 3 ký tự' }),
  description: z.string().min(10, { message: 'Mô tả phải có ít nhất 10 ký tự' }),
  due_date: z.date(),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

interface AssignmentFormProps {
  sessionId: string;
  onSuccess: () => Promise<void>;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({ sessionId, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      description: '',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default: 7 days from now
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  const handleCancel = () => {
    form.reset();
    setSelectedFile(null);
    
    // If we're in a dialog, this would close it
    const closeButton = document.querySelector('[data-state="open"] button[data-dismiss]');
    if (closeButton instanceof HTMLElement) {
      closeButton.click();
    }
  };

  const onSubmit = async (values: AssignmentFormValues) => {
    setIsSubmitting(true);
    try {
      // This would be a real API call in production
      // First upload file if exists
      let fileUrl: string | undefined;
      if (selectedFile) {
        // Upload file logic would go here
        fileUrl = 'https://example.com/dummy-url-' + Date.now();
      }
      
      // Then create assignment record
      const assignmentData = {
        session_id: sessionId,
        title: values.title,
        description: values.description,
        due_date: values.due_date.toISOString(),
        file_url: fileUrl,
        status: 'active',
      };
      
      // const result = await assignmentService.create(assignmentData);
      console.log('Would create assignment with data:', assignmentData);
      
      // Show success message
      toast({
        title: 'Thành công',
        description: 'Đã thêm bài tập mới',
      });
      
      // Reset form and notify parent
      form.reset();
      setSelectedFile(null);
      await onSuccess();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tạo bài tập. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tiêu đề bài tập" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập mô tả chi tiết về bài tập" 
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Hạn nộp bài</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>Tệp đính kèm (tùy chọn)</FormLabel>
          {selectedFile ? (
            <div className="flex items-center justify-between p-2 border rounded-md">
              <span className="text-sm truncate">{selectedFile.name}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center border-2 border-dashed rounded-md p-6">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Tải tệp lên</span>
                <span className="text-xs text-muted-foreground mt-1">
                  (PDF, DOC, DOCX, PPT, PPTX)
                </span>
                <Input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                />
              </label>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo...' : 'Tạo bài tập'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AssignmentForm;
