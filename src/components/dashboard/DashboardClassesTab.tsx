
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleAreaChart } from './ChartComponents';

interface DashboardClassesTabProps {
  classesData: any[];
}

const DashboardClassesTab: React.FC<DashboardClassesTabProps> = ({ classesData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tăng trưởng lớp học</CardTitle>
        <CardDescription>
          Số lượng lớp học theo tháng trong năm
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <SimpleAreaChart data={classesData} />
      </CardContent>
    </Card>
  );
};

export default DashboardClassesTab;
