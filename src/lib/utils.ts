
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
}

export function formatDateTime(dateString?: string, timeString?: string): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    let formattedDate = new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
    
    if (timeString) {
      formattedDate += ` ${timeString.substring(0, 5)}`;
    }
    
    return formattedDate;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
}

export function calculateAge(birthDateString?: string): number | null {
  if (!birthDateString) return null;
  
  try {
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) return null;
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('Error calculating age:', error);
    return null;
  }
}

export function getStatusVariant(status: string): "default" | "success" | "destructive" | "warning" | "secondary" {
  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'present':
    case 'approved':
      return 'success';
    case 'inactive':
    case 'failed':
    case 'absent':
    case 'rejected':
      return 'destructive';
    case 'pending':
    case 'late':
    case 'in progress':
      return 'warning';
    default:
      return 'secondary';
  }
}
