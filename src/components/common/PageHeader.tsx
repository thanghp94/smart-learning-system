
import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  rightContent?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  icon,
  rightContent 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {icon && <div className="flex-shrink-0 text-gray-700">{icon}</div>}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      {rightContent && (
        <div className="flex-shrink-0">{rightContent}</div>
      )}
    </div>
  );
};

export default PageHeader;
