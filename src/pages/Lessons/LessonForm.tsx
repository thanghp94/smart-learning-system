
import React, { useState } from "react";
import { Session } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";

const lessonSchema = z.object({
  unit_id: z.string().min(1, "Unit ID is required"),
  buoi_hoc_so: z.string().min(1, "Buổi học số is required"),
  noi_dung_bai_hoc: z.string().min(1, "Nội dung bài học is required"),
  tsi_lesson_plan: z.string().optional(),
  rep_lesson_plan: z.string().optional(),
  bai_tap: z.string().optional()
});

interface LessonFormProps {
  initialData?: Partial<Session>;
  onSubmit: (data: Partial<Session>) => void;
  onCancel: () => void;
}

const LessonForm: React.FC<LessonFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const form = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: initialData || {
      unit_id: "",
      buoi_hoc_so: "",
      noi_dung_bai_hoc: "",
      tsi_lesson_plan: "",
      rep_lesson_plan: "",
      bai_tap: ""
    }
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="buoi_hoc_so">Buổi học số *</Label>
            <Input
              id="buoi_hoc_so"
              {...form.register('buoi_hoc_so')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="unit_id">Unit ID *</Label>
            <Input
              id="unit_id"
              {...form.register('unit_id')}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="noi_dung_bai_hoc">Nội dung bài học *</Label>
          <Textarea
            id="noi_dung_bai_hoc"
            {...form.register('noi_dung_bai_hoc')}
            rows={3}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tsi_lesson_plan">TSI Lesson Plan</Label>
          <Textarea
            id="tsi_lesson_plan"
            {...form.register('tsi_lesson_plan')}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rep_lesson_plan">REP Lesson Plan</Label>
          <Textarea
            id="rep_lesson_plan"
            {...form.register('rep_lesson_plan')}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bai_tap">Bài tập</Label>
          <Textarea
            id="bai_tap"
            {...form.register('bai_tap')}
            rows={3}
          />
        </div>
        
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

export default LessonForm;
