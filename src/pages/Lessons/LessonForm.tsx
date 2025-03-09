
import React, { useState } from "react";
import { Session } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
  const [formData, setFormData] = useState<Partial<Session>>(
    initialData || {
      unit_id: "",
      buoi_hoc_so: "",
      noi_dung_bai_hoc: "",
      tsi_lesson_plan: "",
      rep_lesson_plan: "",
      bai_tap: ""
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="buoi_hoc_so">Buổi học số *</Label>
          <Input
            id="buoi_hoc_so"
            name="buoi_hoc_so"
            value={formData.buoi_hoc_so || ""}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unit_id">Unit ID *</Label>
          <Input
            id="unit_id"
            name="unit_id"
            value={formData.unit_id || ""}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="noi_dung_bai_hoc">Nội dung bài học *</Label>
        <Textarea
          id="noi_dung_bai_hoc"
          name="noi_dung_bai_hoc"
          value={formData.noi_dung_bai_hoc || ""}
          onChange={handleChange}
          rows={3}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tsi_lesson_plan">TSI Lesson Plan</Label>
        <Textarea
          id="tsi_lesson_plan"
          name="tsi_lesson_plan"
          value={formData.tsi_lesson_plan || ""}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="rep_lesson_plan">REP Lesson Plan</Label>
        <Textarea
          id="rep_lesson_plan"
          name="rep_lesson_plan"
          value={formData.rep_lesson_plan || ""}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bai_tap">Bài tập</Label>
        <Textarea
          id="bai_tap"
          name="bai_tap"
          value={formData.bai_tap || ""}
          onChange={handleChange}
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
  );
};

export default LessonForm;
