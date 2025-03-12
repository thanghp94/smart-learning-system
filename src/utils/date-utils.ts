
// Utility functions for date formatting and handling
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format a date for display
 */
export const formatDisplayDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy', { locale: vi });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

/**
 * Convert a date to ISO string date format (YYYY-MM-DD)
 */
export const toISODateString = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    console.error('Date ISO conversion error:', error);
    return '';
  }
};

/**
 * Format a date as a ReactNode for display in components
 */
export const formatDateNode = (date: Date | string | null | undefined): string => {
  return formatDisplayDate(date);
};
