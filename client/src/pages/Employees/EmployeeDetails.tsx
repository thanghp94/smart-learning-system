import React from 'react';
import { useParams } from 'react-router-dom';
import EmployeeDetail from './EmployeeDetail';

const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Không tìm thấy ID nhân viên</div>;
  }

  return <EmployeeDetail employeeId={id} />;
};

export default EmployeeDetails;