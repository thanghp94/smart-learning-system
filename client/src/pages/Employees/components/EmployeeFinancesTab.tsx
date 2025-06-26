
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface EmployeeFinancesTabProps {
  employeeId: string;
}

const EmployeeFinancesTab: React.FC<EmployeeFinancesTabProps> = ({ employeeId }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Tài chính nhân viên</h3>
        <p className="text-muted-foreground">
          Thông tin tài chính của nhân viên sẽ được hiển thị ở đây.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmployeeFinancesTab;
