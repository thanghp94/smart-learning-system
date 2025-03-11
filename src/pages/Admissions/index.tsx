
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import KanbanView from './KanbanView';

const Admissions = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quản lý tuyển sinh
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <KanbanView />
        </CardContent>
      </Card>
    </div>
  );
};

export default Admissions;
