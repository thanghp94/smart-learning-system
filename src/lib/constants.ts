
export const NAVIGATION_ITEMS = [
  {
    title: "Trang chủ",
    path: "/",
    icon: "Home"
  },
  {
    title: "Học sinh",
    path: "/students",
    icon: "GraduationCap"
  },
  {
    title: "Nhân viên",
    path: "/employees",
    icon: "Users"
  },
  {
    title: "Lớp học",
    path: "/classes",
    icon: "BookOpen"
  },
  {
    title: "Buổi dạy",
    path: "/teaching-sessions",
    icon: "Calendar"
  },
  {
    title: "Đánh giá",
    path: "/evaluations",
    icon: "ClipboardCheck"
  },
  {
    title: "Tài sản",
    path: "/assets",
    icon: "Package"
  },
  {
    title: "Chuyển tài sản",
    path: "/assets/transfers",
    icon: "TruckLoading"
  },
  {
    title: "Cơ sở",
    path: "/facilities",
    icon: "Building"
  },
  {
    title: "Cấu trúc DB",
    path: "/database-schema",
    icon: "Database"
  }
];

// Status colors for different statuses
export const STATUS_COLORS = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
};

// Genders
export const GENDERS = {
  male: "Nam",
  female: "Nữ",
  other: "Khác"
};

// Page sizes for pagination
export const PAGE_SIZES = [5, 10, 20, 50, 100];

// Dashboard stats
export const DASHBOARD_STATS = [
  {
    title: "Tổng số học sinh",
    value: 256,
    change: 12,
    changeType: "increase",
    icon: "GraduationCap"
  },
  {
    title: "Lớp học hiện tại",
    value: 24,
    change: 2,
    changeType: "increase",
    icon: "BookOpen"
  },
  {
    title: "Nhân viên",
    value: 18,
    change: 0,
    changeType: "neutral",
    icon: "Users"
  },
  {
    title: "Doanh thu tháng",
    value: "120.5M",
    change: 8.2,
    changeType: "increase",
    icon: "TrendingUp"
  }
];
