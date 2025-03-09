
import React from "react";
import { Session } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface LessonDetailProps {
  lesson: Session;
}

const LessonDetail: React.FC<LessonDetailProps> = ({ lesson }) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Buổi {lesson.buoi_hoc_so}</h2>
        <p className="text-muted-foreground">Unit ID: {lesson.unit_id}</p>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Nội dung bài học</h3>
          <p className="mt-1 whitespace-pre-line">{lesson.noi_dung_bai_hoc}</p>
        </div>
        
        {lesson.tsi_lesson_plan && (
          <div>
            <h3 className="font-semibold">TSI Lesson Plan</h3>
            <p className="mt-1 whitespace-pre-line">{lesson.tsi_lesson_plan}</p>
          </div>
        )}
        
        {lesson.rep_lesson_plan && (
          <div>
            <h3 className="font-semibold">REP Lesson Plan</h3>
            <p className="mt-1 whitespace-pre-line">{lesson.rep_lesson_plan}</p>
          </div>
        )}
        
        {lesson.bai_tap && (
          <div>
            <h3 className="font-semibold">Bài tập</h3>
            <p className="mt-1 whitespace-pre-line">{lesson.bai_tap}</p>
          </div>
        )}
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm font-medium text-muted-foreground">Ngày tạo:</span>
          <p>{formatDate(lesson.tg_tao)}</p>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
