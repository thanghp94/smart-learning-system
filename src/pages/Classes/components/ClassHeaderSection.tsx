
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Class } from '@/lib/types';

interface ClassHeaderSectionProps {
  classItem: Class;
}

const ClassHeaderSection: React.FC<ClassHeaderSectionProps> = ({ classItem }) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{classItem.ten_lop_full}</h2>
        <Badge variant={classItem.tinh_trang === 'active' ? 'success' : 'destructive'}>
          {classItem.tinh_trang === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </Badge>
      </div>
      <p className="text-muted-foreground">{classItem.ten_lop} - {classItem.ct_hoc}</p>
      
      {classItem.ghi_chu && (
        <div className="mt-4">
          <h3 className="font-medium">Ghi chú:</h3>
          <p className="text-sm text-muted-foreground mt-1">{classItem.ghi_chu}</p>
        </div>
      )}
    </div>
  );
};

export default ClassHeaderSection;
