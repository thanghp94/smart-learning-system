
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface EmployeeContractTabProps {
  employeeId: string;
}

const EmployeeContractTab: React.FC<EmployeeContractTabProps> = ({ employeeId }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Hợp đồng nhân viên</h3>
        <p className="text-muted-foreground">
          Danh sách hợp đồng của nhân viên sẽ được hiển thị ở đây.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmployeeContractTab;
