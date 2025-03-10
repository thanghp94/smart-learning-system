
import React from 'react';
import { Session } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';

interface LessonDetailProps {
  lesson: Session;
}

const LessonDetail: React.FC<LessonDetailProps> = ({ lesson }) => {
  // Format date if it exists
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Buổi học số</h3>
          <p className="mt-1 text-base font-semibold">{lesson.buoi_hoc_so || 'N/A'}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Unit ID</h3>
          <p className="mt-1 text-base font-semibold">{lesson.unit_id || 'N/A'}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Ngày tạo</h3>
          <p className="mt-1 text-base font-semibold">{formatDate(lesson.tg_tao)}</p>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardContent className="pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Nội dung bài học</h3>
          <div className="whitespace-pre-wrap text-sm">{lesson.noi_dung_bai_hoc || 'N/A'}</div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="tsi_lesson_plan">
          <AccordionTrigger className="text-sm font-medium">TSI Lesson Plan</AccordionTrigger>
          <AccordionContent>
            <div className="whitespace-pre-wrap text-sm p-3 bg-gray-50 rounded-md">
              {lesson.tsi_lesson_plan || 'Không có thông tin'}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="rep_lesson_plan">
          <AccordionTrigger className="text-sm font-medium">REP Lesson Plan</AccordionTrigger>
          <AccordionContent>
            <div className="whitespace-pre-wrap text-sm p-3 bg-gray-50 rounded-md">
              {lesson.rep_lesson_plan || 'Không có thông tin'}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="bai_tap">
          <AccordionTrigger className="text-sm font-medium">Bài tập</AccordionTrigger>
          <AccordionContent>
            <div className="whitespace-pre-wrap text-sm p-3 bg-gray-50 rounded-md">
              {lesson.bai_tap || 'Không có bài tập'}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LessonDetail;
