
import React from 'react';

interface EmployeeContractsTabProps {
  employeeId: string;
}

const EmployeeContractsTab: React.FC<EmployeeContractsTabProps> = ({ employeeId }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Hợp đồng</h2>
      {/* Placeholder for contracts information */}
      <p className="text-muted-foreground">Đang phát triển...</p>
    </div>
  );
};

export default EmployeeContractsTab;
