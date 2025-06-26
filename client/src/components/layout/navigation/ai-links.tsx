
import React from 'react';
import { NavLink } from './types';
import { Sparkles, MessageSquare, Image } from 'lucide-react';

export const aiLinks: NavLink[] = [
  { 
    title: 'Trợ lý ra lệnh', 
    href: '/ai-commands', 
    icon: <MessageSquare className="h-4 w-4" /> 
  },
  { 
    title: 'Tạo hình ảnh AI', 
    href: '/ai-tools/image-generator', 
    icon: <Image className="h-4 w-4" /> 
  },
];
