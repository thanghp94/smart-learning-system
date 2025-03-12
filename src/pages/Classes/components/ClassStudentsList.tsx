
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Enrollment } from '@/lib/types';
import ViewEvaluationsButton from '../../Evaluations/ViewEvaluationsButton';

interface ClassStudentsListProps {
  enrollments: Enrollment[];
  onRefresh: () => Promise<void>;
  isLoading: boolean;
}

const ClassStudentsList: React.FC<ClassStudentsListProps> = ({
  enrollments,
  onRefresh,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center my-4">
        <h3 className="text-lg font-medium">Danh sách học sinh</h3>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <Book className="h-4 w-4 mr-1" />
          Làm mới
        </Button>
      </div>
      
      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">Chưa có học sinh nào đăng ký lớp này</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-base">{enrollment.ten_hoc_sinh || 'Học sinh'}</CardTitle>
                  <Badge variant={
                    typeof enrollment.tinh_trang_diem_danh === 'boolean' 
                      ? (enrollment.tinh_trang_diem_danh ? 'success' : 'destructive')
                      : enrollment.tinh_trang_diem_danh === 'active' ? 'success' :
                        enrollment.tinh_trang_diem_danh === 'inactive' ? 'destructive' :
                        'secondary'
                  }>
                    {
                      typeof enrollment.tinh_trang_diem_danh === 'boolean'
                        ? (enrollment.tinh_trang_diem_danh ? 'Đang học' : 'Chưa học')
                        : enrollment.tinh_trang_diem_danh === 'active' ? 'Đang học' :
                          enrollment.tinh_trang_diem_danh === 'inactive' ? 'Đã nghỉ' :
                          enrollment.tinh_trang_diem_danh === 'pending' ? 'Chờ xử lý' :
                          'Khác'
                    }
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Ngày ghi danh:</span>
                    <span>{enrollment.created_at ? format(parseISO(enrollment.created_at), 'dd/MM/yyyy') : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Book className="h-4 w-4 text-muted-foreground" />
                    <span>Học phí:</span>
                    <span>{enrollment.tong_tien || 'Not set'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-0">
                <ViewEvaluationsButton 
                  enrollmentId={enrollment.id}
                  entityType="enrollment"
                  title={`Đánh giá cho ${enrollment.ten_hoc_sinh || 'học sinh'}`}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassStudentsList;
