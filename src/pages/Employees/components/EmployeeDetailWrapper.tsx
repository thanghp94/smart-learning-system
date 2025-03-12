
import React from 'react';
import EmployeeDetail from '../EmployeeDetail';

interface EmployeeDetailWrapperProps {
  employeeId: string;
}

const EmployeeDetailWrapper: React.FC<EmployeeDetailWrapperProps> = ({ employeeId }) => {
  return <EmployeeDetail employeeId={employeeId} />;
};

export default EmployeeDetailWrapper;
