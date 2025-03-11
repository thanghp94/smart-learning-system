
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, List, LayoutGrid } from 'lucide-react';
import KanbanView from './KanbanView';
import { Button } from '@/components/ui/button';
import AdmissionTable from './components/AdmissionTable';

const Admissions = () => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quản lý tuyển sinh
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant={viewMode === 'kanban' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Kanban
              </Button>
              <Button 
                variant={viewMode === 'table' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4 mr-2" />
                Danh sách
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'kanban' ? (
            <KanbanView />
          ) : (
            <AdmissionTable />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admissions;
