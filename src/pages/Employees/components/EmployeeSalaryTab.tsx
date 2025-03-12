
import React from 'react';

interface EmployeeSalaryTabProps {
  employeeId: string;
}

const EmployeeSalaryTab: React.FC<EmployeeSalaryTabProps> = ({ employeeId }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Thông tin lương</h2>
      {/* Placeholder for salary information */}
      <p className="text-muted-foreground">Đang phát triển...</p>
    </div>
  );
};

export default EmployeeSalaryTab;
