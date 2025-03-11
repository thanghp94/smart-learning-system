
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import EntityFinancesView from '@/pages/Finance/components/EntityFinancesView';

interface StudentFinanceTabProps {
  studentId: string;
}

const StudentFinanceTab: React.FC<StudentFinanceTabProps> = ({ studentId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Lịch sử tài chính
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EntityFinancesView entityType="student" entityId={studentId} />
      </CardContent>
    </Card>
  );
};

export default StudentFinanceTab;
