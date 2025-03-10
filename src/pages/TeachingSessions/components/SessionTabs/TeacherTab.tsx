
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, Phone, MapPin, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface TeacherTabProps {
  teacher: any;
  classData: any;
  studentCount: number;
}

const TeacherTab: React.FC<TeacherTabProps> = ({ teacher, classData, studentCount }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin giáo viên</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {teacher ? (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                {teacher.hinh_anh ? (
                  <AvatarImage src={teacher.hinh_anh} alt={teacher.ten_nhan_su} />
                ) : (
                  <AvatarFallback className="text-xl">
                    {teacher.ten_nhan_su?.charAt(0) || '?'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{teacher.ten_nhan_su}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Badge variant="outline">{teacher.chuc_danh || 'Giáo viên'}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Thông tin liên hệ</h4>
                {teacher.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{teacher.email}</span>
                  </div>
                )}
                {teacher.dien_thoai && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{teacher.dien_thoai}</span>
                  </div>
                )}
                {teacher.dia_chi && (
                  <div className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                    <span>{teacher.dia_chi}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Thông tin giảng dạy</h4>
                <div className="flex items-center text-sm">
                  <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Bộ phận: {teacher.bo_phan || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Số học sinh: {studentCount}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Lớp: {classData?.ten_lop_full || 'Chưa phân lớp'}</span>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="self-start" asChild>
              <Link to={`/employees/${teacher.id}`}>Xem hồ sơ đầy đủ</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground space-y-2">
            <Users className="h-12 w-12" />
            <p>Chưa có thông tin giáo viên</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherTab;
