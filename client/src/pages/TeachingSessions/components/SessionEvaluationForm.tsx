
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { teachingSessionService } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { TeachingSession } from "@/lib/types";

const formSchema = z.object({
  danh_gia_buoi_hoc: z.string().min(1, "Vui lòng nhập đánh giá"),
  diem_manh: z.string().optional(),
  diem_yeu: z.string().optional(),
  ghi_chu_danh_gia: z.string().optional(),
});

interface SessionEvaluationFormProps {
  session: TeachingSession;
  onSuccess: () => void;
  onCancel: () => void;
}

const SessionEvaluationForm: React.FC<SessionEvaluationFormProps> = ({
  session,
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      danh_gia_buoi_hoc: session.danh_gia_buoi_hoc || "",
      diem_manh: session.diem_manh || "",
      diem_yeu: session.diem_yeu || "",
      ghi_chu_danh_gia: session.ghi_chu_danh_gia || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await teachingSessionService.update(session.id, {
        // Use a type assertion here to help TypeScript understand these are valid properties
        ...(values as unknown as Partial<TeachingSession>)
      });
      
      toast({
        title: "Thành công",
        description: "Đã cập nhật đánh giá buổi học",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error updating session evaluation:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật đánh giá buổi học",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="danh_gia_buoi_hoc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đánh giá buổi học</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập đánh giá chung về buổi học"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="diem_manh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Điểm mạnh</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Các điểm mạnh của buổi học"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="diem_yeu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Điểm cần cải thiện</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Các điểm cần cải thiện"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="ghi_chu_danh_gia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú đánh giá</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ghi chú thêm về đánh giá"
                  className="min-h-[100px]"
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
          <Button type="submit">Lưu đánh giá</Button>
        </div>
      </form>
    </Form>
  );
};

export default SessionEvaluationForm;
