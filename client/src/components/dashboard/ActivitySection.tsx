
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RecentActivity from './RecentActivity';

interface ActivitySectionProps {
  activities: any[];
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ activities }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
        <CardDescription>
          Các hoạt động mới nhất trong hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RecentActivity activities={activities} />
      </CardContent>
    </Card>
  );
};

export default ActivitySection;
