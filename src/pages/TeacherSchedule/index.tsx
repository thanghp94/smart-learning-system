
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import TablePageLayout from '@/components/common/TablePageLayout';
import ScheduleFilters from './components/ScheduleFilters';
import WeekNavigation from './components/WeekNavigation';
import WeeklyScheduleView from './components/WeeklyScheduleView';
import { Button } from '@/components/ui/button';
import { useScheduleData } from './hooks/useScheduleData';

const TeacherSchedule = () => {
  const navigate = useNavigate();
  const {
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
  } = useScheduleData();

  const handleSessionClick = (session: any) => {
    navigate(`/teaching-sessions`, { state: { sessionId: session.id } });
  };

  const handleFilterModeChange = (value: string) => {
    setFilterMode(value as 'teacher' | 'facility');
    if (value === 'teacher') {
      setSelectedFacility(null);
    } else {
      setSelectedTeacher(null);
    }
  };

  const tableActions = (
    <div className="flex flex-wrap items-center gap-2">
      <ScheduleFilters
        teachers={teachers}
        facilities={facilities}
        selectedTeacher={selectedTeacher}
        selectedFacility={selectedFacility}
        filterMode={filterMode}
        onTeacherChange={setSelectedTeacher}
        onFacilityChange={setSelectedFacility}
        onFilterModeChange={handleFilterModeChange}
      />

      <WeekNavigation
        currentWeekStart={currentWeekStart}
        calendarDate={calendarDate}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
        onCurrentWeek={goToCurrentWeek}
        onCalendarDateChange={setCalendarDate}
      />
    </div>
  );

  return (
    <TablePageLayout
      title="Lịch Dạy"
      description={`Xem lịch dạy theo tuần ${filterMode === 'teacher' ? 'của giáo viên' : 'tại cơ sở'}`}
      actions={tableActions}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      ) : filterMode === 'teacher' && selectedTeacher ? (
        <WeeklyScheduleView
          sessions={sessions}
          currentWeekStart={currentWeekStart}
          onSessionClick={handleSessionClick}
        />
      ) : filterMode === 'facility' && selectedFacility ? (
        <WeeklyScheduleView
          sessions={sessions}
          currentWeekStart={currentWeekStart}
          onSessionClick={handleSessionClick}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-60">
          <p className="text-muted-foreground">
            {filterMode === 'teacher' 
              ? 'Vui lòng chọn giáo viên để xem lịch dạy'
              : 'Vui lòng chọn cơ sở để xem lịch dạy'}
          </p>
          
          {(filterMode === 'teacher' && teachers.length === 0) && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={fetchTeachers}
            >
              Tải lại danh sách giáo viên
            </Button>
          )}
          
          {(filterMode === 'facility' && facilities.length === 0) && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={fetchFacilities}
            >
              Tải lại danh sách cơ sở
            </Button>
          )}
        </div>
      )}
    </TablePageLayout>
  );
};

export default TeacherSchedule;
