
import { TableInfo, TableCategory, ViewInfo } from "../types";

// Define tables and their purposes
export const tables: TableInfo[] = [
  {
    name: "students",
    vietnameseName: "HocSinh",
    purpose: "Stores student information including personal details, contact information, and enrollment status.",
    key: "students"
  },
  {
    name: "classes",
    vietnameseName: "Lop_chi_tiet",
    purpose: "Stores detailed information about classes including schedule, curriculum, and assigned teachers.",
    key: "classes"
  },
  {
    name: "sessions",
    vietnameseName: "Session",
    purpose: "Stores lesson plans, content outlines, and educational materials for teaching sessions.",
    key: "sessions"
  },
  {
    name: "teaching_sessions",
    vietnameseName: "buoi_day",
    purpose: "Tracks individual teaching sessions, including attendance, teacher evaluations, and session notes.",
    key: "teaching-sessions"
  },
  {
    name: "enrollments",
    vietnameseName: "Ghi_danh",
    purpose: "Links students to classes and tracks attendance records and performance evaluations.",
    key: "enrollments"
  },
  {
    name: "facilities",
    vietnameseName: "CoSo",
    purpose: "Holds data about educational facilities, branches, or physical locations and their contact information.",
    key: "facilities"
  },
  {
    name: "employees",
    vietnameseName: "NhanVien",
    purpose: "Manages employee information including roles, contact details, and assignment to facilities.",
    key: "employees"
  },
  {
    name: "events",
    vietnameseName: "Su_kien",
    purpose: "Tracks events such as meetings, workshops, or recruitment activities with scheduling information.",
    key: "events"
  },
  {
    name: "tasks",
    vietnameseName: "Viec_can_lam",
    purpose: "Manages tasks or to-do items assigned to employees with deadlines and completion status.",
    key: "tasks"
  },
  {
    name: "images",
    vietnameseName: "image",
    purpose: "Manages image or media files associated with various database entities like students or facilities.",
    key: "images"
  },
  {
    name: "settings",
    vietnameseName: "Cai_dat",
    purpose: "Stores configuration or system settings data for the application.",
    key: "settings"
  },
  {
    name: "payrolls",
    vietnameseName: "LuongHC",
    purpose: "Tracks employee payroll details including salary, benefits, and payment records.",
    key: "payrolls"
  },
  {
    name: "finances",
    vietnameseName: "thu_chi",
    purpose: "Manages income and expense records for financial tracking and reporting.",
    key: "finances"
  },
  {
    name: "evaluations",
    vietnameseName: "danh_gia",
    purpose: "Stores evaluation or feedback data for students, teachers, or classes.",
    key: "evaluations"
  },
  {
    name: "files",
    vietnameseName: "Ho_so",
    purpose: "Manages documents and files related to various entities like students, employees, or facilities.",
    key: "files"
  },
  {
    name: "assets",
    vietnameseName: "CSVC",
    purpose: "Tracks organizational assets or equipment including location, status, and ownership information.",
    key: "assets"
  },
  {
    name: "requests",
    vietnameseName: "XinPhep_Dexuat",
    purpose: "Manages employee requests such as leave proposals or resource requisitions.",
    key: "requests"
  },
  {
    name: "contacts",
    vietnameseName: "Lien_he",
    purpose: "Stores external contact information for partners, vendors, or other relationships.",
    key: "contacts"
  },
  {
    name: "asset_transfers",
    vietnameseName: "Chuyen_CSVC",
    purpose: "Records the transfer of assets between facilities, departments, or individuals.",
    key: "asset-transfers"
  },
  {
    name: "activities",
    vietnameseName: "Hoat_dong",
    purpose: "Logs user activities and system events for auditing and monitoring purposes.",
    key: "activities"
  }
];

// Define database views
export const views: ViewInfo[] = [
  {
    name: "classes_with_student_count",
    purpose: "View that provides class information along with the count of enrolled students for each class.",
    key: "classes-count"
  },
  {
    name: "teaching_sessions_with_avg_score",
    purpose: "View that provides teaching session information with calculated average evaluation scores.",
    key: "sessions-scores"
  },
  {
    name: "students_tuition_status",
    purpose: "View that shows student information with their current tuition payment status (current, due soon, or overdue).",
    key: "tuition-status"
  },
  {
    name: "employee_payroll_summary",
    purpose: "View that summarizes employee payroll information by month, including totals for salary and insurance.",
    key: "payroll-summary"
  },
  {
    name: "finance_by_facility",
    purpose: "View that aggregates financial data by facility, showing income and expenses grouped by month.",
    key: "finance-facility"
  },
  {
    name: "teaching_session_evaluations",
    purpose: "View that combines teaching sessions with their evaluation data for comprehensive analysis of teacher performance.",
    key: "session-evaluations"
  },
  {
    name: "student_evaluations_summary",
    purpose: "View that summarizes student evaluation data across multiple criteria for performance tracking.",
    key: "student-eval-summary"
  },
  {
    name: "facility_asset_inventory",
    purpose: "View that provides an inventory of assets by facility for easy tracking and management.",
    key: "facility-assets"
  },
  {
    name: "contact_by_purpose",
    purpose: "View that organizes contacts by their relationship type or purpose for better contact management.",
    key: "contact-purpose"
  },
  {
    name: "task_completion_by_employee",
    purpose: "View that summarizes task completion rates and statuses grouped by assigned employees.",
    key: "task-completion"
  },
  {
    name: "upcoming_events",
    purpose: "View that lists upcoming events with relevant details for planning and preparation.",
    key: "upcoming-events"
  }
];

// Group tables by category for better organization
export const tableCategories: TableCategory[] = [
  {
    name: "Academic",
    key: "academic",
    tables: tables.filter(t => ["students", "classes", "sessions", "teaching_sessions", "enrollments", "evaluations"].includes(t.name))
  },
  {
    name: "Administration",
    key: "administration",
    tables: tables.filter(t => ["facilities", "employees", "payrolls", "requests", "tasks"].includes(t.name))
  },
  {
    name: "Resources",
    key: "resources",
    tables: tables.filter(t => ["assets", "asset_transfers", "files", "images"].includes(t.name))
  },
  {
    name: "Finance",
    key: "finance",
    tables: tables.filter(t => ["finances", "payrolls"].includes(t.name))
  },
  {
    name: "Other",
    key: "other",
    tables: tables.filter(t => ["events", "contacts", "settings", "activities"].includes(t.name))
  }
];
