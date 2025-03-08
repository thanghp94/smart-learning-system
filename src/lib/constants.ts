
// Navigation
export const NAVIGATION_ITEMS = [
  {
    title: "Tổng quan",
    path: "/",
    icon: "LayoutDashboard"
  },
  {
    title: "Học sinh",
    path: "/students",
    icon: "GraduationCap"
  },
  {
    title: "Lớp học",
    path: "/classes",
    icon: "Bookmark"
  },
  {
    title: "Buổi dạy",
    path: "/teaching-sessions",
    icon: "CalendarDays"
  },
  {
    title: "Nhân viên",
    path: "/employees",
    icon: "Users"
  }
];

// Status colors
export const STATUS_COLORS = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  inactive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
};

// Table page sizes
export const PAGE_SIZES = [10, 20, 30, 50, 100];

// Sample chart colors
export const CHART_COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f97316", // orange
  "#84cc16", // lime
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#0ea5e9", // light blue
  "#6366f1", // indigo
  "#d946ef"  // fuchsia
];

// Dashboard stats
export const DASHBOARD_STATS = [
  {
    title: "Tổng học sinh",
    value: 256,
    change: 12,
    changeType: "increase",
    icon: "GraduationCap"
  },
  {
    title: "Lớp đang hoạt động",
    value: 24,
    change: 2,
    changeType: "increase",
    icon: "Bookmark"
  },
  {
    title: "Buổi dạy trong tuần",
    value: 78,
    change: 5,
    changeType: "increase",
    icon: "CalendarDays"
  },
  {
    title: "Nhân viên",
    value: 32,
    change: 0,
    changeType: "neutral",
    icon: "Users"
  }
];

// Status options
export const STATUS_OPTIONS = {
  active: "Hoạt động",
  inactive: "Không hoạt động",
  pending: "Đang chờ",
  completed: "Hoàn thành"
};

// Genders
export const GENDERS = {
  male: "Nam",
  female: "Nữ",
  other: "Khác"
};
