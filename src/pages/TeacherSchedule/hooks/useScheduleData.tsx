
import { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format } from 'date-fns';
import { employeeService, facilityService, teachingSessionService } from '@/lib/supabase';
import { Employee, Facility, TeachingSession } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function useScheduleData() {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<Employee[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'teacher' | 'facility'>('teacher');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    fetchTeachers();
    fetchFacilities();
  }, []);

  useEffect(() => {
    if (filterMode === 'teacher' && selectedTeacher) {
      fetchTeacherSessions(selectedTeacher);
    } else if (filterMode === 'facility' && selectedFacility) {
      fetchFacilitySessions(selectedFacility);
    } else {
      setSessions([]);
      setIsLoading(false);
    }
  }, [selectedTeacher, selectedFacility, filterMode, currentWeekStart]);

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
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách giáo viên',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      const facilityList = await facilityService.getAll();
      setFacilities(facilityList || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách cơ sở',
        variant: 'destructive',
      });
    }
  };

  const fetchTeacherSessions = async (teacherId: string) => {
    try {
      setIsLoading(true);
      const teacherSessions = await teachingSessionService.getByTeacher(teacherId);
      console.log("Teacher sessions:", teacherSessions);
      
      // Filter for current week
      const weekStart = format(currentWeekStart, 'yyyy-MM-dd');
      const weekEnd = format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      
      const filteredSessions = teacherSessions.filter(session => {
        return session.ngay_hoc >= weekStart && session.ngay_hoc <= weekEnd;
      });
      
      setSessions(filteredSessions || []);
    } catch (error) {
      console.error('Error fetching teacher sessions:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải lịch dạy của giáo viên',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFacilitySessions = async (facilityId: string) => {
    try {
      setIsLoading(true);
      const facilitySessions = await teachingSessionService.getByFacility(facilityId);
      
      // Filter for current week
      const weekStart = format(currentWeekStart, 'yyyy-MM-dd');
      const weekEnd = format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      
      const filteredSessions = facilitySessions.filter(session => {
        return session.ngay_hoc >= weekStart && session.ngay_hoc <= weekEnd;
      });
      
      setSessions(filteredSessions || []);
    } catch (error) {
      console.error('Error fetching facility sessions:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải lịch dạy của cơ sở',
        variant: 'destructive',
      });
    } finally {
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

  return {
    selectedTeacher,
    setSelectedTeacher,
    selectedFacility,
    setSelectedFacility,
    teachers,
    facilities,
    sessions,
    isLoading,
    filterMode,
    setFilterMode,
    currentWeekStart,
    calendarDate,
    setCalendarDate,
    fetchTeachers,
    fetchFacilities,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek
  };
}
