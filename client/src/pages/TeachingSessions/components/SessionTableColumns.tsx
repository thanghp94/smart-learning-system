
import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, Star, Clock } from 'lucide-react';
import { EnhancedTeachingSession } from '../types';

interface SessionActionsProps {
  session: EnhancedTeachingSession;
  onAttendance: (session: EnhancedTeachingSession) => void;
  onEvaluation: (session: EnhancedTeachingSession) => void;
  onConfirmTime: (session: EnhancedTeachingSession) => void;
}

export const SessionActions: React.FC<SessionActionsProps> = ({
  session,
  onAttendance,
  onEvaluation,
  onConfirmTime
}) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onAttendance(session);
        }}
        title="Thêm điểm danh"
      >
        <UserCheck className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onEvaluation(session);
        }}
        title="Đánh giá giáo viên"
      >
        <Star className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onConfirmTime(session);
        }}
        title="Xác nhận thời gian"
      >
        <Clock className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Utility functions for formatting
export const formatSessionDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
  } catch (e) {
    return dateString;
  }
};

export const formatSessionTime = (timeString: string) => {
  if (!timeString) return '';
  return timeString.substring(0, 5); // Format HH:MM
};

// Define table columns
export const getTableColumns = (
  onAttendance: (session: EnhancedTeachingSession) => void,
  onEvaluation: (session: EnhancedTeachingSession) => void,
  onConfirmTime: (session: EnhancedTeachingSession) => void,
  getLessonName: (sessionId: string) => string
) => [
  {
    title: "Lớp",
    key: "class_name",
    sortable: true,
    render: (_: string, record: EnhancedTeachingSession) => (
      <div className="font-medium">{record.class_name || "N/A"}</div>
    ),
  },
  {
    title: "Ngày học",
    key: "ngay_hoc",
    sortable: true,
    render: (value: string) => formatSessionDate(value),
  },
  {
    title: "Thời gian",
    key: "thoi_gian_bat_dau",
    render: (value: string, record: EnhancedTeachingSession) => (
      <span>
        {formatSessionTime(value)} - {formatSessionTime(record.thoi_gian_ket_thuc || '')}
      </span>
    ),
  },
  {
    title: "Giáo viên",
    key: "teacher_name",
    render: (value: string) => value || "N/A",
  },
  {
    title: "Buổi học số",
    key: "session_id",
    render: (value: string, record: EnhancedTeachingSession) => (
      <Badge variant="outline">
        {record.lesson_name || getLessonName(value)}
      </Badge>
    ),
  },
  {
    title: "Nội dung",
    key: "lesson_content",
    render: (value: string) => (
      <div className="max-w-xs truncate">
        {value || "Học mới"}
      </div>
    )
  },
  {
    title: "Loại bài học",
    key: "loai_bai_hoc",
    render: (value: string) => value || "Học mới",
  },
  {
    title: "Trạng thái",
    key: "completed",
    render: (value: string) => (
      <Badge variant={value === "true" ? "success" : "secondary"}>
        {value === "true" ? "Hoàn thành" : "Chưa hoàn thành"}
      </Badge>
    ),
  },
  {
    title: "Hành động",
    key: "actions",
    render: (_: string, record: EnhancedTeachingSession) => (
      <SessionActions
        session={record}
        onAttendance={onAttendance}
        onEvaluation={onEvaluation}
        onConfirmTime={onConfirmTime}
      />
    ),
  },
];
