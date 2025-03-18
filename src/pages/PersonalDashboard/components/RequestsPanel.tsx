
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, Plus } from 'lucide-react';
import { RequestsList } from './RequestsList';
import { Request } from '@/lib/types';

interface RequestsPanelProps {
  requests: Request[];
  onRefresh: () => void;
  onAddNew: () => void;
}

const RequestsPanel: React.FC<RequestsPanelProps> = ({ requests, onRefresh, onAddNew }) => {
  return (
    <div className="h-full p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Đề xuất</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RotateCw className="h-4 w-4 mr-1" /> Làm mới
          </Button>
          <Button size="sm" onClick={onAddNew}>
            <Plus className="h-4 w-4 mr-1" /> Thêm mới
          </Button>
        </div>
      </div>
      
      <RequestsList requests={requests} />
    </div>
  );
};

export default RequestsPanel;
