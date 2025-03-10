
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BookOpen, Users, School, Building, Calendar, ClipboardList, 
  GraduationCap, Landmark, FileText, Phone, PieChart, Clock,
  Database, Settings, User, Mail, FileBox, Boxes, Award, FolderInput,
  Briefcase as BriefcaseIcon,
  CheckSquare as CalendarCheckIcon,
  ClipboardCheck as ClipboardIcon,
  UserCheck as UserCheckIcon,
  Building2 as Building2Icon,
  PanelLeftOpen as PanelLeftIcon,
  Tag as TagIcon,
  DollarSign as CircleDollarSignIcon,
  ImageIcon,
  FolderOpen as FolderOpenIcon,
  Package as PackageIcon,
  FileQuestion as FileQuestionIcon,
  FileSymlink as FileSymlinkIcon
} from 'lucide-react';

export interface NavLink {
  title: string;
  href: string;
  icon: React.ReactNode;
  section?: string;
}

export const adminLinks: NavLink[] = [
  {
    title: 'Trang chủ',
    href: '/',
    icon: <PieChart className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Học sinh',
    href: '/students',
    icon: <GraduationCap className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Tuyển sinh',
    href: '/admissions',
    icon: <FolderInput className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Lớp học',
    href: '/classes',
    icon: <School className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Cơ sở',
    href: '/facilities',
    icon: <Building className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Nhân viên',
    href: '/employees',
    icon: <User className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Sự kiện',
    href: '/events',
    icon: <Calendar className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Ghi danh',
    href: '/enrollments',
    icon: <ClipboardList className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Nhiệm vụ',
    href: '/tasks',
    icon: <Award className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Buổi học',
    href: '/lessons',
    icon: <BookOpen className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Đánh giá',
    href: '/evaluations',
    icon: <Users className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Tài chính',
    href: '/finance',
    icon: <Landmark className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Lương',
    href: '/payroll',
    icon: <FileText className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Liên hệ',
    href: '/contacts',
    icon: <Phone className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Tài liệu',
    href: '/files',
    icon: <FileBox className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Tài sản',
    href: '/assets',
    icon: <Boxes className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Đề xuất',
    href: '/requests',
    icon: <Mail className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Điểm danh',
    href: '/attendance',
    icon: <Clock className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Cơ sở dữ liệu',
    href: '/database-schema',
    icon: <Database className="h-4 w-4" />,
    section: 'admin'
  },
  {
    title: 'Cài đặt',
    href: '/settings',
    icon: <Settings className="h-4 w-4" />,
    section: 'admin'
  },
];

export const primaryLinks = [
  { name: 'Học sinh', href: '/students', icon: <Users className="w-5 h-5" /> },
  { name: 'Nhân viên', href: '/employees', icon: <BriefcaseIcon className="w-5 h-5" /> },
  { name: 'Lớp học', href: '/classes', icon: <School className="w-5 h-5" /> },
  { name: 'Buổi học', href: '/teaching-sessions', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Lịch dạy', href: '/teacher-schedule', icon: <CalendarCheckIcon className="w-5 h-5" /> },
  { name: 'Bài học', href: '/lessons', icon: <BookOpen className="w-5 h-5" /> },
  { name: 'Sự kiện', href: '/events', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Công việc', href: '/tasks', icon: <ClipboardIcon className="w-5 h-5" /> },
  { name: 'Chấm công', href: '/attendance', icon: <UserCheckIcon className="w-5 h-5" /> },
];

export const secondaryLinks = [
  { name: 'Cơ sở', href: '/facilities', icon: <Building2Icon className="w-5 h-5" /> },
  { name: 'Ghi danh', href: '/enrollments', icon: <PanelLeftIcon className="w-5 h-5" /> },
  { name: 'Đánh giá', href: '/evaluations', icon: <TagIcon className="w-5 h-5" /> },
  { name: 'Tài chính', href: '/finance', icon: <CircleDollarSignIcon className="w-5 h-5" /> },
  { name: 'Hình ảnh', href: '/images', icon: <ImageIcon className="w-5 h-5" /> },
  { name: 'Tệp tin', href: '/files', icon: <FileText className="w-5 h-5" /> },
  { name: 'Thư mục', href: '/files', icon: <FolderOpenIcon className="w-5 h-5" /> },
  { name: 'Liên hệ', href: '/contacts', icon: <Mail className="w-5 h-5" /> },
  { name: 'Tài sản', href: '/assets', icon: <PackageIcon className="w-5 h-5" /> },
  { name: 'Yêu cầu', href: '/requests', icon: <FileQuestionIcon className="w-5 h-5" /> },
  { name: 'Database', href: '/database-schema', icon: <Database className="w-5 h-5" /> },
  { name: 'Hợp đồng', href: '/employees/contracts', icon: <FileSymlinkIcon className="w-5 h-5" /> },
  { name: 'Cài đặt', href: '/settings', icon: <Settings className="w-5 h-5" /> },
];
