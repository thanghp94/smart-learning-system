
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layers, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Enrollment {
  id: string;
  lop_chi_tiet_id?: string;
  ten_lop?: string;
  ten_lop_full?: string;
  ct_hoc?: string;
  tinh_trang_diem_danh?: string;
}

interface StudentEnrollmentsTabProps {
  enrollments: Enrollment[];
}

const StudentEnrollmentsTab: React.FC<StudentEnrollmentsTabProps> = ({ enrollments }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Layers className="mr-2 h-5 w-5" />
          Lớp đã ghi danh
        </CardTitle>
      </CardHeader>
      <CardContent>
        {enrollments.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Học sinh chưa được ghi danh vào lớp nào</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => document.querySelector('[value="info"]')?.dispatchEvent(new Event('click'))}
            >
              Đăng ký vào lớp
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{enrollment.ten_lop_full || enrollment.ten_lop || 'Lớp không tên'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {enrollment.ct_hoc ? `Chương trình: ${enrollment.ct_hoc}` : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Trạng thái điểm danh:</p>
                      <Badge variant={enrollment.tinh_trang_diem_danh === 'present' ? 'success' : 
                                    enrollment.tinh_trang_diem_danh === 'absent' ? 'destructive' : 
                                    enrollment.tinh_trang_diem_danh === 'late' ? 'warning' : 'outline'}>
                        {enrollment.tinh_trang_diem_danh === 'present' ? 'Có mặt' : 
                         enrollment.tinh_trang_diem_danh === 'absent' ? 'Vắng mặt' : 
                         enrollment.tinh_trang_diem_danh === 'late' ? 'Đi muộn' : 'Chưa điểm danh'}
                      </Badge>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/classes/${enrollment.lop_chi_tiet_id}`)}
                      >
                        Xem lớp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentEnrollmentsTab;
