
import React from 'react';
import EmployeeDetail from '../EmployeeDetail';

interface EmployeeDetailWrapperProps {
  employeeId: string;
  onFileUpload?: (file: File) => Promise<void>;
}

const EmployeeDetailWrapper: React.FC<EmployeeDetailWrapperProps> = ({ employeeId, onFileUpload }) => {
  return <EmployeeDetail employeeId={employeeId} onFileUpload={onFileUpload || (() => Promise.resolve())} />;
};

export default EmployeeDetailWrapper;
