
import React from 'react';
import { Employee } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import EmployeeBasicInfo from './EmployeeBasicInfo';
import EmployeeContactInfo from './EmployeeContactInfo';
import EmployeeWorkInfo from './EmployeeWorkInfo';

interface EmployeeBasicInfoTabProps {
  employee: Employee | null;
  tempEmployeeData: Employee | null;
  facilities: any[];
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageUpload: (url: string) => void;
  handleDateChange: (name: string, value: Date | null) => void;
  handleMultiSelectChange: (name: string, value: string[]) => void;
}

const EmployeeBasicInfoTab: React.FC<EmployeeBasicInfoTabProps> = ({
  employee,
  tempEmployeeData,
  facilities,
  isEditing,
  handleChange,
  handleImageUpload,
  handleDateChange,
  handleMultiSelectChange,
}) => {
  if (!employee) return null;

  const currentData = isEditing ? tempEmployeeData : employee;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="pt-6">
          <EmployeeBasicInfo 
            employee={currentData}
            isEditing={isEditing}
            handleChange={handleChange}
            handleImageUpload={handleImageUpload}
            handleDateChange={handleDateChange}
          />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <EmployeeContactInfo 
              employee={currentData}
              isEditing={isEditing}
              handleChange={handleChange}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <EmployeeWorkInfo 
              employee={currentData}
              facilities={facilities}
              isEditing={isEditing}
              handleChange={handleChange}
              handleMultiSelectChange={handleMultiSelectChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeBasicInfoTab;
