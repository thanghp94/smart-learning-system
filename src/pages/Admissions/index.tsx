
import React from 'react';
import KanbanView from './KanbanView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users } from 'lucide-react';

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
          <Tabs defaultValue="kanban" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="list">Danh sách</TabsTrigger>
            </TabsList>
            
            <TabsContent value="kanban">
              <KanbanView />
            </TabsContent>
            
            <TabsContent value="list">
              <div className="h-60 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>Danh sách tuyển sinh sẽ được phát triển sau.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admissions;
