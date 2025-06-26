
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarIcon, CheckSquare } from 'lucide-react';

const AdditionalInfoCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Lịch hôm nay</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CalendarIcon className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>Không có lịch hôm nay</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CheckSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>Chưa có hoạt động nào gần đây</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdditionalInfoCards;
