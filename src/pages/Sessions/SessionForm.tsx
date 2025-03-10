
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Session } from '@/lib/types';

// Form schema
const sessionFormSchema = z.object({
  unit_id: z.string().optional(),
  buoi_hoc_so: z.string().min(1, { message: "Buổi học số không được để trống" }),
  tsi_lesson_plan: z.string().optional(),
  noi_dung_bai_hoc: z.string().min(1, { message: "Nội dung bài học không được để trống" }),
  rep_lesson_plan: z.string().optional(),
  bai_tap: z.string().optional(),
});

type SessionFormValues = z.infer<typeof sessionFormSchema>;

interface SessionFormProps {
  initialData?: Partial<Session>;
  onSubmit: (data: SessionFormValues) => Promise<void>;
  onCancel: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  // Create form
  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      unit_id: initialData?.unit_id || '',
      buoi_hoc_so: initialData?.buoi_hoc_so || '',
      tsi_lesson_plan: initialData?.tsi_lesson_plan || '',
      noi_dung_bai_hoc: initialData?.noi_dung_bai_hoc || '',
      rep_lesson_plan: initialData?.rep_lesson_plan || '',
      bai_tap: initialData?.bai_tap || '',
    },
  });

  const handleSubmit = async (values: SessionFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="unit_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit ID</FormLabel>
              <FormControl>
                <Input placeholder="Nhập unit ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="buoi_hoc_so"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buổi học số</FormLabel>
              <FormControl>
                <Input placeholder="Nhập buổi học số" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="noi_dung_bai_hoc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung bài học</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập nội dung bài học" 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tsi_lesson_plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TSI Lesson Plan</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập TSI lesson plan" 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rep_lesson_plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>REP Lesson Plan</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập REP lesson plan" 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bai_tap"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bài tập</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập bài tập" 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">Lưu</Button>
        </div>
      </form>
    </Form>
  );
};

export default SessionForm;
