
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { UserRound, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

interface TeacherTabProps {
  teacher: any;
  classData: any;
  studentCount: number;
}

const TeacherTab: React.FC<TeacherTabProps> = ({ teacher, classData, studentCount }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin giáo viên</CardTitle>
        </CardHeader>
        <CardContent>
          {teacher ? (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {teacher.hinh_anh ? (
                  <img 
                    src={teacher.hinh_anh} 
                    alt={teacher.ten_nhan_su} 
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-slate-200 flex items-center justify-center">
                    <UserRound className="h-10 w-10 text-slate-500" />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">
                  <Link to={`/employees/${teacher.id}`} className="hover:underline">
                    {teacher.ten_nhan_su}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">{teacher.chuc_danh || 'Giáo viên'}</p>
                <p className="text-sm mt-2">Email: {teacher.email || 'N/A'}</p>
                <p className="text-sm">Điện thoại: {teacher.dien_thoai || 'N/A'}</p>
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.location.href = `/employees/${teacher.id}`}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Không tìm thấy thông tin giáo viên.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Thông tin lớp học</CardTitle>
        </CardHeader>
        <CardContent>
          {classData ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Tên lớp:</span>
                <Link to={`/classes/${classData.id}`} className="hover:underline">
                  {classData.ten_lop_full}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Chương trình học:</span>
                <span>{classData.ct_hoc || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Ngày bắt đầu:</span>
                <span>{classData.ngay_bat_dau ? format(new Date(classData.ngay_bat_dau), 'dd/MM/yyyy') : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Số học sinh:</span>
                <span>{studentCount}</span>
              </div>
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.href = `/classes/${classData.id}`}
                >
                  <BookOpen className="h-4 w-4 mr-1" /> Xem chi tiết lớp học
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Không tìm thấy thông tin lớp học.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TeacherTab;
