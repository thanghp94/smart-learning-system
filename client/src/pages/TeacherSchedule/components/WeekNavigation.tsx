
import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface WeekNavigationProps {
  currentWeekStart: Date;
  calendarDate?: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
  onCalendarDateChange: (date: Date | undefined) => void;
}

const WeekNavigation: React.FC<WeekNavigationProps> = ({
  currentWeekStart,
  calendarDate,
  onPreviousWeek,
  onNextWeek,
  onCurrentWeek,
  onCalendarDateChange
}) => {
  return (
    <div className="flex items-center gap-2 ml-4">
      <Button variant="outline" size="icon" onClick={onPreviousWeek}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" onClick={onCurrentWeek}>
        Tuần hiện tại
      </Button>
      <Button variant="outline" size="icon" onClick={onNextWeek}>
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
            onSelect={onCalendarDateChange}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default WeekNavigation;
