
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { teachingSessionService } from '@/lib/supabase';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { TeachingSession } from '@/lib/types';
import { Employee } from '@/lib/types';

interface TodayClassesListProps {
  employee: Employee;
}

const TodayClassesList: React.FC<TodayClassesListProps> = ({ employee }) => {
  const [todayClasses, setTodayClasses] = useState<TeachingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (employee) {
      fetchTodayClasses();
    }
  }, [employee]);

  const fetchTodayClasses = async () => {
    try {
      setIsLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Fetch all teaching sessions for this teacher
      const sessions = await teachingSessionService.getByTeacher(employee.id);
      
      // Filter for today only
      const todaySessions = sessions.filter(
        (session) => session.ngay_hoc === today
      );
      
      // Sort by start time
      todaySessions.sort((a, b) => {
        if (a.thoi_gian_bat_dau < b.thoi_gian_bat_dau) return -1;
        if (a.thoi_gian_bat_dau > b.thoi_gian_bat_dau) return 1;
        return 0;
      });
      
      setTodayClasses(todaySessions);
    } catch (error) {
      console.error('Error fetching today classes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClassClick = (sessionId: string) => {
    navigate(`/teaching-sessions/${sessionId}`);
  };
  
  const formatTime = (time: string) => {
    if (!time) return '';
    return time.substring(0, 5); // Format HH:MM
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Lớp học hôm nay
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : todayClasses.length > 0 ? (
          <div className="space-y-4">
            {todayClasses.map((session) => (
              <div
                key={session.id}
                className="p-3 border rounded-md hover:bg-muted cursor-pointer"
                onClick={() => handleClassClick(session.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{session.class_name || 'Lớp chưa đặt tên'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {session.tro_giang && <>Trợ giảng: {session.tro_giang}</>}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {formatTime(session.thoi_gian_bat_dau)} - {formatTime(session.thoi_gian_ket_thuc)}
                  </Badge>
                </div>
                <div className="mt-2 text-xs flex items-center justify-between">
                  <span>
                    Buổi {session.session_id}
                    {session.phong_hoc_id && <> · Phòng {session.phong_hoc_id}</>}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Bạn không có lớp dạy hôm nay</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayClassesList;
