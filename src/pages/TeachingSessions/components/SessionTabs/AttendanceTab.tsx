
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const AttendanceTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Điểm danh</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Dữ liệu điểm danh sẽ hiển thị ở đây
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTab;
