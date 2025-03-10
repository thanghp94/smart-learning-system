
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import TablePageLayout from '@/components/common/TablePageLayout';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isToday, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { TeachingSession } from '@/lib/types';
import { employeeService, teachingSessionService } from '@/lib/supabase';
import { Employee } from '@/lib/types/employee';
import { useToast } from '@/hooks/use-toast';

const TeacherSchedule = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<Employee[]>([]);
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedTeacher) {
      fetchTeacherSessions(selectedTeacher);
    }
  }, [selectedTeacher, currentWeekStart]);

  useEffect(() => {
    if (calendarDate) {
      setCurrentWeekStart(startOfWeek(calendarDate, { weekStartsOn: 1 }));
    }
  }, [calendarDate]);

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      let teacherList = await employeeService.getByRole('teacher');
      
      // If no teachers with role 'teacher', fetch all employees
      if (!teacherList || teacherList.length === 0) {
        teacherList = await employeeService.getAll();
        console.log("Fetched all employees instead:", teacherList);
      }
      
      setTeachers(teacherList || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách giáo viên',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const fetchTeacherSessions = async (teacherId: string) => {
    try {
      setIsLoading(true);
      const teacherSessions = await teachingSessionService.getByTeacher(teacherId);
      console.log("Teacher sessions:", teacherSessions);
      setSessions(teacherSessions || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching teacher sessions:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải lịch dạy của giáo viên',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const goToPreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
    setCalendarDate(new Date());
  };

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

  const handleSessionClick = (session: TeachingSession) => {
    navigate(`/teaching-sessions`, { state: { sessionId: session.id } });
  };

  const renderWeekView = () => {
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
                  onClick={() => handleSessionClick(session)}
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

  const tableActions = (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={selectedTeacher || ''} onValueChange={setSelectedTeacher}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Chọn giáo viên" />
        </SelectTrigger>
        <SelectContent>
          {teachers.map((teacher) => (
            <SelectItem key={teacher.id} value={teacher.id}>
              {teacher.ten_nhan_su}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2 ml-4">
        <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={goToCurrentWeek}>
          Tuần hiện tại
        </Button>
        <Button variant="outline" size="icon" onClick={goToNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="ml-2">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(currentWeekStart, 'dd/MM/yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={setCalendarDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  return (
    <TablePageLayout
      title="Lịch Dạy Giáo Viên"
      description="Xem lịch dạy theo tuần của giáo viên"
      actions={tableActions}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      ) : selectedTeacher ? (
        renderWeekView()
      ) : (
        <div className="flex flex-col items-center justify-center h-60">
          <p className="text-muted-foreground">Vui lòng chọn giáo viên để xem lịch dạy</p>
          
          {teachers.length === 0 && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={fetchTeachers}
            >
              Tải lại danh sách giáo viên
            </Button>
          )}
        </div>
      )}
    </TablePageLayout>
  );
};

export default TeacherSchedule;
