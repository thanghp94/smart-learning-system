
import React from 'react';
import { NavLink } from './types';
import {
  Building2 as Building2Icon,
  PanelLeftOpen as PanelLeftIcon,
  Tag as TagIcon,
  DollarSign as CircleDollarSignIcon,
  Image as ImageIcon,
  FileText,
  FolderOpen as FolderOpenIcon,
  Mail,
  Package as PackageIcon,
  FileQuestion as FileQuestionIcon,
  FileSymlink as FileSymlinkIcon,
  Database,
  Settings
} from 'lucide-react';

export const secondaryLinks: NavLink[] = [
  { 
    title: 'Cơ sở', 
    href: '/facilities', 
    icon: <Building2Icon className="w-5 h-5" /> 
  },
  { 
    title: 'Ghi danh', 
    href: '/enrollments', 
    icon: <PanelLeftIcon className="w-5 h-5" /> 
  },
  { 
    title: 'Đánh giá', 
    href: '/evaluations', 
    icon: <TagIcon className="w-5 h-5" /> 
  },
  { 
    title: 'Tài chính', 
    href: '/finance', 
    icon: <CircleDollarSignIcon className="w-5 h-5" /> 
  },
  { 
    title: 'Hình ảnh', 
    href: '/images', 
    icon: <ImageIcon className="w-5 h-5" /> 
  },
  { 
    title: 'Tệp tin', 
    href: '/files', 
    icon: <FileText className="w-5 h-5" /> 
  },
  { 
    title: 'Thư mục', 
    href: '/folders', 
    icon: <FolderOpenIcon className="w-5 h-5" /> 
  },
  { 
    title: 'Liên hệ', 
    href: '/contacts', 
    icon: <Mail className="w-5 h-5" /> 
  },
  { 
    title: 'Tài sản', 
    href: '/assets', 
    icon: <PackageIcon className="w-5 h-5" /> 
  },
  { 
    title: 'Yêu cầu', 
    href: '/requests', 
    icon: <FileQuestionIcon className="w-5 h-5" /> 
  },
  { 
    title: 'Database', 
    href: '/database-schema', 
    icon: <Database className="w-5 h-5" /> 
  },
  { 
    title: 'Hợp đồng', 
    href: '/employees/contracts', 
    icon: <FileSymlinkIcon className="w-5 h-5" /> 
  },
  { 
    title: 'Cài đặt', 
    href: '/settings', 
    icon: <Settings className="w-5 h-5" /> 
  },
];
