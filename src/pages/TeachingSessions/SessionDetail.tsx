import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { sessionService } from '@/lib/supabase';
import { Session } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const SessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: session, isLoading, error } = useQuery<Session, Error>(
    ['session', id],
    () => sessionService.getById(id as string)
  );

  if (isLoading) {
    return <div>Loading session details...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!session) {
    return <div>Session not found.</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" />Quay lại</Button>
      <h1 className="text-2xl font-bold mb-4">Session Details</h1>
      
      <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Loại bài học</dt>
          <dd className="mt-1 text-sm text-gray-900">{session.loai_bai_hoc}</dd>
        </div>

        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Unit ID</dt>
          <dd className="mt-1 text-sm text-gray-900">{session.unit_id}</dd>
        </div>

        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Buổi học số</dt>
          <dd className="mt-1 text-sm text-gray-900">{session.buoi_hoc_so}</dd>
        </div>

        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Nội dung bài học</dt>
          <dd className="mt-1 text-sm text-gray-900">{session.noi_dung_bai_hoc}</dd>
        </div>

        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">REP Lesson Plan</dt>
          <dd className="mt-1 text-sm text-gray-900">{session.rep_lesson_plan}</dd>
        </div>

        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Bài tập</dt>
          <dd className="mt-1 text-sm text-gray-900">{session.bai_tap}</dd>
        </div>
      </dl>
    </div>
  );
};

export default SessionDetail;
