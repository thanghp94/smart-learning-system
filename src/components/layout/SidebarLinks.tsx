
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { PieChart } from 'lucide-react';
import { LinkGroup } from './navigation/LinkGroup';
import { adminLinks } from './navigation/admin-links';
import { primaryLinks } from './navigation/primary-links';
import { secondaryLinks } from './navigation/secondary-links';
import { aiLinks } from './navigation/ai-links';

// Re-export links for use in Sidebar.tsx
export { primaryLinks, secondaryLinks } from './navigation/primary-links';

export default function SidebarLinks() {
  const location = useLocation();
  
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
                { 'bg-gray-100': location.pathname === '/' }
              )
            }
          >
            <PieChart className="mr-2 h-4 w-4" />
            <span>Trang chủ</span>
          </Link>
        </div>
      </div>

      <LinkGroup title="AI Tools" links={aiLinks} />
      <LinkGroup title="Primary Links" links={primaryLinks} />
      <LinkGroup title="Secondary Links" links={secondaryLinks} />
    </div>
  );
}
