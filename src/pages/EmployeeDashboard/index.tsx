
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock, BookOpen, Bot } from 'lucide-react';
import TodayClassesList from './components/TodayClassesList';
import TodayAttendanceCard from './components/TodayAttendanceCard';
import TasksOverview from './components/TasksOverview';
import AIAssistant from './components/AIAssistant';

const EmployeeDashboard = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công việc</CardTitle>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <TasksOverview />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buổi học hôm nay</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <TodayClassesList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chấm công hôm nay</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <TodayAttendanceCard />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
          <Bot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <AIAssistant />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
