
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { supabase } from '@/lib/supabase/client';
import { teachingSessionService } from '@/lib/supabase';
import { TeachingSession } from '@/lib/types';
import { Employee } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface TodayClassesListProps {
  employee: Employee;
  isFacilityManager?: boolean;
  facilityId?: string;
}

const TodayClassesList: React.FC<TodayClassesListProps> = ({ 
  employee, 
  isFacilityManager = false,
  facilityId
}) => {
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodayClasses();
  }, [employee.id, selectedDate, isFacilityManager, facilityId]);

  const fetchTodayClasses = async () => {
    setIsLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      let data: TeachingSession[] = [];
      
      if (isFacilityManager && facilityId) {
        // Get sessions for a specific facility
        const { data: facilityData, error: facilityError } = await supabase
          .from('teaching_sessions')
          .select(`
            *,
            teachers:giao_vien(ten_nhan_su),
            assistants:tro_giang(ten_nhan_su),
            classes:lop_chi_tiet_id(ten_lop_full)
          `)
          .eq('ngay_hoc', formattedDate)
          .eq('co_so_id', facilityId)
          .order('thoi_gian_bat_dau', { ascending: true });
          
        if (facilityError) throw facilityError;
        data = facilityData as TeachingSession[];
      } else {
        // Get sessions for a specific teacher
        const { data: teacherData, error: teacherError } = await supabase
          .from('teaching_sessions')
          .select(`
            *,
            teachers:giao_vien(ten_nhan_su),
            assistants:tro_giang(ten_nhan_su),
            classes:lop_chi_tiet_id(ten_lop_full)
          `)
          .eq('ngay_hoc', formattedDate)
          .or(`giao_vien.eq.${employee.id},tro_giang.eq.${employee.id}`)
          .order('thoi_gian_bat_dau', { ascending: true });
          
        if (teacherError) throw teacherError;
        data = teacherData as TeachingSession[];
      }
      
      setSessions(data);
    } catch (error) {
      console.error('Error fetching today classes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToSession = (sessionId: string) => {
    navigate(`/teaching-sessions/${sessionId}`);
  };

  const formatTimeOnly = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Format as HH:MM
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {isFacilityManager ? 'Lớp học tại cơ sở hôm nay' : 'Lịch dạy hôm nay của tôi'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {format(selectedDate, 'EEEE, dd/MM/yyyy', { locale: vi })}
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Không có lớp học nào</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => {
              // Extract nested data
              const teacherName = session.teachers?.ten_nhan_su || '';
              const assistantName = session.assistants?.ten_nhan_su || '';
              const className = session.classes?.ten_lop_full || '';
              
              return (
                <div 
                  key={session.id} 
                  className="p-2 border rounded hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleNavigateToSession(session.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{className}</p>
                      <div className="text-xs text-muted-foreground space-y-1 mt-1">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimeOnly(session.thoi_gian_bat_dau)} - {formatTimeOnly(session.thoi_gian_ket_thuc)}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          GV: {teacherName}
                          {assistantName && ` | TG: ${assistantName}`}
                        </div>
                        {session.phong_hoc_id && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            Phòng: {session.phong_hoc_id}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {session.loai_bai_hoc || "Học mới"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayClassesList;
