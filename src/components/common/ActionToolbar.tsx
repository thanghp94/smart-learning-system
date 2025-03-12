
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, Plus, FileDown } from 'lucide-react';

interface ActionToolbarProps {
  onRefresh?: () => void;
  onAdd?: () => void;
  onExport?: () => void;
  children?: ReactNode;
  addLabel?: string;
  refreshLabel?: string;
  exportLabel?: string;
  showRefresh?: boolean;
  showAdd?: boolean;
  showExport?: boolean;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onRefresh,
  onAdd,
  onExport,
  children,
  addLabel = 'Thêm mới',
  refreshLabel = 'Làm mới',
  exportLabel = 'Xuất',
  showRefresh = true,
  showAdd = true,
  showExport = true,
}) => {
  return (
    <div className="flex items-center space-x-2 flex-wrap">
      {children}
      
      {showRefresh && (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8" 
          onClick={onRefresh}
          disabled={!onRefresh}
        >
          <RotateCw className="h-4 w-4 mr-1" /> {refreshLabel}
        </Button>
      )}
      
      {showExport && (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8" 
          onClick={onExport}
          disabled={!onExport}
        >
          <FileDown className="h-4 w-4 mr-1" /> {exportLabel}
        </Button>
      )}
      
      {showAdd && (
        <Button 
          size="sm" 
          className="h-8" 
          onClick={onAdd}
          disabled={!onAdd}
        >
          <Plus className="h-4 w-4 mr-1" /> {addLabel}
        </Button>
      )}
    </div>
  );
};

export default ActionToolbar;
