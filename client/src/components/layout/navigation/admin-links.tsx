import React from 'react';
import { NavLink } from './types';
import { 
  PieChart, GraduationCap, FolderInput, School, Building, User, 
  Calendar, ClipboardList, Award, BookOpen, Users, Landmark, 
  FileText, Phone, FileBox, Boxes, Mail, Clock, Database, 
  Settings, Sparkles
} from 'lucide-react';

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
    title: 'Admin Panel',
    href: '/admin',
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
```

```
import React from 'react';
import { NavLink } from './types';
import { 
  PieChart, GraduationCap, FolderInput, School, Building, User, 
  Calendar, ClipboardList, Award, BookOpen, Users, Landmark, 
  FileText, Phone, FileBox, Boxes, Mail, Clock, Database, 
  Settings, Sparkles
} from 'lucide-react';

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
    title: 'Admin Panel',
    href: '/admin',
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