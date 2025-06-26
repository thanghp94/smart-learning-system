
import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  rightContent?: React.ReactNode;
  children?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  icon,
  rightContent,
  children,
  action
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
      {(rightContent || children || action) && (
        <div className="flex-shrink-0 flex items-center gap-2">
          {rightContent}
          {children}
          {action && (
            <button 
              onClick={action.onClick}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
