
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavLink } from './types';

interface LinkGroupProps {
  title: string;
  links: NavLink[];
}

export const LinkGroup: React.FC<LinkGroupProps> = ({ title, links }) => {
  const location = useLocation();
  
  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
        {title}
      </h2>
      <div className="space-y-1">
        {links.map((link) => (
          <Link 
            key={link.href}
            to={link.href}
            className={
              cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                { 'bg-gray-100': location.pathname === link.href }
              )
            }
          >
            {link.icon}
            <span className="ml-2">{link.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
