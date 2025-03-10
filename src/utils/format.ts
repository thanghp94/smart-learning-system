
/**
 * Format a number as currency with the given locale and currency code
 * @param value Number value to format
 * @param locale Locale to use for formatting (defaults to 'vi-VN')
 * @param currency Currency code to use (defaults to 'VND')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number | string | undefined | null,
  locale = 'vi-VN',
  currency = 'VND'
): string => {
  if (value === null || value === undefined) return '';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numValue);
};

/**
 * Format a date string into a localized date display
 * @param dateString Date string to format
 * @param locale Locale to use for formatting (defaults to 'vi-VN')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string | undefined | null,
  locale = 'vi-VN'
): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || '';
  }
};

/**
 * Format a number with thousand separators
 * @param value Number to format
 * @param locale Locale to use for formatting (defaults to 'vi-VN')
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number | string | undefined | null,
  locale = 'vi-VN'
): string => {
  if (value === null || value === undefined) return '';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '';
  
  return new Intl.NumberFormat(locale).format(numValue);
};
