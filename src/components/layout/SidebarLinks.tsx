
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
  Image as ImageIcon,
  FolderOpen as FolderOpenIcon,
  Package as PackageIcon,
  FileQuestion as FileQuestionIcon,
  FileSymlink as FileSymlinkIcon,
  Sparkles,
  MessageSquare,
  Video
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
    title: 'Công cụ AI',
    href: '/ai-tools',
    icon: <Sparkles className="h-4 w-4" />,
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
  { name: 'Tuyển sinh', href: '/admissions', icon: <FolderInput className="w-5 h-5" /> },
  { name: 'Nhân viên', href: '/employees', icon: <BriefcaseIcon className="w-5 h-5" /> },
  { name: 'Lớp học', href: '/classes', icon: <School className="w-5 h-5" /> },
  { name: 'Buổi học', href: '/teaching-sessions', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Lịch dạy', href: '/teacher-schedule', icon: <CalendarCheckIcon className="w-5 h-5" /> },
  { name: 'Bài học', href: '/lessons', icon: <BookOpen className="w-5 h-5" /> },
  { name: 'Sự kiện', href: '/events', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Công việc', href: '/tasks', icon: <ClipboardIcon className="w-5 h-5" /> },
  { name: 'Chấm công', href: '/attendance', icon: <UserCheckIcon className="w-5 h-5" /> },
  { name: 'Công cụ AI', href: '/ai-tools', icon: <Sparkles className="w-5 h-5" /> },
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

export default function SidebarLinks() {
  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Dashboard
        </h2>
        <div className="space-y-1">
          <Link 
            to="/"
            className={
              cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                { 'bg-gray-100': useLocation().pathname === '/' }
              )
            }
          >
            <PieChart className="mr-2 h-4 w-4" />
            <span>Trang chủ</span>
          </Link>
        </div>
      </div>

      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          AI Tools
        </h2>
        <div className="space-y-1">
          <Link 
            to="/ai-commands" 
            className={
              cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                { 'bg-gray-100': useLocation().pathname === '/ai-commands' }
              )
            }
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Trợ lý ra lệnh</span>
          </Link>
          <Link 
            to="/ai-tools/image-generator" 
            className={
              cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                { 'bg-gray-100': useLocation().pathname === '/ai-tools/image-generator' }
              )
            }
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            <span>Tạo hình ảnh AI</span>
          </Link>
        </div>
      </div>

      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Primary Links
        </h2>
        <div className="space-y-1">
          {primaryLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.href}
              className={
                cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                  { 'bg-gray-100': useLocation().pathname === link.href }
                )
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Secondary Links
        </h2>
        <div className="space-y-1">
          {secondaryLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.href}
              className={
                cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                  { 'bg-gray-100': useLocation().pathname === link.href }
                )
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
