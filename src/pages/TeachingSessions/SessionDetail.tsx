import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Session } from '@/lib/types';

interface SessionDetailProps {
  session: Session | null;
}

const DetailItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-4">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="col-span-2">{children}</span>
  </div>
);

const SessionDetail: React.FC<SessionDetailProps> = ({ session }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin chi tiết buổi học</CardTitle>
        <CardDescription>Xem thông tin chi tiết của buổi học được chọn.</CardDescription>
      </CardHeader>
      <CardContent className="leading-7">
        <DetailItem label="Unit ID">
          {session?.unit_id || 'Chưa cập nhật'}
        </DetailItem>
        <DetailItem label="Buổi học số">
          {session?.buoi_hoc_so || 'Chưa cập nhật'}
        </DetailItem>
        <DetailItem label="TSI Lesson Plan">
          {session?.tsi_lesson_plan || 'Chưa cập nhật'}
        </DetailItem>
        <DetailItem label="Nội dung bài học">
          {session?.noi_dung_bai_hoc || 'Chưa cập nhật'}
        </DetailItem>
        <DetailItem label="REP Lesson Plan">
          {session?.rep_lesson_plan || 'Chưa cập nhật'}
        </DetailItem>
        <DetailItem label="Bài tập">
          {session?.bai_tap || 'Chưa cập nhật'}
        </DetailItem>
        <DetailItem label="Loại bài học">
          {session?.loai_bai_hoc || 'Chưa cập nhật'}
        </DetailItem>
      </CardContent>
    </Card>
  );
};

export default SessionDetail;
