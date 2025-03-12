
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, FileEdit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TeachingSession, Class } from '@/lib/types';
import AddTeachingSessionButton from '../AddTeachingSessionButton';

interface ClassSessionsListProps {
  sessions: TeachingSession[];
  classItem: Class;
  onRefresh: () => Promise<void>;
  isLoading: boolean;
}

const ClassSessionsList: React.FC<ClassSessionsListProps> = ({
  sessions,
  classItem,
  onRefresh,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center my-4">
        <h3 className="text-lg font-medium">Danh sách buổi học</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <Calendar className="h-4 w-4 mr-1" />
            Làm mới
          </Button>
          <AddTeachingSessionButton 
            classItem={classItem} 
            onSuccess={onRefresh}
          />
        </div>
      </div>
      
      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">Chưa có buổi học nào</p>
            <div className="mt-4">
              <AddTeachingSessionButton 
                classItem={classItem} 
                onSuccess={onRefresh}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">
                      {session.lesson_content || 'Session'} - {session.ngay_hoc ? format(parseISO(session.ngay_hoc), 'dd/MM/yyyy') : 'No date'}
                    </CardTitle>
                    <CardDescription>
                      {session.teacher_name || 'Not assigned'}
                    </CardDescription>
                  </div>
                  <Badge variant={
                    session.tinh_trang ? 
                      (session.tinh_trang === 'active' || session.tinh_trang === 'completed' ? 'success' : 
                       session.tinh_trang === 'cancelled' ? 'destructive' : 'secondary') :
                      'secondary'
                  }>
                    {
                      session.tinh_trang ? 
                        (session.tinh_trang === 'active' || session.tinh_trang === 'completed' ? 'Đã hoàn thành' : 
                         session.tinh_trang === 'cancelled' ? 'Đã hủy' : 
                         session.tinh_trang === 'scheduled' ? 'Đã lên lịch' : 'Chưa xác định') :
                        'Chưa xác định'
                    }
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {session.nhan_xet_1 ? (
                  <p className="text-sm">{session.nhan_xet_1}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Chưa có nội dung</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-0">
                <Button variant="outline" size="sm">
                  <FileEdit className="h-4 w-4 mr-1" />
                  Chi tiết
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassSessionsList;
