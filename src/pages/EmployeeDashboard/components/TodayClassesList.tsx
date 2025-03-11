
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { teachingSessionService, employeeService } from '@/lib/supabase';
import { format } from 'date-fns';
import { TeachingSession } from '@/lib/types';
import { CalendarClock, Loader2 } from 'lucide-react';

const TodayClassesList = () => {
  const [todayClasses, setTodayClasses] = useState<TeachingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayClasses = async () => {
      try {
        setLoading(true);
        const today = format(new Date(), 'yyyy-MM-dd');
        const sessions = await teachingSessionService.getByDate(today);
        
        // Sort by start time
        const sortedSessions = [...sessions].sort((a, b) => {
          if (!a.thoi_gian_bat_dau || !b.thoi_gian_bat_dau) return 0;
          return a.thoi_gian_bat_dau.localeCompare(b.thoi_gian_bat_dau);
        });
        
        // Get only next 5 classes
        setTodayClasses(sortedSessions.slice(0, 5));
      } catch (error) {
        console.error('Error fetching today classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayClasses();
  }, []);

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Format as HH:MM
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <CalendarClock className="h-5 w-5 mr-2" />
          Lớp học hôm nay
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : todayClasses.length > 0 ? (
          <div className="space-y-3">
            {todayClasses.map((session) => (
              <div key={session.id} className="border rounded-md p-3 hover:bg-muted transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{session.class_name || 'Lớp học'}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(session.thoi_gian_bat_dau)} - {formatTime(session.thoi_gian_ket_thuc)}
                    </p>
                  </div>
                  <div className="text-sm text-right">
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                      Buổi {session.session_id}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Không có lớp học nào hôm nay</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayClassesList;
