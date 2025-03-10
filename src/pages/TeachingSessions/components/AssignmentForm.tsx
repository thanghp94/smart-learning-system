
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { StudentAssignment } from "@/lib/supabase/student-assignment-service";
import { cn } from "@/lib/utils";

interface AssignmentFormProps {
  teachingSessionId: string;
  classId: string;
  onSubmit: (data: Partial<StudentAssignment>) => void;
  onCancel: () => void;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  teachingSessionId,
  classId,
  onSubmit,
  onCancel
}) => {
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<StudentAssignment>>();

  const handleFormSubmit = (data: Partial<StudentAssignment>) => {
    const formData = {
      ...data,
      buoi_day_id: teachingSessionId,
      lop_chi_tiet_id: classId,
      han_nop: dueDate ? dueDate.toISOString() : undefined,
      ngay_giao: new Date().toISOString(),
      trang_thai: "assigned"
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tieu_de">Tiêu đề bài tập *</Label>
        <Input
          id="tieu_de"
          {...register("tieu_de", { required: true })}
          className={errors.tieu_de ? "border-red-500" : ""}
        />
        {errors.tieu_de && <p className="text-red-500 text-xs">Vui lòng nhập tiêu đề</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mo_ta">Mô tả bài tập</Label>
        <Textarea
          id="mo_ta"
          {...register("mo_ta")}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date">Hạn nộp</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, 'dd/MM/yyyy') : "Chọn ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">Lưu bài tập</Button>
      </div>
    </form>
  );
};

export default AssignmentForm;
