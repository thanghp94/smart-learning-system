
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { vi } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DatePickerProps {
  date?: Date | null;
  setDate?: (date?: Date | null) => void;
  className?: string;
  selected?: Date | null;
  onChange?: (date: Date | null) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function DatePicker({ 
  date,
  setDate,
  selected,
  onChange,
  className,
  disabled = false,
  placeholder = "Chọn ngày"
}: DatePickerProps) {
  // Support both patterns: date+setDate and selected+onChange
  const value = date || selected;
  const handleChange = (newDate: Date | null | undefined) => {
    if (setDate) setDate(newDate || null);
    if (onChange) onChange(newDate || null);
  };

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP", { locale: vi }) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value || undefined}
            onSelect={handleChange}
            initialFocus
            locale={vi}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
