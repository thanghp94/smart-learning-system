
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatDate = (date: string | Date | undefined) => {
  if (!date) return "N/A";
  try {
    return format(new Date(date), "dd/MM/yyyy", { locale: vi });
  } catch (e) {
    return String(date);
  }
};

export const formatTime = (time: string | undefined) => {
  if (!time) return "N/A";
  return time.substring(0, 5); // Format HH:MM
};

export const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return "N/A";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const formatStatus = (status: string | undefined) => {
  if (!status) return "N/A";
  
  switch (status.toLowerCase()) {
    case 'active':
      return "Đang hoạt động";
    case 'pending':
      return "Chờ xử lý";
    case 'completed':
      return "Hoàn thành";
    case 'approved':
      return "Đã phê duyệt";
    case 'rejected':
      return "Đã từ chối";
    case 'review_needed':
      return "Cần xem xét";
    case 'inactive':
      return "Không hoạt động";
    case 'closed':
      return "Đã đóng";
    default:
      return status;
  }
};

// Add the missing format functions
export const formatGender = (gender: string | undefined) => {
  if (!gender) return "N/A";
  
  switch (gender.toLowerCase()) {
    case 'male':
      return "Nam";
    case 'female':
      return "Nữ";
    case 'other':
      return "Khác";
    default:
      return gender;
  }
};

export const formatStudentStatus = (status: string | undefined) => {
  if (!status) return "N/A";
  
  switch (status.toLowerCase()) {
    case 'active':
      return "Đang học";
    case 'completed':
      return "Đã hoàn thành";
    case 'pending':
      return "Chờ xử lý";
    case 'left':
      return "Đã nghỉ";
    case 'suspended':
      return "Tạm ngưng";
    default:
      return status;
  }
};
