
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { TeachingSession } from "@/lib/types";
import { teachingSessionService } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import SessionEvaluationFields from "./SessionEvaluationFields";

// Evaluation schema
const evaluationSchema = z.object({
  nhan_xet_1: z.string().nullable().optional(),
  nhan_xet_2: z.string().nullable().optional(),
  nhan_xet_3: z.string().nullable().optional(),
  nhan_xet_4: z.string().nullable().optional(),
  nhan_xet_5: z.string().nullable().optional(),
  nhan_xet_6: z.string().nullable().optional(),
  nhan_xet_chung: z.string().nullable().optional(),
});

type EvaluationFormValues = z.infer<typeof evaluationSchema>;

interface SessionEvaluationFormProps {
  session: TeachingSession;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SessionEvaluationForm: React.FC<SessionEvaluationFormProps> = ({
  session,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      nhan_xet_1: session.nhan_xet_1 || null,
      nhan_xet_2: session.nhan_xet_2 || null,
      nhan_xet_3: session.nhan_xet_3 || null,
      nhan_xet_4: session.nhan_xet_4 || null,
      nhan_xet_5: session.nhan_xet_5 || null,
      nhan_xet_6: session.nhan_xet_6 || null,
      nhan_xet_chung: session.nhan_xet_chung || null,
    }
  });

  const calculateAverageScore = (data: EvaluationFormValues): number | null => {
    const scores = [
      data.nhan_xet_1, data.nhan_xet_2, data.nhan_xet_3,
      data.nhan_xet_4, data.nhan_xet_5, data.nhan_xet_6
    ].filter(score => score !== null && score !== undefined && score !== "");
    
    if (scores.length === 0) return null;
    
    const sum = scores.reduce((acc, score) => acc + Number(score), 0);
    return sum / scores.length;
  };

  const handleSubmit = async (values: EvaluationFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Calculate average score
      const trungBinh = calculateAverageScore(values);
      
      // Update only evaluation fields
      await teachingSessionService.update(session.id, {
        ...values,
        trung_binh: trungBinh
      });
      
      toast({
        title: "Thành công",
        description: "Đã cập nhật đánh giá buổi học",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error("Error updating session evaluation:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật đánh giá buổi học",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Đánh giá buổi học</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <SessionEvaluationFields form={form} />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu đánh giá"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SessionEvaluationForm;
