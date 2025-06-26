
import React from 'react';
import { format, eachDayOfInterval, endOfWeek, isToday, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TeachingSession } from '@/lib/types';

interface WeeklyScheduleViewProps {
  sessions: TeachingSession[];
  currentWeekStart: Date;
  onSessionClick: (session: TeachingSession) => void;
}

const WeeklyScheduleView: React.FC<WeeklyScheduleViewProps> = ({
  sessions,
  currentWeekStart,
  onSessionClick
}) => {
  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
  });

  const getSessionsForDay = (date: Date): TeachingSession[] => {
    return sessions.filter((session) => {
      try {
        const sessionDate = new Date(session.ngay_hoc);
        return isSameDay(sessionDate, date);
      } catch (e) {
        return false;
      }
    });
  };

  const formatTime = (time: string) => {
    return time ? time.substring(0, 5) : ''; // Format HH:MM
  };

  return (
    <div className="grid grid-cols-7 gap-2 mt-4">
      {weekDays.map((day) => (
        <div key={day.toString()} className="min-h-[200px]">
          <div
            className={`p-2 text-center font-medium ${
              isToday(day) ? 'bg-primary text-primary-foreground rounded-t-md' : 'bg-muted'
            }`}
          >
            <div>{format(day, 'EEEE', { locale: vi })}</div>
            <div>{format(day, 'dd/MM')}</div>
          </div>
          <div className="border border-t-0 rounded-b-md p-2 h-full">
            {getSessionsForDay(day).map((session) => (
              <Card 
                key={session.id} 
                className="mb-2 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onSessionClick(session)}
              >
                <CardContent className="p-2">
                  <div className="text-sm font-semibold">{session.class_name || 'Lớp N/A'}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(session.thoi_gian_bat_dau)} - {formatTime(session.thoi_gian_ket_thuc)}
                  </div>
                  <Badge variant="outline" className="mt-1 text-xs">
                    Buổi {session.session_id}
                  </Badge>
                </CardContent>
              </Card>
            ))}
            {getSessionsForDay(day).length === 0 && (
              <div className="text-center text-muted-foreground text-sm p-2">
                Không có lịch dạy
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeeklyScheduleView;
