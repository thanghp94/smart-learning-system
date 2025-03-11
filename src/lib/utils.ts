
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | string): string => {
  if (!date) return "";
  try {
    return format(new Date(date), "dd/MM/yyyy", { locale: vi });
  } catch (e) {
    console.error("Error formatting date:", e);
    return String(date);
  }
};

export const formatTime = (timeString: string | null): string => {
  if (!timeString) return "--:--";
  return timeString.substring(0, 5); // Get only HH:MM part
};
