
import React from 'react';
import { Calendar, User, Building, Users } from 'lucide-react';
import { Class } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ClassInfoSectionProps {
  classItem: Class;
  enrollmentCount: number;
}

const ClassInfoSection: React.FC<ClassInfoSectionProps> = ({ classItem, enrollmentCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">Ngày bắt đầu:</span>
        <span>{classItem.ngay_bat_dau ? formatDate(classItem.ngay_bat_dau) : 'Chưa có'}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">Giáo viên chính:</span>
        <span>{classItem.teacher_name || 'Not assigned'}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Building className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">Cơ sở:</span>
        <span>{classItem.facility_name || 'Not assigned'}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">Số học sinh:</span>
        <span>{enrollmentCount}</span>
      </div>
    </div>
  );
};

export default ClassInfoSection;
