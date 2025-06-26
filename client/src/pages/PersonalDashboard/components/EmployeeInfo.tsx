
import { format } from 'date-fns';
import React from 'react';

interface EmployeeInfoProps {
  employee: any;
}

const EmployeeInfo: React.FC<EmployeeInfoProps> = ({ employee }) => {
  if (!employee) return null;
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">{employee.ten_nhan_su}</h1>
        <p className="text-muted-foreground">{employee.chuc_danh} ({employee.bo_phan})</p>
      </div>
      
      <div className="bg-muted p-3 rounded-md text-sm">
        <div className="grid grid-cols-2 gap-2">
          <span className="font-medium">Ngày sinh:</span>
          <span>{employee.ngay_sinh ? format(new Date(employee.ngay_sinh), 'dd/MM/yyyy') : 'N/A'}</span>
          
          <span className="font-medium">Điện thoại:</span>
          <span>{employee.dien_thoai || 'N/A'}</span>
          
          <span className="font-medium">Email:</span>
          <span>{employee.email || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfo;
