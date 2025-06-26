
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Clock, CalendarDays } from 'lucide-react';

interface AttendanceHeaderProps {
  month: string;
  setMonth: (month: string) => void;
  year: string;
  setYear: (year: string) => void;
  onFetch: () => void;
}

const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
  month,
  setMonth,
  year,
  setYear,
  onFetch
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <CardTitle className="flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Chấm công nhân viên
      </CardTitle>
      
      <div className="flex items-center gap-2">
        <Select
          value={month}
          onValueChange={setMonth}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Tháng" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <SelectItem key={m} value={String(m)}>
                Tháng {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={year}
          onValueChange={setYear}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Năm" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
              <SelectItem key={y} value={String(y)}>
                Năm {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button size="sm" variant="outline" onClick={onFetch}>
          <CalendarDays className="h-4 w-4 mr-1" />
          Xem
        </Button>
      </div>
    </div>
  );
};

export default AttendanceHeader;
