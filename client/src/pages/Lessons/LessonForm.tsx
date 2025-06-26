
import React from "react";
import { Session } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const lessonSchema = z.object({
  unit_id: z.string().min(1, { message: "Unit ID is required" }),
  buoi_hoc_so: z.string().min(1, { message: "Buổi học số is required" }),
  noi_dung_bai_hoc: z.string().min(1, { message: "Nội dung bài học is required" }),
  tsi_lesson_plan: z.string().optional(),
  rep_lesson_plan: z.string().optional(),
  bai_tap: z.string().optional()
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface LessonFormProps {
  initialData?: Partial<Session>;
  onSubmit: (data: Partial<Session>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const LessonForm: React.FC<LessonFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSaving = false
}) => {
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      unit_id: initialData?.unit_id || "",
      buoi_hoc_so: initialData?.buoi_hoc_so || "",
      noi_dung_bai_hoc: initialData?.noi_dung_bai_hoc || "",
      tsi_lesson_plan: initialData?.tsi_lesson_plan || "",
      rep_lesson_plan: initialData?.rep_lesson_plan || "",
      bai_tap: initialData?.bai_tap || ""
    }
  });

  const handleSubmit = (data: LessonFormValues) => {
    console.log("Submitting lesson form:", data);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="buoi_hoc_so"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buổi học số *</FormLabel>
                <FormControl>
                  <Input
                    id="buoi_hoc_so"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="unit_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit ID *</FormLabel>
                <FormControl>
                  <Input
                    id="unit_id"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="noi_dung_bai_hoc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung bài học *</FormLabel>
              <FormControl>
                <Textarea
                  id="noi_dung_bai_hoc"
                  {...field}
                  rows={3}
                  required
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
                  id="tsi_lesson_plan"
                  {...field}
                  rows={3}
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
                  id="rep_lesson_plan"
                  {...field}
                  rows={3}
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
                  id="bai_tap"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : "Lưu"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LessonForm;
