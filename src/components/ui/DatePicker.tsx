
import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  selected?: Date;
  onChange?: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({ 
  date, 
  setDate, 
  placeholder = "Chọn ngày", 
  disabled = false,
  selected,
  onChange,
  className
}: DatePickerProps) {
  
  // Handle both new API and legacy API
  const handleSelect = (selectedDate: Date | undefined) => {
    if (onChange) {
      onChange(selectedDate);
    }
    if (setDate) {
      setDate(selectedDate);
    }
  };
  
  // Use selected prop if provided, otherwise use date
  const displayDate = selected || date;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !displayDate && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayDate ? format(displayDate, "dd/MM/yyyy", { locale: vi }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={displayDate}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// Export as default as well to support different import styles
export default DatePicker;
