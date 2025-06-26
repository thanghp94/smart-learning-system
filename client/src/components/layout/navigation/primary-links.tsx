import React from 'react';
import { NavLink } from './types';
import { 
  Users, FolderInput, School, Calendar, BookOpen, 
  Sparkles, Clock, ClipboardCheck as ClipboardIcon,
  UserCheck as UserCheckIcon, Briefcase as BriefcaseIcon,
  CheckSquare as CalendarCheckIcon, MapPin
} from 'lucide-react';

export const primaryLinks: NavLink[] = [
  { 
    title: 'Học sinh', 
    href: '/students', 
    icon: <Users className="w-5 h-5" /> 
  },
  { 
    title: 'Tuyển sinh', 
    href: '/admissions', 
    icon: <FolderInput className="w-5 h-5" /> 
  },
  { 
    title: 'Nhân viên', 
    href: '/employees', 
    icon: <BriefcaseIcon className="w-5 h-5" /> 
  },
  { 
    title: 'Lớp học', 
    href: '/classes', 
    icon: <School className="w-5 h-5" /> 
  },
  { 
    title: 'Buổi học', 
    href: '/teaching-sessions', 
    icon: <Calendar className="w-5 h-5" /> 
  },
  { 
    title: 'Lịch dạy', 
    href: '/teacher-schedule', 
    icon: <CalendarCheckIcon className="w-5 h-5" /> 
  },
  { 
    title: 'Bài học', 
    href: '/lessons', 
    icon: <BookOpen className="w-5 h-5" /> 
  },
  { 
    title: 'Sự kiện', 
    href: '/events', 
    icon: <Calendar className="w-5 h-5" /> 
  },
  { 
    title: 'Công việc', 
    href: '/tasks', 
    icon: <ClipboardIcon className="w-5 h-5" /> 
  },
  { 
    title: 'Chấm công', 
    href: '/attendance', 
    icon: <UserCheckIcon className="w-5 h-5" /> 
  },
  { 
    title: 'Công cụ AI', 
    href: '/ai-tools', 
    icon: <Sparkles className="w-5 h-5" /> 
  },
  { 
    title: 'Chấm công GPS',
    href: '/employee-clock-in',
    icon: <MapPin className="w-5 h-5" />,
  },
];

export { secondaryLinks } from './secondary-links';