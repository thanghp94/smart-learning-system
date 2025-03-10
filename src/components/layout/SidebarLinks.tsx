
import React from 'react';
import { 
  Users, Briefcase, School, Calendar, BookOpen, FileText, 
  Image, Clipboard, Building2, PanelLeft, Tag, CircleDollarSign, 
  FolderOpen, Mail, Package, FileQuestion, Database, CalendarCheck,
  Clock, UserCheck
} from 'lucide-react';

export const primaryLinks = [
  { name: 'Học sinh', href: '/students', icon: <Users className="w-5 h-5" /> },
  { name: 'Nhân viên', href: '/employees', icon: <Briefcase className="w-5 h-5" /> },
  { name: 'Lớp học', href: '/classes', icon: <School className="w-5 h-5" /> },
  { name: 'Buổi học', href: '/teaching-sessions', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Lịch dạy', href: '/teacher-schedule', icon: <CalendarCheck className="w-5 h-5" /> },
  { name: 'Bài học', href: '/lessons', icon: <BookOpen className="w-5 h-5" /> },
  { name: 'Sự kiện', href: '/events', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Công việc', href: '/tasks', icon: <Clipboard className="w-5 h-5" /> },
  { name: 'Chấm công', href: '/attendance', icon: <UserCheck className="w-5 h-5" /> },
];

export const secondaryLinks = [
  { name: 'Cơ sở', href: '/facilities', icon: <Building2 className="w-5 h-5" /> },
  { name: 'Ghi danh', href: '/enrollments', icon: <PanelLeft className="w-5 h-5" /> },
  { name: 'Đánh giá', href: '/evaluations', icon: <Tag className="w-5 h-5" /> },
  { name: 'Tài chính', href: '/finance', icon: <CircleDollarSign className="w-5 h-5" /> },
  { name: 'Hình ảnh', href: '/images', icon: <Image className="w-5 h-5" /> },
  { name: 'Tệp tin', href: '/files', icon: <FileText className="w-5 h-5" /> },
  { name: 'Thư mục', href: '/files', icon: <FolderOpen className="w-5 h-5" /> },
  { name: 'Liên hệ', href: '/contacts', icon: <Mail className="w-5 h-5" /> },
  { name: 'Tài sản', href: '/assets', icon: <Package className="w-5 h-5" /> },
  { name: 'Yêu cầu', href: '/requests', icon: <FileQuestion className="w-5 h-5" /> },
  { name: 'Database', href: '/database-schema', icon: <Database className="w-5 h-5" /> },
];
