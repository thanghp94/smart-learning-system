
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleBarChart } from './ChartComponents';

interface DashboardStudentsTabProps {
  studentData: any[];
}

const DashboardStudentsTab: React.FC<DashboardStudentsTabProps> = ({ studentData }) => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Tăng trưởng học sinh</CardTitle>
        <CardDescription>
          Số lượng học sinh theo tháng trong năm
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <SimpleBarChart data={studentData} />
      </CardContent>
    </Card>
  );
};

export default DashboardStudentsTab;
