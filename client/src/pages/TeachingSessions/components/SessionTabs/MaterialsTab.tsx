
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, FileText } from 'lucide-react';

interface MaterialsTabProps {
  setIsImageDialogOpen: (isOpen: boolean) => void;
}

const MaterialsTab: React.FC<MaterialsTabProps> = ({ setIsImageDialogOpen }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Hình ảnh & Tài liệu</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setIsImageDialogOpen(true)}>
            <Camera className="h-4 w-4 mr-1" /> Thêm hình ảnh
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" /> Thêm tài liệu
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="flex items-center justify-center h-40 border rounded bg-gray-50 text-gray-400">
            Chưa có hình ảnh
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialsTab;
