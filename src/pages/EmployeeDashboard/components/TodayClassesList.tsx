
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { TeachingSession } from '@/lib/types';
import { teachingSessionService } from '@/pages/TeachingSessions/TeachingSessionService';

const TodayClassesList: React.FC = () => {
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodaySessions = async () => {
      try {
        setIsLoading(true);
        const today = format(new Date(), 'yyyy-MM-dd');
        const data = await teachingSessionService.getByDate(today);
        setSessions(data);
      } catch (error) {
        console.error('Error fetching today classes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodaySessions();
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Lịch dạy hôm nay
          </CardTitle>
        </CardHeader>
        <CardContent>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col space-y-2 mb-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Lịch dạy hôm nay
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Không có lịch dạy nào hôm nay
            </p>
          ) : (
            sessions.map((session) => (
              <Link
                to={`/teaching-sessions/${session.id}`}
                key={session.id}
                className="block"
              >
                <div className="flex flex-col p-3 border rounded-md hover:bg-accent transition-colors">
                  <div className="font-medium">{session.class_name}</div>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {session.thoi_gian_bat_dau
                      ? format(new Date(`2000-01-01T${session.thoi_gian_bat_dau}`), 'HH:mm')
                      : ''}
                    {session.thoi_gian_ket_thuc
                      ? ` - ${format(
                          new Date(`2000-01-01T${session.thoi_gian_ket_thuc}`),
                          'HH:mm'
                        )}`
                      : ''}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <Users className="h-3 w-3 mr-1" />
                    {session.teacher_name}
                    {session.assistant_name && `, ${session.assistant_name}`}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayClassesList;
