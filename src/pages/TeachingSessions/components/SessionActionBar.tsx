
import React from 'react';
import { Plus, Filter, RotateCw, FileDown, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { SessionActionBarProps } from '../types';

const SessionActionBar: React.FC<SessionActionBarProps> = ({ 
  onAddClick, 
  onRefresh, 
  sessions, 
  selectedDate, 
  onDateChange 
}) => {
  return (
    <div className="flex justify-between items-center space-x-2">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="h-8" onClick={onRefresh}>
          <RotateCw className="h-4 w-4 mr-1" /> Làm mới
        </Button>
        <Button variant="outline" size="sm" className="h-8">
          <Filter className="h-4 w-4 mr-1" /> Lọc
        </Button>
        <Button variant="outline" size="sm" className="h-8">
          <FileDown className="h-4 w-4 mr-1" /> Xuất
        </Button>
        <div className="flex items-center space-x-2 ml-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            className="h-8 px-2 rounded-md border border-input bg-transparent text-sm"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={onDateChange}
          />
        </div>
      </div>
      <Button size="sm" className="h-8" onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm buổi học
      </Button>
    </div>
  );
};

export default SessionActionBar;
