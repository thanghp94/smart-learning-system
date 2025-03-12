
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, ArrowLeft, Save, X } from 'lucide-react';

interface EmployeeHeaderProps {
  employeeName: string;
  isEditing: boolean;
  handleBack: () => void;
  handleEditToggle: () => void;
  handleSave: () => void;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
  employeeName,
  isEditing,
  handleBack,
  handleEditToggle,
  handleSave,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={handleBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold">{employeeName}</h1>
      </div>
      
      {isEditing ? (
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEditToggle}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Lưu
          </Button>
        </div>
      ) : (
        <Button onClick={handleEditToggle}>
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
      )}
    </div>
  );
};

export default EmployeeHeader;
