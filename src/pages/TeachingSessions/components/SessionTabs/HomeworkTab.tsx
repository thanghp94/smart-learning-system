
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AssignmentList from '../AssignmentList';

interface HomeworkTabProps {
  sessionId: string;
  setIsAssignmentDialogOpen: (isOpen: boolean) => void;
}

const HomeworkTab: React.FC<HomeworkTabProps> = ({ 
  sessionId, 
  setIsAssignmentDialogOpen 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bài tập</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setIsAssignmentDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-1" /> Thêm bài tập
        </Button>
      </CardHeader>
      <CardContent>
        <AssignmentList sessionId={sessionId} />
      </CardContent>
    </Card>
  );
};

export default HomeworkTab;
